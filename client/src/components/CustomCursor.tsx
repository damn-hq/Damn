import { useEffect, useRef, useState } from "react";
import { useRaf } from "../hooks/useRaf";

type CursorState = "default" | "link" | "text" | "view" | "disabled";

/**
 * Liquid-glass cursor: a frosted dot + a lagging glass ring that morph by the
 * `data-cursor` attribute of whatever the pointer is over. Native cursor is
 * hidden on pointer-fine devices (body.cursor-glass); themed .cur files in
 * index.css act as the fallback when this is inactive.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const down = useRef(false);
  const [state, setState] = useState<CursorState>("default");
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.body.classList.add("cursor-glass");

    const onMove = (e: PointerEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      const el = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-cursor],a,button,input,textarea,select,[role='button']",
      );
      if (!el) {
        setState("default");
        setLabel("");
        return;
      }
      const explicit = el.getAttribute("data-cursor");
      if (explicit) {
        setState(explicit as CursorState);
        setLabel(el.getAttribute("data-cursor-label") || "");
        return;
      }
      const tag = el.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") {
        setState("text");
      } else if (el.hasAttribute("disabled")) {
        setState("disabled");
      } else {
        setState("link");
      }
      setLabel("");
    };
    const onDown = () => (down.current = true);
    const onUp = () => (down.current = false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      document.body.classList.remove("cursor-glass");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  useRaf(() => {
    ring.current.x += (mouse.current.x - ring.current.x) * 0.18;
    ring.current.y += (mouse.current.y - ring.current.y) * 0.18;
    if (dotRef.current) {
      dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`;
    }
    if (ringRef.current) {
      const s = down.current ? 0.82 : 1;
      ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%) scale(${s})`;
    }
    if (labelRef.current) {
      labelRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
    }
  }, enabled);

  if (!enabled) return null;

  const ringSize =
    state === "view" ? 84 : state === "link" ? 52 : state === "text" ? 8 : 34;

  return (
    <>
      {/* glass ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full transition-[width,height,opacity,border-color] duration-200 ease-out"
        style={{
          width: ringSize,
          height: state === "text" ? 26 : ringSize,
          borderRadius: state === "text" ? 3 : 999,
          border: `1px solid ${state === "disabled" ? "rgba(239,68,68,0.7)" : "rgba(255,255,255,0.55)"}`,
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(4px) saturate(160%)",
          WebkitBackdropFilter: "blur(4px) saturate(160%)",
          boxShadow:
            "inset 0 1px 1px rgba(255,255,255,0.4), 0 4px 18px rgba(124,58,237,0.25)",
        }}
      />
      {/* core dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full transition-opacity duration-150"
        style={{
          background:
            state === "disabled"
              ? "#ef4444"
              : "linear-gradient(120deg,#fff,#67e8f9)",
          opacity: state === "text" || state === "view" ? 0 : 1,
          boxShadow: "0 0 12px rgba(103,232,249,0.9)",
        }}
      />
      {/* contextual label (e.g. "View") */}
      {label && (
        <span
          ref={labelRef}
          className="pointer-events-none fixed left-0 top-0 z-[9999] text-[10px] font-medium uppercase tracking-[0.2em] text-white"
        >
          {label}
        </span>
      )}
    </>
  );
}
