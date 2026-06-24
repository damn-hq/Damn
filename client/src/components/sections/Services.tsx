import Reveal from "../Reveal";
import TiltCard from "../TiltCard";
import Marquee from "../Marquee";

const services = [
  {
    n: "01",
    title: "Custom design",
    body: "Every layout, motion and detail drawn from scratch around your brand — no themes, no recycled blocks.",
  },
  {
    n: "02",
    title: "Engineered builds",
    body: "Fast, accessible front-ends in React & TypeScript, wired to whatever backend or CMS your project needs.",
  },
  {
    n: "03",
    title: "Motion & interaction",
    body: "Particle systems, scroll choreography, liquid-glass surfaces and micro-interactions that feel alive.",
  },
  {
    n: "04",
    title: "Built to your spec",
    body: "Bring your own requirements, references and ideas — we shape the whole build around your custom inputs.",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative z-10 px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-violet-glow">
            What we do
          </p>
          <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tightest text-bone sm:text-5xl text-balance">
            Websites built around you — not a template.
          </h2>
          <p className="mt-5 max-w-xl text-white/55">
            We take custom inputs and requirements at every step. Tell us what
            you want it to do, feel and say — we design and engineer the rest.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <TiltCard className="h-full p-8" data-cursor="view">
                <span className="text-sm font-medium text-white/30">{s.n}</span>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight text-bone">
                  {s.title}
                </h3>
                <p className="mt-3 text-white/55">{s.body}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-24">
        <Marquee
          items={[
            "Custom",
            "Damn Good",
            "Bespoke",
            "Interactive",
            "Crafted",
            "Yours",
          ]}
        />
      </div>
    </section>
  );
}
