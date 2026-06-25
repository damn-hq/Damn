import { useEffect, useRef } from "react";
import { useRaf, prefersReducedMotion } from "../hooks/useRaf";

/**
 * Interactive background on black. Two large violet/cyan blur blobs lerp toward
 * the cursor with different damping (parallax) and a drifting geometric field
 * of rotating polygons + connecting lines sits over them. Cursor proximity
 * lights nearby polygons. Pure transforms / canvas -> GPU friendly.
 */
export default function GradientBackground() {
  const violetRef = useRef<HTMLDivElement>(null);
  const cyanRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const target = useRef({ x: 0.5, y: 0.4 });
  const v = useRef({ x: 0.5, y: 0.4 });
  const c = useRef({ x: 0.5, y: 0.6 });
  const reduced = useRef(prefersReducedMotion());
  // phone/tablet (no hover, coarse pointer): blobs self-animate since there's
  // no cursor to follow.
  const isTouch = useRef(
    typeof matchMedia !== "undefined" &&
      matchMedia("(hover: none) and (pointer: coarse)").matches,
  );
  // once a real (mouse/pen) pointer moves we follow the cursor instead of the
  // auto path — covers touchscreen laptops that also report a coarse pointer.
  const cursorActive = useRef(false);

  // --- pointer (blobs use normalised; geometry uses pixel coords) ---
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "touch") cursorActive.current = true;
      target.current.x = e.clientX / window.innerWidth;
      target.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // --- geometric polygon field ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const noMotion = reduced.current;
    let raf = 0;
    let w = 0;
    let h = 0;
    const mouse = { x: -9999, y: -9999 };
    let lastScroll = window.scrollY;

    type Node = {
      x: number;
      y: number;
      r: number;
      sides: number;
      rot: number;
      spin: number;
      vx: number;
      vy: number;
    };
    let nodes: Node[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / 64000);
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 6 + Math.random() * 22,
        sides: 3 + Math.floor(Math.random() * 4),
        rot: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.01,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
      }));
    };

    const poly = (n: Node) => {
      ctx.beginPath();
      for (let i = 0; i <= n.sides; i++) {
        const a = n.rot + (i / n.sides) * Math.PI * 2;
        const px = n.x + Math.cos(a) * n.r;
        const py = n.y + Math.sin(a) * n.r;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);

      // connecting lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 150) {
            const o = (1 - d / 150) * 0.07;
            ctx.strokeStyle = `rgba(124,58,237,${o})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        if (!noMotion) {
          n.x += n.vx;
          n.y += n.vy;
          n.rot += n.spin;
          if (n.x < -40) n.x = w + 40;
          if (n.x > w + 40) n.x = -40;
          if (n.y < -40) n.y = h + 40;
          if (n.y > h + 40) n.y = -40;
        }
        const dm = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        const near = dm < 140;
        poly(n);
        ctx.strokeStyle = near
          ? "rgba(103,232,249,0.2)"
          : "rgba(229,229,229,0.07)";
        ctx.lineWidth = near ? 1.1 : 1;
        ctx.stroke();
        if (near) {
          ctx.fillStyle = "rgba(34,211,238,0.02)";
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    // scroll parallax: shift the field opposite to scroll; frame() wraps nodes
    // back into view at the edges.
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastScroll;
      lastScroll = y;
      for (const n of nodes) n.y -= dy * 0.25;
    };

    resize();
    frame();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // --- blob parallax ---
  useRaf((_, t) => {
    const drift = reduced.current ? 0 : 1;
    // touch devices have no cursor: sweep the target across the viewport on a
    // slow lissajous path so the gradient is always in motion.
    if (isTouch.current && !cursorActive.current && !reduced.current) {
      target.current.x = 0.5 + Math.sin(t * 0.11) * 0.32;
      target.current.y = 0.5 + Math.cos(t * 0.07) * 0.32;
    }
    const dx = Math.sin(t * 0.18) * 0.06 * drift;
    const dy = Math.cos(t * 0.13) * 0.06 * drift;
    const tx = target.current.x + dx;
    const ty = target.current.y + dy;

    v.current.x += (tx - v.current.x) * 0.04;
    v.current.y += (ty - v.current.y) * 0.04;
    c.current.x += (1 - tx - c.current.x) * 0.025;
    c.current.y += (ty - c.current.y) * 0.03;

    if (violetRef.current) {
      violetRef.current.style.transform = `translate3d(${v.current.x * 100}vw, ${v.current.y * 100}vh, 0) translate(-50%, -50%)`;
    }
    if (cyanRef.current) {
      cyanRef.current.style.transform = `translate3d(${c.current.x * 100}vw, ${c.current.y * 100}vh, 0) translate(-50%, -50%)`;
    }
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink"
    >
      <div
        ref={violetRef}
        className="absolute left-0 top-0 h-[64vmax] w-[64vmax] rounded-full opacity-90 will-change-transform"
        style={{
          background:
            "radial-gradient(circle at center, rgba(124,58,237,0.85), rgba(124,58,237,0) 64%)",
          filter: "blur(120px)",
        }}
      />
      <div
        ref={cyanRef}
        className="absolute left-0 top-0 h-[56vmax] w-[56vmax] rounded-full opacity-80 will-change-transform"
        style={{
          background:
            "radial-gradient(circle at center, rgba(34,211,238,0.78), rgba(34,211,238,0) 64%)",
          filter: "blur(120px)",
        }}
      />
      {/* geometric field sits over the blobs, under the vignette/grain */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-60"
      />
      {/* subtle grain + vignette to keep the black rich */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 0%, rgba(10,10,11,0) 45%, rgba(10,10,11,0.7) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
