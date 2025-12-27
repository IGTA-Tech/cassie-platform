"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden flex items-center justify-center">
      <FloatingHearts />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-red-200/30 to-orange-200/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="glass-card rounded-3xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-8">
            We couldn&apos;t complete the authentication. This might happen if the
            link expired or was already used.
          </p>

          <div className="space-y-3">
            <Link href="/auth/login" className="block btn-primary w-full py-3">
              Try signing in again
            </Link>
            <Link
              href="/auth/signup"
              className="block btn-secondary w-full py-3"
            >
              Create a new account
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
