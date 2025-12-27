"use client";

import { useEffect, useState } from "react";

interface ParallaxBackgroundProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export default function ParallaxBackground({
  primaryColor = "orange",
  secondaryColor = "red",
  accentColor = "purple",
}: ParallaxBackgroundProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const colorMap: Record<string, string> = {
    orange: "from-orange-400/15 to-orange-500/5",
    red: "from-red-400/15 to-red-500/5",
    purple: "from-purple-400/8 to-transparent",
    teal: "from-teal-400/15 to-teal-500/5",
    blue: "from-blue-400/15 to-blue-500/5",
    green: "from-green-400/15 to-green-500/5",
    pink: "from-pink-400/15 to-pink-500/5",
  };

  return (
    <>
      {/* Primary orb */}
      <div
        className={`fixed top-0 left-0 w-[700px] h-[700px] bg-gradient-to-br ${colorMap[primaryColor] || colorMap.orange} rounded-full blur-3xl pointer-events-none transition-transform duration-100`}
        style={{
          transform: `translate(-50%, calc(-50% + ${scrollY * 0.1}px))`,
        }}
      />

      {/* Secondary orb */}
      <div
        className={`fixed bottom-0 right-0 w-[700px] h-[700px] bg-gradient-to-tl ${colorMap[secondaryColor] || colorMap.red} rounded-full blur-3xl pointer-events-none transition-transform duration-100`}
        style={{
          transform: `translate(50%, calc(50% - ${scrollY * 0.15}px))`,
        }}
      />

      {/* Accent center glow */}
      <div
        className={`fixed top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-br ${colorMap[accentColor] || colorMap.purple} rounded-full blur-3xl pointer-events-none transition-transform duration-100`}
        style={{
          transform: `translate(-50%, calc(-50% + ${scrollY * 0.05}px))`,
        }}
      />
    </>
  );
}
