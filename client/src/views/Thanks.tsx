import { useEffect, useState } from "react";
import ParticleLogo from "../components/ParticleLogo";
import MagneticButton from "../components/MagneticButton";

export default function Thanks() {
  // Email is stashed in sessionStorage by the inquiry form (kept out of the
  // URL). Read once, then clear so a refresh/back-nav doesn't resurface it.
  const [email, setEmail] = useState("");
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("inquiryEmail");
      if (stored) {
        setEmail(stored);
        sessionStorage.removeItem("inquiryEmail");
      }
    } catch {
      /* storage disabled — render the generic message */
    }
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
