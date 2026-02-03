"use client";

import { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Calendar, MessageSquare, Settings, ChevronRight, Check, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [calendarEmail, setCalendarEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkCalendarStatus() {
      try {
        const res = await fetch("/api/calendar/status");
        const data = await res.json();
        setCalendarConnected(data.connected);
        setCalendarEmail(data.calendarId);
      } catch (error) {
        console.error("Failed to check calendar status:", error);
      } finally {
        setLoading(false);
      }
    }
    if (isLoaded) checkCalendarStatus();
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-700 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">O</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">Otto</span>
        </div>
        <nav className="space-y-2">
          <Link href="/chat" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sky-50 text-sky-700 font-medium">
            <MessageSquare className="w-5 h-5" /> Chat with Otto
          </Link>
          <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
            <Settings className="w-5 h-5" /> My Profile
          </Link>
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <UserButton afterSignOutUrl="/" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.firstName || "User"}</p>
              <p className="text-xs text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="ml-64 p-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.firstName || "there"}!</h1>
          <p className="text-gray-600 mb-8">Here's what's happening with your schedule</p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Link href="/chat" className="p-6 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl text-white hover:from-sky-600 hover:to-sky-700 transition-all group">
              <MessageSquare className="w-8 h-8 mb-3" />
              <h3 className="text-xl font-semibold mb-1">Chat with Otto</h3>
              <p className="text-sky-100 text-sm">Schedule events, ask questions, get help</p>
              <div className="flex items-center gap-1 mt-4 text-sm font-medium group-hover:translate-x-1 transition-transform">
                Start chatting <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
            <Link href="/dashboard/profile" className="p-6 bg-white border border-gray-200 rounded-2xl hover:border-sky-300 hover:shadow-md transition-all group">
              <Settings className="w-8 h-8 mb-3 text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Complete Your Profile</h3>
              <p className="text-gray-600 text-sm">Help Otto learn about your life</p>
              <div className="flex items-center gap-1 mt-4 text-sm font-medium text-sky-600 group-hover:translate-x-1 transition-transform">
                Set up profile <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${calendarConnected ? "bg-green-100" : "bg-gray-100"}`}>
                  <Calendar className={`w-6 h-6 ${calendarConnected ? "text-green-600" : "text-gray-500"}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Google Calendar</h3>
                  {loading ? (
                    <p className="text-sm text-gray-500">Checking connection...</p>
                  ) : calendarConnected ? (
                    <p className="text-sm text-green-600 flex items-center gap-1"><Check className="w-4 h-4" /> Connected to {calendarEmail}</p>
                  ) : (
                    <p className="text-sm text-gray-500">Not connected</p>
                  )}
                </div>
              </div>
              {!loading && !calendarConnected && (
                <a href="/api/auth/google" className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-600 transition-colors">
                  <ExternalLink className="w-4 h-4" /> Connect Calendar
                </a>
              )}
              {!loading && calendarConnected && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Connected</span>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
            <div className="space-y-3">
              <SetupItem title="Create your account" description="Sign up with Google or email" completed={true} />
              <SetupItem title="Connect Google Calendar" description="Give Otto access to read and write events" completed={calendarConnected} action={!calendarConnected ? <a href="/api/auth/google" className="text-sky-600 hover:text-sky-700 text-sm font-medium">Connect</a> : undefined} />
              <SetupItem title="Fill out your profile" description="Add family members, preferences, and recurring reminders" completed={false} href="/dashboard/profile" />
              <SetupItem title="Start chatting" description="Try asking Otto to schedule something!" completed={false} href="/chat" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SetupItem({ title, description, completed, href, action }: { title: string; description: string; completed: boolean; href?: string; action?: React.ReactNode }) {
  const content = (
    <div className={`flex items-center gap-4 p-4 rounded-xl ${completed ? "bg-green-50" : "bg-gray-50 hover:bg-gray-100"} transition-colors`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${completed ? "bg-green-500 text-white" : "border-2 border-gray-300"}`}>
        {completed && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
      </div>
      <div className="flex-1">
        <h3 className={`font-medium ${completed ? "text-green-800" : "text-gray-900"}`}>{title}</h3>
        <p className={`text-sm ${completed ? "text-green-600" : "text-gray-500"}`}>{description}</p>
      </div>
      {action}
      {!completed && href && !action && <ChevronRight className="w-5 h-5 text-gray-400" />}
    </div>
  );
  if (href && !completed && !action) return <Link href={href}>{content}</Link>;
  return content;
}
