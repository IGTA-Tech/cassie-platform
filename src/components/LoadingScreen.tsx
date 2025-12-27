"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"hearts" | "merge" | "pulse" | "fade">("hearts");
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("loadingSeen")) {
      setShow(false);
      onComplete();
      return;
    }

    const timeline = async () => {
      await new Promise((r) => setTimeout(r, 1500));
      setPhase("merge");

      await new Promise((r) => setTimeout(r, 600));
      setPhase("pulse");

      await new Promise((r) => setTimeout(r, 800));
      setPhase("fade");

      await new Promise((r) => setTimeout(r, 500));

      if (typeof window !== "undefined") {
        sessionStorage.setItem("loadingSeen", "true");
      }
      setShow(false);
      onComplete();
    };

    timeline();
  }, [onComplete]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-orange-200/30 via-purple-200/20 to-red-200/30 rounded-full blur-3xl" />
          </div>

          <div className="relative flex items-center justify-center">
            {/* Orange Heart */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{
                x: phase === "hearts" ? -60 : 0,
                opacity: phase === "fade" ? 0 : 1,
                scale: phase === "pulse" ? [1, 1.2, 1] : 1,
              }}
              transition={{
                x: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const },
                opacity: { duration: 0.5 },
                scale: { duration: 0.6, times: [0, 0.5, 1] },
              }}
              className="absolute"
              style={{
                display: phase === "merge" || phase === "pulse" || phase === "fade" ? "none" : "block"
              }}
            >
              <svg width="80" height="80" viewBox="0 0 24 24" className="drop-shadow-lg">
                <defs>
                  <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fb923c" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#orangeGradient)"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </motion.div>

            {/* Red Heart */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{
                x: phase === "hearts" ? 60 : 0,
                opacity: phase === "fade" ? 0 : 1,
                scale: phase === "pulse" ? [1, 1.2, 1] : 1,
              }}
              transition={{
                x: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const },
                opacity: { duration: 0.5 },
                scale: { duration: 0.6, times: [0, 0.5, 1] },
              }}
              className="absolute"
              style={{
                display: phase === "merge" || phase === "pulse" || phase === "fade" ? "none" : "block"
              }}
            >
              <svg width="80" height="80" viewBox="0 0 24 24" className="drop-shadow-lg">
                <defs>
                  <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f87171" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#redGradient)"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </motion.div>

            {/* Purple Merged Heart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: phase === "merge" || phase === "pulse" ? 1 : 0,
                scale: phase === "pulse" ? [1, 1.3, 1] : phase === "merge" ? 1 : 0.5,
              }}
              transition={{
                opacity: { duration: 0.4 },
                scale: { duration: 0.8, times: [0, 0.5, 1], ease: "easeOut" },
              }}
              className="absolute"
            >
              <svg width="100" height="100" viewBox="0 0 24 24" className="drop-shadow-2xl">
                <defs>
                  <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path
                  fill="url(#purpleGradient)"
                  filter="url(#glow)"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
