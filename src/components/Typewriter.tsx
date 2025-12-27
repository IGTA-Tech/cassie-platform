"use client";

import { useEffect, useState } from "react";

export default function Typewriter({
  text,
  speed = 30,
  startDelay = 400,
  className = "",
}: {
  text: string;
  speed?: number;
  startDelay?: number;
  className?: string;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= text.length) return;

    const timeout = setTimeout(
      () => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      },
      currentIndex === 0 ? startDelay : speed
    );

    return () => clearTimeout(timeout);
  }, [currentIndex, text, speed, startDelay]);

  return (
    <span className={className}>
      {displayedText}
      {currentIndex < text.length && <span className="animate-pulse opacity-70">|</span>}
    </span>
  );
}
