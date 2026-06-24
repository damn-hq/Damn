import { forwardRef, type ReactNode, type HTMLAttributes } from "react";

type GlassProps = {
  children?: ReactNode;
  soft?: boolean;
  sheen?: boolean;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

/** Reusable Apple-style liquid-glass surface. */
const Glass = forwardRef<HTMLDivElement, GlassProps>(function Glass(
  { children, soft, sheen = true, className = "", ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={[
        soft ? "glass-soft" : "glass",
        sheen ? "glass-sheen" : "",
        "rounded-3xl",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
});

export default Glass;
