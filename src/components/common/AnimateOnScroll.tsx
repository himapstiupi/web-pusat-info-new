"use client";

import { useEffect, useRef, ReactNode } from "react";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  /** Extra CSS classes to control direction. e.g. "from-left", "scale-up" */
  variant?: "from-left" | "from-right" | "scale-up" | "default";
  /** Stagger delay index 1–6 */
  stagger?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Percentage of element visible before triggering (0–1). Default 0.1 */
  threshold?: number;
}

export default function AnimateOnScroll({
  children,
  className = "",
  variant = "default",
  stagger,
  threshold = 0.1,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el); // trigger only once
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const variantClass = variant !== "default" ? variant : "";
  const staggerClass = stagger ? `stagger-${stagger}` : "";

  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${variantClass} ${staggerClass} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
