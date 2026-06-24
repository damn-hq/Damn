import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";

const links = [
  { label: "Work", href: "/#services" },
  { label: "Process", href: "/#process" },
  { label: "Why Damn", href: "/#why" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [entered, setEntered] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      // clear the lingering translate once the entrance finishes — a residual
      // transform on the ancestor breaks backdrop-filter on the glass layer
      onAnimationComplete={() => setEntered(true)}
      style={entered ? { transform: "none" } : undefined}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav className="relative flex w-full max-w-5xl items-center justify-between rounded-full px-3 py-2.5">
        {/* glass surface fades in on scroll — opacity-only so no border flashes
            mid-transition when returning to the top */}
        <div
          aria-hidden
          className={`glass glass-sheen pointer-events-none absolute inset-0 rounded-full transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />
        <Link
          to="/"
          className="relative flex items-center gap-2.5 pl-2"
          aria-label="Damn home"
        >
          <img src="/logo.png" alt="Damn" className="h-7 w-7 rounded-md" />
          <span className="text-lg font-semibold tracking-tightest text-bone">
            DAMN
          </span>
        </Link>

        <div className="relative hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-white/55 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <MagneticButton
          to="/inquiry"
          variant={pathname === "/inquiry" ? "ghost" : "solid"}
          className="relative !px-5 !py-2.5"
        >
          Start a project
        </MagneticButton>
      </nav>
    </motion.header>
  );
}
