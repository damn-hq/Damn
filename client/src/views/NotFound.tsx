import ParticleLogo from "../components/ParticleLogo";
import MagneticButton from "../components/MagneticButton";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center px-6">
      {/* interactive particle wordmark */}
      <ParticleLogo />

      <h1
        style={{ animationDelay: "0.4s" }}
        className="fade-up mt-2 text-center text-3xl font-semibold tracking-tightest text-gradient sm:text-5xl"
      >
        DAMN IT!
      </h1>

      <p
        style={{ animationDelay: "0.55s" }}
        className="fade-up mt-4 text-center text-base uppercase tracking-widest text-white/55 sm:text-lg"
      >
        Page not found
      </p>

      <div
        style={{ animationDelay: "0.7s" }}
        className="fade-up mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <MagneticButton to="/">Go to home</MagneticButton>
        <MagneticButton to="/inquiry" variant="ghost">
          Start a project →
        </MagneticButton>
      </div>
    </main>
  );
}
