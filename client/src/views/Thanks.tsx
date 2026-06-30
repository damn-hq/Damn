import { useEffect, useState } from "react";
import ParticleLogo from "../components/ParticleLogo";
import MagneticButton from "../components/MagneticButton";

export default function Thanks() {
  // Email is passed as ?to= on redirect from the inquiry form. Render via
  // React text node (never innerHTML) so the query param can't inject markup.
  const [email, setEmail] = useState("");
  useEffect(() => {
    const to = new URLSearchParams(window.location.search).get("to");
    if (to) setEmail(to);
  }, []);

  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center px-6">
      <ParticleLogo />

      <h1
        style={{ animationDelay: "0.4s" }}
        className="fade-up mt-2 text-center text-3xl font-semibold tracking-tightest text-gradient sm:text-5xl"
      >
        DAMN GOOD.
      </h1>

      <p
        style={{ animationDelay: "0.55s" }}
        className="fade-up mt-4 max-w-md text-center text-base text-white/55"
      >
        Your inquiry landed with us. We read every one and reply personally
        {email ? (
          <>
            {" "}— we&apos;ll be in touch at{" "}
            <span className="text-bone">{email}</span> soon.
          </>
        ) : (
          " — we'll be in touch soon."
        )}
      </p>

      <div
        style={{ animationDelay: "0.7s" }}
        className="fade-up mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <MagneticButton to="/">Back to home</MagneticButton>
      </div>
    </main>
  );
}
