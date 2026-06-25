import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../hooks/useRaf";

type Particle = {
  hx: number; // home x
  hy: number; // home y
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
};

/**
 * Interactive particle logo. Samples the real /logo.png (light pixels only)
 * into a particle field that reforms the wordmark. The pointer repels nearby
 * particles; click sends a radial burst. Falls back to a static render when
 * the user prefers reduced motion.
 */
export default function ParticleLogo({ src = "/logo.png" }: { src?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = prefersReducedMotion();

    let particles: Particle[] = [];
    let raf = 0;
    let width = 0; // wrap width
    let height = 0; // wrap height
    let cw = 0; // canvas (padded) width
    let ch = 0; // canvas (padded) height
    // overscan: canvas extends past the wrap so cursor-repelled particles near
    // the left/right (and top/bottom) edges aren't clipped by the canvas bounds.
    // Touch devices have no cursor repulsion, so skip overscan there — on a
    // narrow phone it would push the canvas past the viewport and shift layout.
    const isTouch =
      typeof matchMedia !== "undefined" &&
      matchMedia("(hover: none) and (pointer: coarse)").matches;
    const PAD = isTouch ? 0 : 90;
    const mouse = { x: -9999, y: -9999, down: false };

    const img = new Image();
    img.src = src;

    function buildParticles() {
      const rect = wrap!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      cw = width + PAD * 2;
      ch = height + PAD * 2;
      canvas!.width = cw * dpr;
      canvas!.height = ch * dpr;
      canvas!.style.width = `${cw}px`;
      canvas!.style.height = `${ch}px`;
      canvas!.style.top = `${-PAD}px`;
      canvas!.style.left = `${-PAD}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Draw logo onto a fixed high-res offscreen canvas — sampling density is
      // decoupled from the (smaller) on-screen size so particle count stays
      // high. bbox-fit below maps these coords back into the wrap.
      const off = document.createElement("canvas");
      const sampleH = 760;
      const ow = Math.round((sampleH * img.width) / img.height);
      const oh = sampleH;
      off.width = ow;
      off.height = oh;
      const octx = off.getContext("2d", { willReadFrequently: true })!;
      octx.drawImage(img, 0, 0, ow, oh);

      const data = octx.getImageData(0, 0, ow, oh).data;
      const gap = 4;
      // first pass: collect light wordmark pixels + their bounding box so we
      // can crop the logo's internal transparent padding and fill the wrap.
      const pts: { x: number; y: number }[] = [];
      let minX = ow, minY = oh, maxX = 0, maxY = 0;
      for (let y = 0; y < oh; y += gap) {
        for (let x = 0; x < ow; x += gap) {
          const i = (y * ow + x) * 4;
          const a = data[i + 3];
          const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (a > 128 && lum > 70) {
            pts.push({ x, y });
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      const bw = Math.max(1, maxX - minX);
      const bh = Math.max(1, maxY - minY);
      // contain the bbox in the wrap with a small margin, then centre it
      const fit = Math.min((width * 0.98) / bw, (height * 0.98) / bh);
      // +PAD shifts home coords into the padded canvas space (wrap sits inset
      // by PAD), so the wordmark still renders centered over the wrap.
      const offX = (width - bw * fit) / 2 + PAD;
      const offY = (height - bh * fit) / 2 + PAD;
      const next: Particle[] = pts.map((p) => {
        const hx = (p.x - minX) * fit + offX;
        const hy = (p.y - minY) * fit + offY;
        return {
          hx,
          hy,
          x: reduced ? hx : Math.random() * cw,
          y: reduced ? hy : Math.random() * ch,
          vx: 0,
          vy: 0,
          size: gap * 0.52 * Math.min(fit, 1.4),
        };
      });
      particles = next;
    }

    function frame() {
      ctx.clearRect(0, 0, cw, ch);
      const repelR = 70;
      for (const p of particles) {
        // spring home
        const ax = (p.hx - p.x) * 0.045;
        const ay = (p.hy - p.y) * 0.045;
        p.vx += ax;
        p.vy += ay;

        // pointer repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < repelR * repelR) {
          const dist = Math.sqrt(dist2) || 1;
          const force = ((repelR - dist) / repelR) * (mouse.down ? 14 : 6);
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx;
        p.y += p.vy;

        // tint: white at home, cyan/violet when displaced
        const disp = Math.min(
          1,
          (Math.abs(p.vx) + Math.abs(p.vy)) / 6,
        );
        const r = 229 + (103 - 229) * disp;
        const g = 229 + (232 - 229) * disp;
        const b = 229 + (249 - 229) * disp;
        ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(frame);
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onDown = () => {
      mouse.down = true;
      // radial burst
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 220) {
          const f = (220 - dist) / 220;
          p.vx += (dx / dist) * f * 26;
          p.vy += (dy / dist) * f * 26;
        }
      }
    };
    const onUp = () => {
      mouse.down = false;
    };

    const start = () => {
      buildParticles();
      cancelAnimationFrame(raf);
      frame();
    };

    if (img.complete) start();
    else img.onload = start;

    const ro = new ResizeObserver(() => start());
    ro.observe(wrap);
    canvas.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [src]);

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto aspect-[1/0.34] w-full max-w-4xl select-none"
      data-cursor="view"
    >
      <canvas ref={canvasRef} className="pointer-events-auto absolute left-0 top-0" />
    </div>
  );
}
