import Hero from "../components/sections/Hero";
import Services from "../components/sections/Services";
import Process from "../components/sections/Process";
import WhyDamn from "../components/sections/WhyDamn";
import CTA from "../components/sections/CTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Process />
      <WhyDamn />
      <CTA />
    </main>
  );
}
