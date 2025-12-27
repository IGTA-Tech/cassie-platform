"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";

function RecipientForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "spark";

  const [recipientName, setRecipientName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Save recipient name to database
    // For now, store in localStorage and redirect to dashboard
    localStorage.setItem("onboarding_recipient", recipientName);
    localStorage.setItem("onboarding_plan", plan);

    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="recipientName"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Who are you creating this for?
        </label>
        <input
          id="recipientName"
          type="text"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          required
          className="w-full px-4 py-4 rounded-xl border border-gray-200 bg-white/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-lg"
          placeholder="Their first name"
        />
        <p className="mt-2 text-sm text-gray-500">
          This is the person who will receive your site and AI companion.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || !recipientName.trim()}
        className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Setting up...
          </span>
        ) : (
          "Continue"
        )}
      </button>
    </form>
  );
}

export default function RecipientPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden flex items-center justify-center">
      <FloatingHearts />

      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-orange-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-to-br from-red-200/20 to-purple-200/30 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg px-6"
      >
        <div className="glass-card rounded-3xl p-8">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 via-purple-500 to-red-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Cassie
            </span>
          </Link>

          {/* Heart icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                className="text-orange-500"
              >
                <defs>
                  <linearGradient
                    id="heartGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#heartGrad)"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Who&apos;s this for?
          </h1>
          <p className="text-gray-600 text-center mb-8">
            The person you want to show who you&apos;re becoming
          </p>

          <Suspense fallback={<div className="text-center text-gray-500">Loading...</div>}>
            <RecipientForm />
          </Suspense>
        </div>
      </motion.div>
    </main>
  );
}
