import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
};

/**
 * Scroll-reveal wrapper: fades + rises into view.
 *
 * SSR ships the content visible (plain div, no inline opacity) so crawlers and
 * no-JS clients read it. On the client we *arm* the hidden state, then reveal
 * on scroll via IntersectionObserver — progressive enhancement, not a gate.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced motion: leave content visible, no arming.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.style.setProperty("--reveal-y", `${y}px`);
    el.style.transitionDelay = `${delay}s`;
    el.classList.add("reveal-armed");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-in");
            if (once) io.unobserve(e.target);
          } else if (!once) {
            e.target.classList.remove("reveal-in");
          }
        }
      },
      { rootMargin: "-12% 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay, y, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
