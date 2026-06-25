import type { ReactNode, HTMLAttributes } from "react";

type GlassProps = {
  children?: ReactNode;
  soft?: boolean;
  sheen?: boolean;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export default function Glass({ children, soft, sheen = true, className = "", ...rest }: GlassProps) {
  return (
    <div
      className={[soft ? "glass-soft" : "glass", sheen ? "glass-sheen" : "", "rounded-3xl", className].join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}
