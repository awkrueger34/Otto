import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + "/api/auth/google/callback";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/dashboard?error=google_auth_denied", process.env.NEXT_PUBLIC_APP_URL!));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/dashboard?error=missing_params", process.env.NEXT_PUBLIC_APP_URL!));
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenResponse.json();

    if (tokens.error) {
      console.error("Token exchange error:", tokens);
      return NextResponse.redirect(new URL("/dashboard?error=token_exchange_failed", process.env.NEXT_PUBLIC_APP_URL!));
    }

    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const userInfo = await userInfoResponse.json();

    let user = await prisma.user.findUnique({ where: { clerkId: state } });

    if (!user) {
      user = await prisma.user.create({
        data: { clerkId: state, email: userInfo.email },
      });
    }

    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

    await prisma.calendarToken.upsert({
      where: { userId: user.id },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || "",
        expiresAt,
        calendarId: userInfo.email,
      },
      create: {
        userId: user.id,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || "",
        expiresAt,
        calendarId: userInfo.email,
      },
    });

    return NextResponse.redirect(new URL("/dashboard?success=calendar_connected", process.env.NEXT_PUBLIC_APP_URL!));
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return NextResponse.redirect(new URL("/dashboard?error=callback_failed", process.env.NEXT_PUBLIC_APP_URL!));
  }
}
