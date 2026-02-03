"use client";

import { useState, useRef, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Send, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hey ${user?.firstName || "there"}! I'm Otto, your personal assistant. I can help you schedule events, set reminders, and keep track of your life.\n\nTry saying something like:\n- "Add a dentist appointment next Tuesday at 2pm"\n- "What's on my calendar this week?"\n- "Remind me to call mom on Sunday"`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I hit an error. Please try again in a moment!",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
        <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-700 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">O</span>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">Otto</h1>
            <p className="text-xs text-gray-500">Your personal assistant</p>
          </div>
        </div>
        <UserButton afterSignOutUrl="/" />
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] md:max-w-[60%] ${
              message.role === "user"
                ? "bg-sky-500 text-white rounded-2xl rounded-tr-sm"
                : "bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm"
            } px-4 py-3 shadow-sm`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-2 ${message.role === "user" ? "text-sky-200" : "text-gray-400"}`}>
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Otto is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-50 text-gray-900 placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
