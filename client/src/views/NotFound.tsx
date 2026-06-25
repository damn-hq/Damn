import { motion } from "framer-motion";
import ParticleLogo from "../components/ParticleLogo";
import MagneticButton from "../components/MagneticButton";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center px-6">
      {/* interactive particle wordmark */}
      <ParticleLogo />

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="mt-2 text-center text-3xl font-semibold tracking-tightest text-gradient sm:text-5xl"
      >
        DAMN IT!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="mt-4 text-center text-base uppercase tracking-widest text-white/55 sm:text-lg"
      >
        Page not found
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <MagneticButton to="/">Go to home</MagneticButton>
        <MagneticButton to="/inquiry" variant="ghost">
          Start a project →
        </MagneticButton>
      </motion.div>
    </main>
  );
}
