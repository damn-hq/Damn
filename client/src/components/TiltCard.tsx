import { useRef, type ReactNode, type HTMLAttributes } from "react";

/**
 * Pointer-tilt glass card with a moving specular glare. Resets smoothly on
 * leave. Wraps the .glass surface.
 */
export default function TiltCard({
  children,
  className = "",
  max = 8,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  max?: number;
} & HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * max * 2;
    const ry = (px - 0.5) * max * 2;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(220px circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.16), transparent 60%)`;
    }
  };
  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
    if (glareRef.current) glareRef.current.style.background = "transparent";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`glass glass-sheen relative overflow-hidden rounded-3xl transition-transform duration-300 ease-out will-change-transform ${className}`}
      {...rest}
    >
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 transition-[background] duration-200"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
