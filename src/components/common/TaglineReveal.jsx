import React, { useEffect, useRef, useState } from 'react';

export default function TaglineReveal({
  text = "Your life, understood through your daily patterns. Discover what fuels your focus, calm, and restorative sleep.",
  className = ""
}) {
  const containerRef = useRef(null);
  const [activeWords, setActiveWords] = useState(0);
  const words = text.split(" ");

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setActiveWords(words.length);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate words one at a time
            words.forEach((_, idx) => {
              setTimeout(() => {
                setActiveWords((prev) => Math.max(prev, idx + 1));
              }, idx * 75);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [words.length]);

  return (
    <div ref={containerRef} className={`py-8 max-w-[680px] ${className}`}>
      <p className="heading-4 text-charcoal tracking-tight select-none">
        {words.map((word, index) => {
          const isActivated = index < activeWords;
          return (
            <span
              key={index}
              className={`inline-block mr-2 transition-all duration-500 ease-skill-base ${
                isActivated
                  ? "opacity-100 text-charcoal translate-y-0"
                  : "opacity-30 text-charcoal-muted translate-y-1"
              }`}
            >
              {word}
            </span>
          );
        })}
      </p>
    </div>
  );
}
