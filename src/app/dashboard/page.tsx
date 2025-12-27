"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  const [recipientName, setRecipientName] = useState("Someone");
  const [currentDay, setCurrentDay] = useState(1);
  const [totalDays, setTotalDays] = useState(30);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      setUser({
        email: user.email,
        name: user.user_metadata?.full_name || "there",
      });

      // Get onboarding data from localStorage
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

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const progress = (currentDay / totalDays) * 100;

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white relative">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-purple-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-red-200/10 to-orange-200/20 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 via-purple-500 to-red-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Cassie
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Hey, {user?.name?.split(" ")[0]}
            </span>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your journey for {recipientName}
            </h1>
            <p className="text-gray-600">
              Day {currentDay} of {totalDays}
            </p>
          </motion.div>

          {/* Progress Card */}
          <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Progress</h2>
                <p className="text-sm text-gray-500">
                  {Math.round(progress)}% complete
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <span className="text-xl font-bold text-orange-600">
                  {streak} day streak
                </span>
              </div>
            </div>
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
              />
            </div>
          </motion.div>

          {/* Main Actions Grid */}
          <motion.div
            variants={fadeUp}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Today's Journal */}
            <Link
              href="/dashboard/journal"
              className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-2xl">
                  📝
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                    Today&apos;s Journal
                  </h3>
                  <p className="text-sm text-gray-600">
                    Complete your daily entry
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>

            {/* AI Coach */}
            <Link
              href="/dashboard/coach"
              className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                    AI Coach
                  </h3>
                  <p className="text-sm text-gray-600">
                    Get guidance and support
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>

            {/* Preview Site */}
            <Link
              href="/dashboard/preview"
              className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-2xl">
                  👁️
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                    Preview Site
                  </h3>
                  <p className="text-sm text-gray-600">
                    See what they&apos;ll see
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{currentDay}</p>
              <p className="text-sm text-gray-500">Days In</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{currentDay}</p>
              <p className="text-sm text-gray-500">Entries</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Words Written</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">--</p>
              <p className="text-sm text-gray-500">Site Views</p>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="text-center py-8 text-gray-500">
              <p>Your journaling activity will appear here.</p>
              <p className="text-sm mt-2">
                Start with today&apos;s entry to begin your journey!
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
