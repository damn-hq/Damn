import { useEffect, useRef } from "react";

export type Pointer = { x: number; y: number; active: boolean };

/**
 * Tracks the pointer in a ref (no re-renders). Returns a stable ref object
 * that animation loops can read each frame.
 */
export function useMousePos() {
  const pos = useRef<Pointer>({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
    active: false,
  });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      pos.current.active = true;
    };
    const onLeave = () => {
      pos.current.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
    };
  }, []);

  return pos;
}
