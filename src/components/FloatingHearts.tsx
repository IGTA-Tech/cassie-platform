"use client";

import { useEffect, useState } from "react";

interface Heart {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

interface FloatingHeartsProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export default function FloatingHearts({
  primaryColor = "rgba(249, 115, 22, 0.12)",
  secondaryColor = "rgba(239, 68, 68, 0.12)",
  accentColor = "rgba(168, 85, 247, 0.10)",
}: FloatingHeartsProps) {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const colors = [primaryColor, secondaryColor, accentColor];

    const newHearts: Heart[] = [];
    for (let i = 0; i < 18; i++) {
      newHearts.push({
        id: i,
        x: Math.random() * 100,
        size: 10 + Math.random() * 14,
        delay: Math.random() * 20,
        duration: 18 + Math.random() * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setHearts(newHearts);
  }, [primaryColor, secondaryColor, accentColor]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float-heart"
          style={{
            left: `${heart.x}%`,
            bottom: "-50px",
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
          }}
        >
          <svg
            width={heart.size}
            height={heart.size}
            viewBox="0 0 24 24"
            fill={heart.color}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
}
