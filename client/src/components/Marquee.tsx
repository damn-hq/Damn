type Props = {
  items: string[];
  className?: string;
};

/** Seamless infinite marquee of keywords. */
export default function Marquee({ items, className = "" }: Props) {
  const row = [...items, ...items];
  return (
    <div
      className={`relative flex overflow-hidden ${className}`}
      style={{
        maskImage:
          "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
      }}
    >
      <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
        {row.map((it, i) => (
          <span
            key={i}
            className="flex items-center gap-10 text-2xl font-light uppercase tracking-tightest text-white/35 sm:text-4xl"
          >
            {it}
            <span className="text-violet-glow">✺</span>
          </span>
        ))}
      </div>
    </div>
  );
}
