import Anthropic from "@anthropic-ai/sdk";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function getUserContext(userName: string) {
  return `You are Otto, ${userName}'s personal AI assistant. You help with scheduling, reminders, and keeping life organized.

## Your Capabilities
- Add events to calendar (when integrated)
- Answer questions about schedule
- Help with planning and reminders
- General conversation and assistance

## How to Respond
- Be friendly and conversational, not robotic
- Keep responses concise
- Ask clarifying questions when needed

## Important
- Be helpful and proactive
- Remember details from the conversation
- If you don't know something, say so honestly`;
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

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: getUserContext(userName),
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    });

    const contentBlock = response.content[0];
    const assistantMessage = contentBlock.type === 'text' ? contentBlock.text : '';

    return NextResponse.json({ content: assistantMessage });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
