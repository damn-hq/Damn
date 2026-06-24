import Reveal from "../Reveal";

const steps = [
  {
    k: "Brief",
    t: "You tell us what you want",
    b: "Goals, references, must-haves, brand. We take in your custom requirements and turn them into a clear plan.",
  },
  {
    k: "Design",
    t: "We draw it from scratch",
    b: "Direction, layout and motion built specifically for your project — reviewed with you until it's right.",
  },
  {
    k: "Build",
    t: "We engineer it for real",
    b: "Production React & TypeScript, performant and accessible, wired to the backend and data you need.",
  },
  {
    k: "Ship",
    t: "We launch it damn good",
    b: "Tested, polished and deployed — with the handover and support to keep it running.",
  },
];

export default function Process() {
  return (
    <section id="process" className="relative z-10 px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-glow">
            How it works
          </p>
          <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tightest text-bone sm:text-5xl text-balance">
            A process shaped around your input.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.k} delay={i * 0.1}>
              <div className="group relative h-full bg-white/[0.02] p-8 transition-colors duration-500 hover:bg-white/[0.05]">
                <div className="mb-8 flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-sm text-white/70">
                    {i + 1}
                  </span>
                  <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                    {s.k}
                  </span>
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-bone">
                  {s.t}
                </h3>
                <p className="mt-3 text-sm text-white/50">{s.b}</p>
                <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-violet to-cyan transition-all duration-500 group-hover:w-full" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
