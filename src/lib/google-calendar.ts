import prisma from "./prisma";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: { dateTime?: string; date?: string; timeZone?: string };
  end: { dateTime?: string; date?: string; timeZone?: string };
}

async function refreshAccessToken(userId: string): Promise<string | null> {
  const token = await prisma.calendarToken.findFirst({
    where: { user: { clerkId: userId } },
  });
  if (!token) return null;

  if (token.expiresAt > new Date(Date.now() + 5 * 60 * 1000)) {
    return token.accessToken;
  }

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        refresh_token: token.refreshToken,
        grant_type: "refresh_token",
      }),
    });
    const data = await response.json();
    if (data.error) return null;

    await prisma.calendarToken.update({
      where: { id: token.id },
      data: {
        accessToken: data.access_token,
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
      },
    });
    return data.access_token;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
}

export async function getCalendarConnection(clerkId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { calendarTokens: true },
  });
  if (!user || user.calendarTokens.length === 0) return null;
  return user.calendarTokens[0];
}

export async function getUpcomingEvents(clerkId: string, maxResults = 10, daysAhead = 7): Promise<CalendarEvent[] | null> {
  const accessToken = await refreshAccessToken(clerkId);
  if (!accessToken) return null;

  const token = await prisma.calendarToken.findFirst({ where: { user: { clerkId } } });
  if (!token) return null;

  const timeMin = new Date().toISOString();
  const timeMax = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).toISOString();

  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(token.calendarId)}/events?` +
        new URLSearchParams({ timeMin, timeMax, maxResults: maxResults.toString(), singleEvents: "true", orderBy: "startTime" }),
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const data = await response.json();
    if (data.error) return null;
    return data.items || [];
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return null;
  }
}

export async function createEvent(clerkId: string, event: { title: string; date: string; time?: string; duration?: number; location?: string; description?: string }): Promise<CalendarEvent | null> {
  const accessToken = await refreshAccessToken(clerkId);
  if (!accessToken) return null;

  const token = await prisma.calendarToken.findFirst({ where: { user: { clerkId } } });
  if (!token) return null;

  let calendarEvent: CalendarEvent;
  if (event.time) {
    const startDateTime = new Date(`${event.date}T${event.time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + (event.duration || 1) * 60 * 60 * 1000);
    calendarEvent = {
      summary: event.title,
      location: event.location,
      description: event.description,
      start: { dateTime: startDateTime.toISOString(), timeZone: "America/Los_Angeles" },
      end: { dateTime: endDateTime.toISOString(), timeZone: "America/Los_Angeles" },
    };
  } else {
    calendarEvent = {
      summary: event.title,
      location: event.location,
      description: event.description,
      start: { date: event.date },
      end: { date: event.date },
    };
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(token.calendarId)}/events`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(calendarEvent),
      }
    );
    const data = await response.json();
    if (data.error) return null;
    return data;
  } catch (error) {
    console.error("Failed to create event:", error);
    return null;
  }
}

export function formatEventsForChat(events: CalendarEvent[]): string {
  if (!events || events.length === 0) return "No upcoming events found.";
  return events.map((event) => {
    const start = event.start.dateTime
      ? new Date(event.start.dateTime).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
      : event.start.date;
    let eventStr = `• ${event.summary} - ${start}`;
    if (event.location) eventStr += ` (${event.location})`;
    return eventStr;
  }).join("\n");
}
