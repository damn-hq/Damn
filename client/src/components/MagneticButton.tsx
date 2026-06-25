import { useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "ghost";
  className?: string;
  strength?: number;
  type?: "button" | "submit";
  disabled?: boolean;
};

/**
 * Magnetic button: subtly pulls toward the cursor on hover. Renders as a
 * router Link, anchor, or button depending on props.
 */
export default function MagneticButton({
  children,
  to,
  href,
  onClick,
  variant = "solid",
  className = "",
  strength = 0.4,
  type = "button",
  disabled = false,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300";
  const styles =
    variant === "solid"
      ? "text-ink bg-bone hover:bg-white"
      : "text-bone glass hover:border-white/25";

  const inner = (
    <span
      ref={ref}
      className="inline-flex items-center gap-2 transition-transform duration-300 ease-out will-change-transform"
    >
      {children}
    </span>
  );

  const cls = `${base} ${styles} ${className}`;
  const handlers = { onMouseMove: onMove, onMouseLeave: reset };

  // MPA: `to` is now a plain in-site link (full page nav), same as `href`.
  const linkHref = to ?? href;
  if (linkHref)
    return (
      <a href={linkHref} className={cls} {...handlers}>
        {inner}
      </a>
    );
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${cls} disabled:opacity-60`}
      {...handlers}
    >
      {inner}
    </button>
  );
}
