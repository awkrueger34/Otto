"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Otto</span>
          </Link>
          <Link href="/sign-in" className="px-4 py-2 bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-600 transition-colors">
            Sign In
          </Link>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            The AI assistant that <span className="text-sky-600">actually knows your life</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Otto connects to your calendar, learns about your family and routines, then helps you plan and never forget a thing.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 placeholder-gray-400 bg-white"
              />
              <button type="submit" className="px-6 py-3 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors">
                Join Waitlist
              </button>
            </form>
          ) : (
            <p className="text-green-600 font-medium">You are on the list! We will be in touch soon.</p>
          )}

          <p className="text-sm text-gray-500 mt-4">Join 500+ people waiting for early access</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Everything you need in an assistant</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Calendar</h3>
              <p className="text-gray-600">Tell Otto about events in natural language. It becomes a fully detailed calendar event.</p>
            </div>
            <div className="p-6 rounded-2xl bg-purple-50 border border-purple-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Knows Your Life</h3>
              <p className="text-gray-600">Otto remembers your family, preferences, and routines. No more repeating yourself.</p>
            </div>
            <div className="p-6 rounded-2xl bg-green-50 border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🔔</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Proactive Reminders</h3>
              <p className="text-gray-600">Big event coming up? Otto reminds you to handle the details before you forget.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">© 2026 Otto. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
