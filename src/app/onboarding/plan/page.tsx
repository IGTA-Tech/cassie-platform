"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const plans = [
  {
    id: "quick_start",
    name: "Quick Start",
    price: 19,
    type: "One-time",
    description: "Upload your journey or complete in one session",
    features: [
      "Paste or upload your story",
      "3-page beautiful site",
      "AI chatbot that speaks as you",
      "Password protection",
      "Instant site generation",
    ],
    highlight: false,
    stripePriceId: "price_quick_start", // Replace with actual Stripe price ID
  },
  {
    id: "spark",
    name: "Spark",
    price: 29,
    type: "30 days",
    description: "Daily guided journaling with accountability",
    features: [
      "30 days of guided prompts",
      "AI coach check-ins",
      "Voice-to-text journaling",
      "Full 5-page site",
      "Analytics & read receipts",
      "Email reminders",
    ],
    highlight: true,
    stripePriceId: "price_spark", // Replace with actual Stripe price ID
  },
  {
    id: "journey",
    name: "Journey",
    price: 49,
    type: "60 days",
    description: "Extended journey with deeper reflection",
    features: [
      "Everything in Spark",
      "60 days of growth",
      "Weekly milestone reports",
      "Progress visualization",
      "AI image generation",
      "Song & video finder",
    ],
    highlight: false,
    stripePriceId: "price_journey", // Replace with actual Stripe price ID
  },
  {
    id: "transform",
    name: "Transform",
    price: 79,
    type: "90 days",
    description: "Complete transformation with all features",
    features: [
      "Everything in Journey",
      "90 days of commitment",
      "Custom domain",
      "Lifetime access",
      "Two-way journaling",
      "Priority support",
    ],
    highlight: false,
    stripePriceId: "price_transform", // Replace with actual Stripe price ID
  },
];

export default function PlanSelectionPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    setLoading(true);

    // TODO: Create Stripe checkout session
    // For now, redirect to the recipient name page
    router.push(`/onboarding/recipient?plan=${planId}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden py-12">
      <FloatingHearts />

      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-red-200/20 to-orange-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 via-purple-500 to-red-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Cassie
            </span>
          </Link>

          <motion.h1
            variants={fadeUp}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Choose your journey
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            One-time payment. No subscriptions. Your site stays forever.
          </motion.p>
        </motion.div>

        {/* Plans */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={fadeUp}
              className={`rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                plan.highlight
                  ? "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl shadow-orange-500/20"
                  : selectedPlan === plan.id
                  ? "glass-card ring-2 ring-orange-500"
                  : "glass-card hover:shadow-lg"
              }`}
              onClick={() => !loading && handleSelectPlan(plan.id)}
            >
              {plan.highlight && (
                <div className="mb-2">
                  <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-2">
                <span
                  className={`text-sm font-medium ${
                    plan.highlight ? "text-orange-100" : "text-orange-500"
                  }`}
                >
                  {plan.type}
                </span>
              </div>

              <h3
                className={`text-2xl font-bold mb-2 ${
                  plan.highlight ? "text-white" : "text-gray-900"
                }`}
              >
                {plan.name}
              </h3>

              <div className="mb-4">
                <span
                  className={`text-4xl font-bold ${
                    plan.highlight ? "text-white" : "text-gray-900"
                  }`}
                >
                  ${plan.price}
                </span>
              </div>

              <p
                className={`mb-6 text-sm ${
                  plan.highlight ? "text-orange-100" : "text-gray-600"
                }`}
              >
                {plan.description}
              </p>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <svg
                      className={`w-5 h-5 mt-0.5 shrink-0 ${
                        plan.highlight ? "text-white" : "text-orange-500"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span
                      className={plan.highlight ? "text-white" : "text-gray-700"}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                disabled={loading && selectedPlan === plan.id}
                className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                  plan.highlight
                    ? "bg-white text-orange-600 hover:bg-orange-50"
                    : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg"
                } disabled:opacity-50`}
              >
                {loading && selectedPlan === plan.id ? (
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
                    Processing...
                  </span>
                ) : (
                  "Select Plan"
                )}
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Security note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Secure checkout powered by Stripe
          </div>
        </motion.div>
      </div>
    </main>
  );
}
