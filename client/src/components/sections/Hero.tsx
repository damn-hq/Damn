import { motion, useScroll, useTransform } from "framer-motion";
import ParticleLogo from "../ParticleLogo";
import MagneticButton from "../MagneticButton";

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  const opacity = useTransform(scrollY, [0, 420], [1, 0]);

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 pt-24">
      <motion.div style={{ y, opacity }} className="w-full">
        {/* interactive particle wordmark */}
        <ParticleLogo />

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-2 text-center text-3xl font-semibold tracking-tightest text-gradient sm:text-5xl"
        >
          DAMN GOOD
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-xl text-center text-base text-white/55 sm:text-lg text-balance"
        >
          We design and build custom websites from the ground up — shaped
          entirely around what you want, not a template.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton to="/inquiry">Start a project →</MagneticButton>
          <MagneticButton href="#services" variant="ghost">
            See what we do
          </MagneticButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
