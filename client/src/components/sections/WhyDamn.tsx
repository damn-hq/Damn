import Reveal from "../Reveal";
import Glass from "../Glass";

const points = [
  {
    t: "Genuinely custom",
    b: "No page builders, no recycled themes. Your site is designed and coded specifically for you.",
  },
  {
    t: "Craft over clutter",
    b: "Considered typography, motion and detail. Restraint where it counts, drama where it earns it.",
  },
  {
    t: "Modern stack",
    b: "React, TypeScript and a performance-first build — maintainable long after launch.",
  },
  {
    t: "Your requirements lead",
    b: "We work from your inputs and ideas. You stay in the loop and in control the whole way.",
  },
];

export default function WhyDamn() {
  return (
    <section id="why" className="relative z-10 px-6 py-28 sm:py-36">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-violet-glow">
            Why Damn
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tightest text-bone sm:text-5xl text-balance">
            Built to be{" "}
            <span className="text-gradient">damn good</span> — and unmistakably
            yours.
          </h2>
          <p className="mt-5 max-w-md text-white/55">
            We&apos;re a studio obsessed with the details most teams skip. We
            take your custom inputs seriously and build to match.
          </p>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2">
          {points.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.08}>
              <Glass className="h-full p-7" data-cursor="view">
                <div className="mb-5 h-px w-10 bg-gradient-to-r from-violet to-cyan" />
                <h3 className="text-lg font-semibold tracking-tight text-bone">
                  {p.t}
                </h3>
                <p className="mt-2 text-sm text-white/50">{p.b}</p>
              </Glass>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
