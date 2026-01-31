"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { MessageSquare, Settings, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { user, isLoaded } = useUser();

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
          <p className="text-gray-600 mb-8">Here is what is happening with your schedule</p>
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
        </div>
      </main>
    </div>
  );
}
