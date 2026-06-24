import Reveal from "../Reveal";
import Glass from "../Glass";
import MagneticButton from "../MagneticButton";

export default function CTA() {
  return (
    <section className="relative z-10 px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <Glass className="relative overflow-hidden p-12 text-center sm:p-20">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-40 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle,#7c3aed,transparent 70%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full opacity-40 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle,#22d3ee,transparent 70%)",
              }}
            />
            <h2 className="relative text-4xl font-semibold tracking-tightest text-bone sm:text-6xl text-balance">
              Got something in mind?
              <br />
              Let&apos;s make it{" "}
              <span className="text-gradient">damn good.</span>
            </h2>
            <p className="relative mx-auto mt-6 max-w-md text-white/55">
              Send us your idea, references and requirements — however rough.
              We&apos;ll take it from there.
            </p>
            <div className="relative mt-10 flex justify-center">
              <MagneticButton to="/inquiry">
                Start your project →
              </MagneticButton>
            </div>
          </Glass>
        </Reveal>
      </div>
    </section>
  );
}
