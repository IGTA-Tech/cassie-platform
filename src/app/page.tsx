"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ParallaxBackground from "@/components/ParallaxBackground";
import FloatingHearts from "@/components/FloatingHearts";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const plans = [
  {
    name: "Quick Start",
    price: "$19",
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
    cta: "Get Started",
  },
  {
    name: "Spark",
    price: "$29",
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
    cta: "Start Your Journey",
  },
  {
    name: "Journey",
    price: "$49",
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
    cta: "Begin Transformation",
  },
  {
    name: "Transform",
    price: "$79",
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
    cta: "Transform Now",
  },
];

const features = [
  {
    icon: "📝",
    title: "AI-Guided Journaling",
    description: "Daily prompts help you articulate what happened, what you've learned, and who you're becoming.",
  },
  {
    icon: "🤖",
    title: "Your Digital You",
    description: "AI learns from your journal to represent you authentically when your person has questions.",
  },
  {
    icon: "🎵",
    title: "Find the Right Song",
    description: "AI helps you find songs that capture exactly how you feel, with one-click add to your site.",
  },
  {
    icon: "🖼️",
    title: "AI Image Generation",
    description: "Describe your future together and AI generates beautiful visualizations.",
  },
  {
    icon: "🎤",
    title: "Voice Journaling",
    description: "Speak your heart instead of typing. AI transcribes and captures your authentic voice.",
  },
  {
    icon: "📊",
    title: "Track Progress",
    description: "See your growth over time with streaks, word counts, and milestone celebrations.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      <ParallaxBackground />
      <FloatingHearts />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 via-purple-500 to-red-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Cassie
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 transition-colors">
              Log in
            </Link>
            <Link href="/auth/signup" className="btn-primary text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.p variants={fadeUp} className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-4">
            Personal Accountability Platform
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Show them who you&apos;re{" "}
            <span className="bg-gradient-to-r from-orange-500 via-purple-500 to-red-500 bg-clip-text text-transparent text-glow-gradient">
              becoming
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Commit to 30, 60, or 90 days of journaling. Build an AI that speaks as you.
            Create a beautiful private site to share your growth with someone who matters.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup" className="btn-primary text-lg px-8 py-4">
              Start Your Journey
            </Link>
            <Link href="#how-it-works" className="btn-secondary text-lg px-8 py-4">
              See How It Works
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-gradient-to-b from-white to-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-gray-600 max-w-2xl mx-auto">
              From understanding what went wrong to creating something beautiful for them
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-4 gap-8"
          >
            {[
              { step: "1", title: "Talk to AI", desc: "AI helps you understand and articulate what happened" },
              { step: "2", title: "Journal Daily", desc: "Guided prompts for 30, 60, or 90 days of reflection" },
              { step: "3", title: "Build Your Site", desc: "Your entries become a beautiful, password-protected site" },
              { step: "4", title: "Share & Connect", desc: "They can read, react, and talk to your AI" },
            ].map((item) => (
              <motion.div key={item.step} variants={fadeUp} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-gray-600 max-w-2xl mx-auto">
              AI-powered tools to help you process, grow, and communicate
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="glass-card rounded-2xl p-6 parallax-card"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Journey
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-gray-600 max-w-2xl mx-auto">
              One-time payment. No subscriptions. Your site stays forever.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-4 gap-6"
          >
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                className={`rounded-2xl p-6 parallax-card ${
                  plan.highlight
                    ? "bg-gradient-to-br from-orange-500 to-red-500 text-white"
                    : "glass-card"
                }`}
              >
                <div className="mb-4">
                  <span className={`text-sm font-medium ${plan.highlight ? "text-orange-100" : "text-orange-500"}`}>
                    {plan.type}
                  </span>
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                    {plan.price}
                  </span>
                </div>
                <p className={`mb-6 ${plan.highlight ? "text-orange-100" : "text-gray-600"}`}>
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <svg
                        className={`w-5 h-5 mt-0.5 shrink-0 ${plan.highlight ? "text-white" : "text-orange-500"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={plan.highlight ? "text-white" : "text-gray-700"}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className={`block text-center py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                    plan.highlight
                      ? "bg-white text-orange-600 hover:bg-orange-50"
                      : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg"
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="glass-purple rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to show them who you&apos;re becoming?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Start your journey today. Build something meaningful. Give them a window into your growth.
            </p>
            <Link href="/auth/signup" className="btn-primary text-lg px-8 py-4">
              Start Your Journey
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 via-purple-500 to-red-500" />
            <span className="font-semibold text-gray-800">Cassie</span>
          </div>
          <p className="text-gray-500 text-sm">
            Show them who you&apos;re becoming.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
