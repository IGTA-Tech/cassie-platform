"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const coachPrompts = [
  "How are you feeling today?",
  "What's on your mind?",
  "Need help with your journal entry?",
  "Want to talk about your progress?",
];

export default function CoachPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [recipientName, setRecipientName] = useState("them");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      setUser({
        name: user.user_metadata?.full_name?.split(" ")[0] || "there",
      });

      const recipient = localStorage.getItem("onboarding_recipient");
      if (recipient) setRecipientName(recipient);

      // Initial greeting
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: `Hey ${user.user_metadata?.full_name?.split(" ")[0] || "there"}! I'm your AI coach. I'm here to help you on your journey to show ${recipient || "them"} who you're becoming. How are you feeling today?`,
        },
      ]);

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input.trim(),
          context: `You are a supportive AI coach helping someone on their personal growth journey.
They are working to improve themselves to reconnect with ${recipientName}.
Be warm, encouraging, and constructive.
Help them reflect on their behavior, understand their patterns, and grow.
Keep responses concise but meaningful.
Ask follow-up questions to help them go deeper.
Celebrate their progress and gently challenge them when needed.`,
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "I'm here to help. Could you tell me more?",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I had trouble responding. Let's try again.",
        },
      ]);
    }

    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white relative flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-indigo-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/10 to-pink-200/20 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-100/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-sm">
              🤖
            </div>
            <span className="font-medium text-gray-900">AI Coach</span>
          </div>
          <div className="w-16" />
        </div>
      </nav>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pt-24 pb-32 px-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-purple-500 to-indigo-500 text-white"
                      : "glass-card"
                  }`}
                >
                  <p className={message.role === "user" ? "text-white" : "text-gray-800"}>
                    {message.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {sending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="glass-card rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="fixed bottom-24 left-0 right-0 px-6">
          <div className="max-w-2xl mx-auto flex flex-wrap gap-2 justify-center">
            {coachPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-gray-200 text-sm text-gray-700 hover:bg-white hover:shadow-md transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-gray-100/50 px-6 py-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
