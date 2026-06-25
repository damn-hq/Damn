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

        {/* fade-up: CSS keyframe so SSR ships no inline opacity:0 (crawler/no-JS
            safe). animationDelay staggers the entry. */}
        <h1
          style={{ animationDelay: "0.4s" }}
          className="fade-up mt-2 text-center text-3xl font-semibold tracking-tightest text-gradient sm:text-5xl"
        >
          DAMN GOOD
        </h1>

        <p
          style={{ animationDelay: "0.55s" }}
          className="fade-up mx-auto mt-6 max-w-xl text-center text-base text-white/55 sm:text-lg text-balance"
        >
          We design and build custom websites from the ground up — shaped
          entirely around what you want, not a template.
        </p>

        <div
          style={{ animationDelay: "0.7s" }}
          className="fade-up mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton to="/inquiry">Start a project →</MagneticButton>
          <MagneticButton href="#services" variant="ghost">
            See what we do
          </MagneticButton>
        </div>
      </motion.div>
    </section>
  );
}
