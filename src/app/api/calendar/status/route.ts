import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { getCalendarConnection } from "@/lib/google-calendar";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const connection = await getCalendarConnection(userId);

  return NextResponse.json({
    connected: !!connection,
    calendarId: connection?.calendarId || null,
  });
}
