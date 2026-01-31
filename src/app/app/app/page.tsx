"use client";

import { useState } from "react";
import { Calendar, MessageSquare, Bell, Sparkles, Check, ArrowRight } from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Otto</span>
          </div>
          <a href="/sign-in" className="px-4 py-2 text-sky-600 hover:text-sky-700 font-medium transition-colors">
            Sign In
          </a>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Meet your new personal assistant
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            The AI assistant that{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-sky-700">
              actually knows your life
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Otto connects to your calendar, learns about your family, your preferences,
            and your routines. Then helps you plan, schedule, and never forget a thing.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-sky-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Joining..." : (<>Join Waitlist <ArrowRight className="w-4 h-4" /></>)}
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
              <Check className="w-5 h-5" />
              You are on the list! We will be in touch soon.
            </div>
          )}
          <p className="text-sm text-gray-500 mt-4">Join 500+ people waiting for early access</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need in an assistant</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Otto learns about your life and proactively helps you stay organized</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Calendar</h3>
              <p className="text-gray-600">Tell Otto about events in natural language. It becomes a fully detailed calendar event with reminders.</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Knows Your Life</h3>
              <p className="text-gray-600">Otto remembers your family, preferences, and routines. No more repeating yourself every conversation.</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-white border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Proactive Reminders</h3>
              <p className="text-gray-600">Big event coming up? Otto reminds you to book flights, get gifts, and handle the details before you forget.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-sky-600 font-bold">O</span>
            </div>
            <span className="text-white font-semibold">Otto</span>
          </div>
          <p className="text-gray-400 text-sm">© 2026 Otto. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
