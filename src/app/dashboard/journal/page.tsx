"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

const prompts = {
  wake_up: [
    "What's on your mind this morning? How are you feeling about today?",
    "What did you dream about last night? Any feelings lingering?",
    "What's one thing you're grateful for right now?",
  ],
  understanding: [
    "What did you understand about yourself today that you didn't before?",
    "What patterns do you notice in your behavior that need to change?",
    "What would you tell yourself from a year ago?",
  ],
  appreciation: [
    "What do you appreciate most about [RECIPIENT]?",
    "What memories with [RECIPIENT] make you smile?",
    "What qualities in [RECIPIENT] do you admire?",
  ],
  commitment: [
    "What concrete step did you take today to become better?",
    "How did you show up differently today?",
    "What promise to yourself did you keep today?",
  ],
};

export default function JournalPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id?: string; name?: string } | null>(null);
  const [recipientName, setRecipientName] = useState("them");
  const [currentDay, setCurrentDay] = useState(1);
  const [totalDays, setTotalDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [content, setContent] = useState("");
  const [promptCategory, setPromptCategory] = useState<keyof typeof prompts>("wake_up");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showAIAssist, setShowAIAssist] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      setUser({
        id: user.id,
        name: user.user_metadata?.full_name || "there",
      });

      // Get onboarding data
      const recipient = localStorage.getItem("onboarding_recipient");
      const plan = localStorage.getItem("onboarding_plan");

      if (recipient) setRecipientName(recipient);
      if (plan) {
        switch (plan) {
          case "spark":
            setTotalDays(30);
            break;
          case "journey":
            setTotalDays(60);
            break;
          case "transform":
            setTotalDays(90);
            break;
        }
      }

      // Set initial prompt
      const category = getPromptCategoryForDay(currentDay);
      setPromptCategory(category);
      const promptList = prompts[category];
      const randomPrompt = promptList[Math.floor(Math.random() * promptList.length)];
      setCurrentPrompt(randomPrompt.replace("[RECIPIENT]", recipient || "them"));

      setLoading(false);
    };

    checkAuth();
  }, [router, currentDay]);

  const getPromptCategoryForDay = (day: number): keyof typeof prompts => {
    const dayOfWeek = day % 7;
    if (dayOfWeek <= 2) return "wake_up";
    if (dayOfWeek <= 4) return "understanding";
    if (dayOfWeek <= 5) return "appreciation";
    return "commitment";
  };

  const getWordCount = () => {
    return content.trim() ? content.trim().split(/\s+/).length : 0;
  };

  const handleSave = async () => {
    if (!content.trim()) return;

    setSaving(true);

    // TODO: Save to Supabase
    // For now, simulate save
    await new Promise((r) => setTimeout(r, 1000));

    setSaving(false);
    setSaved(true);

    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  const handleNewPrompt = () => {
    const promptList = prompts[promptCategory];
    const randomPrompt = promptList[Math.floor(Math.random() * promptList.length)];
    setCurrentPrompt(randomPrompt.replace("[RECIPIENT]", recipientName));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white relative">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-purple-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-red-200/10 to-orange-200/20 rounded-full blur-3xl" />
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
          <span className="text-sm font-medium text-gray-500">
            Day {currentDay} of {totalDays}
          </span>
          <button
            onClick={handleSave}
            disabled={saving || !content.trim()}
            className="btn-primary py-2 px-4 text-sm disabled:opacity-50"
          >
            {saving ? "Saving..." : saved ? "Saved!" : "Save Entry"}
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Today&apos;s Journal
            </h1>
            <p className="text-gray-600">
              Writing for {recipientName}
            </p>
          </div>

          {/* Prompt Card */}
          <motion.div
            key={currentPrompt}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-orange rounded-2xl p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <span className="text-xs font-medium text-orange-600 uppercase tracking-wider">
                  Today&apos;s Prompt
                </span>
                <p className="mt-2 text-lg text-gray-800">{currentPrompt}</p>
              </div>
              <button
                onClick={handleNewPrompt}
                className="shrink-0 p-2 rounded-lg hover:bg-orange-100 transition-colors"
                title="Get new prompt"
              >
                <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Writing Area */}
          <div className="glass-card rounded-2xl p-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your thoughts..."
              className="w-full h-80 bg-transparent border-none resize-none focus:outline-none text-gray-800 text-lg leading-relaxed placeholder:text-gray-400"
            />

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                {/* Voice Recording */}
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-3 rounded-xl transition-all ${
                    isRecording
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  title="Voice to text"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>

                {/* AI Assist */}
                <button
                  onClick={() => setShowAIAssist(!showAIAssist)}
                  className="p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                  title="AI writing help"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </button>
              </div>

              <span className="text-sm text-gray-500">{getWordCount()} words</span>
            </div>
          </div>

          {/* AI Assist Panel */}
          <AnimatePresence>
            {showAIAssist && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-purple rounded-2xl p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-4">AI Writing Help</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="text-left p-3 rounded-xl bg-white/50 hover:bg-white transition-colors text-sm">
                    <span className="font-medium">Make it more vulnerable</span>
                    <p className="text-gray-500 text-xs mt-1">Show deeper emotions</p>
                  </button>
                  <button className="text-left p-3 rounded-xl bg-white/50 hover:bg-white transition-colors text-sm">
                    <span className="font-medium">Make it clearer</span>
                    <p className="text-gray-500 text-xs mt-1">Improve clarity</p>
                  </button>
                  <button className="text-left p-3 rounded-xl bg-white/50 hover:bg-white transition-colors text-sm">
                    <span className="font-medium">Expand on this</span>
                    <p className="text-gray-500 text-xs mt-1">Add more detail</p>
                  </button>
                  <button className="text-left p-3 rounded-xl bg-white/50 hover:bg-white transition-colors text-sm">
                    <span className="font-medium">What else?</span>
                    <p className="text-gray-500 text-xs mt-1">Suggest what to write</p>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quote of the Day */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-6"
          >
            <p className="text-gray-500 italic">
              &ldquo;The only way to do great work is to love what you do.&rdquo;
            </p>
            <p className="text-gray-400 text-sm mt-1">— Steve Jobs</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Success Animation */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Entry Saved!</h2>
              <p className="text-gray-600 mt-2">Day {currentDay} complete</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
