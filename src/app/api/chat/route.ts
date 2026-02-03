import Anthropic from "@anthropic-ai/sdk";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { getCalendarConnection, getUpcomingEvents, createEvent, formatEventsForChat } from "@/lib/google-calendar";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function getSystemPrompt(userName: string, hasCalendar: boolean, calendarEvents: string) {
  const calendarInstructions = hasCalendar
    ? `
## Calendar Access
You have FULL access to ${userName}'s Google Calendar. You can read and write events.

### Current Upcoming Events:
${calendarEvents || "No upcoming events found."}

### To ADD an event, include this EXACT format in your response:
[ADD_EVENT: title="Event Title", date="YYYY-MM-DD", time="HH:MM", duration=1.5, location="Optional Location", description="Optional notes"]

Examples:
- [ADD_EVENT: title="Dentist Appointment", date="2024-02-15", time="14:00", duration=1, location="Dr. Smith Office"]
- [ADD_EVENT: title="Team Meeting", date="2024-02-16", time="10:00", duration=1.5]
- [ADD_EVENT: title="Mom Birthday", date="2024-03-20"] (all-day event, no time)

IMPORTANT:
- Always use 24-hour time format (14:00 not 2:00 PM)
- Duration is in hours (1.5 = 90 minutes)
- If user does not specify time, ask them before creating
- After adding an event, confirm what was added
`
    : `
## Calendar Access
${userName} has NOT connected their Google Calendar yet.
When they ask about calendar/scheduling, remind them to connect their calendar from the dashboard.
`;

  return `You are Otto, ${userName}'s personal AI assistant. You help with scheduling, reminders, and keeping life organized.

${calendarInstructions}

## Your Personality
- Friendly and conversational, not robotic
- Keep responses concise
- Ask clarifying questions when needed (especially for dates/times)
- Be proactive and helpful

## When Adding Events
1. Make sure you have: title, date, and time (unless it is all-day)
2. If any info is missing, ask the user
3. Use the [ADD_EVENT: ...] format in your response
4. Confirm the event was added after

## Important
- Be helpful and proactive
- Remember details from the conversation
- If you do not know something, say so honestly
- Keep the conversation natural`;
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    const userName = user?.firstName || "there";
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const calendarConnection = await getCalendarConnection(userId);
    const hasCalendar = !!calendarConnection;

    let calendarEvents = "";
    if (hasCalendar) {
      const events = await getUpcomingEvents(userId, 15, 14);
      if (events) calendarEvents = formatEventsForChat(events);
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: getSystemPrompt(userName, hasCalendar, calendarEvents),
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    });

    const contentBlock = response.content[0];
    let assistantMessage = contentBlock.type === "text" ? contentBlock.text : "";

    const addEventPattern = /\[ADD_EVENT:\s*title="([^"]+)"(?:,\s*date="([^"]+)")?(?:,\s*time="([^"]+)")?(?:,\s*duration=([\d.]+))?(?:,\s*location="([^"]*)")?(?:,\s*description="([^"]*)")?\]/g;

    let match;
    const eventsAdded: string[] = [];

    while ((match = addEventPattern.exec(assistantMessage)) !== null) {
      const [fullMatch, title, date, time, duration, location, description] = match;

      if (hasCalendar && title && date) {
        const result = await createEvent(userId, {
          title,
          date,
          time: time || undefined,
          duration: duration ? parseFloat(duration) : 1,
          location: location || undefined,
          description: description || undefined,
        });
        if (result) eventsAdded.push(title);
      }
      assistantMessage = assistantMessage.replace(fullMatch, "").trim();
    }

    if (eventsAdded.length > 0) {
      assistantMessage += `\n\nAdded to your calendar: ${eventsAdded.join(", ")}`;
    }

    return NextResponse.json({ content: assistantMessage });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
