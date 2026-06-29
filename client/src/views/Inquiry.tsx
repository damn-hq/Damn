import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import Glass from "../components/Glass";
import MagneticButton from "../components/MagneticButton";
import { submitInquiry } from "../lib/api";

const SITE_KEY =
  import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";
// In prod the test key always passes the client widget but fails server-side
// siteverify, silently breaking the form. Surface the misconfig loudly.
if (import.meta.env.PROD && !import.meta.env.VITE_TURNSTILE_SITE_KEY) {
  console.error(
    "VITE_TURNSTILE_SITE_KEY is missing — using the Turnstile test key; submissions will fail server verification.",
  );
}

// Show INR bands to visitors in India, USD to everyone else. Detected from the
// browser timezone (no network / geo-IP needed).
const isIndia = (() => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") return true;
    const region =
      new Intl.Locale(navigator.language).region ||
      navigator.language.split("-")[1];
    return region === "IN";
  } catch {
    return false;
  }
})();

const budgets = isIndia
  ? [
      "Under ₹50k",
      "₹50k – ₹80k",
      "₹80k – ₹1.2L",
      "₹1.2L – ₹1.5L",
      "₹1.5L+",
      "Not sure yet",
    ]
  : [
      "Under $670",
      "$670 – $1.1k",
      "$1.1k – $1.6k",
      "$1.6k – $2k",
      "$2k+",
      "Not sure yet",
    ];
const projectTypes = [
  "Marketing / landing site",
  "Portfolio",
  "E-commerce",
  "Web app",
  "Redesign",
  "Something custom",
];

type FieldErrors = Partial<Record<string, string>>;

const field =
  "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-bone outline-none transition focus:border-violet-glow/60 focus:bg-white/[0.07] placeholder:text-white/30";
const labelCls = "mb-2 block text-sm text-white/60";

export default function Inquiry() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    budget: budgets[budgets.length - 1], // "Not sure yet"
    projectType: projectTypes[0],
    requirements: "",
    referral: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );
  const [serverError, setServerError] = useState("");
  const [token, setToken] = useState("");
  const turnstileRef = useRef<TurnstileInstance>(null);

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: FieldErrors = {};
    if (form.name.trim().length < 2) e.name = "Tell us your name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      e.email = "Enter a valid email.";
    if (form.requirements.trim().length < 10)
      e.requirements = "A little more detail helps us a lot.";
    if (!token) e.captcha = "Please complete the verification.";
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      const el = document.getElementById(first);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      (el as HTMLElement | null)?.focus?.();
    }
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setServerError("");
    if (!validate()) return;
    setStatus("sending");
    const res = await submitInquiry({ ...form, turnstileToken: token });
    if (res.ok) {
      setStatus("ok");
    } else {
      setStatus("error");
      setServerError(res.error);
      turnstileRef.current?.reset();
      setToken("");
    }
  };

  // Static heading/intro live in inquiry.astro (plain HTML, crawlable). This
  // island renders only the interactive form card.
  return (
    <Glass className="p-7 sm:p-10">
          <AnimatePresence mode="wait">
            {status === "ok" ? (
              <motion.div
                key="ok"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 text-center"
              >
                <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-violet to-cyan text-2xl text-ink">
                  ✓
                </div>
                <h2 className="text-2xl font-semibold text-bone">
                  Got it — that&apos;s damn good.
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-white/55">
                  Your inquiry landed with us. We&apos;ll be in touch at{" "}
                  <span className="text-bone">{form.email}</span> soon.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-6"
                noValidate
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className={labelCls} htmlFor="name">
                      Name *
                    </label>
                    <input
                      id="name"
                      className={field}
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="Jane Doe"
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-400">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="email">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={field}
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="jane@company.com"
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-400">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className={labelCls} htmlFor="company">
                      Company <span className="text-white/30">(optional)</span>
                    </label>
                    <input
                      id="company"
                      className={field}
                      value={form.company}
                      onChange={(e) => set("company", e.target.value)}
                      placeholder="Acme Inc."
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="referral">
                      How&apos;d you hear of us?{" "}
                      <span className="text-white/30">(optional)</span>
                    </label>
                    <input
                      id="referral"
                      className={field}
                      value={form.referral}
                      onChange={(e) => set("referral", e.target.value)}
                      placeholder="Twitter, a friend, …"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className={labelCls} htmlFor="budget">
                      Budget
                    </label>
                    <select
                      id="budget"
                      className={field}
                      value={form.budget}
                      onChange={(e) => set("budget", e.target.value)}
                    >
                      {budgets.map((b) => (
                        <option key={b} className="bg-ink" value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="projectType">
                      Project type
                    </label>
                    <select
                      id="projectType"
                      className={field}
                      value={form.projectType}
                      onChange={(e) => set("projectType", e.target.value)}
                    >
                      {projectTypes.map((p) => (
                        <option key={p} className="bg-ink" value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelCls} htmlFor="requirements">
                    Your requirements *
                  </label>
                  <textarea
                    id="requirements"
                    rows={6}
                    className={`${field} resize-none`}
                    value={form.requirements}
                    onChange={(e) => set("requirements", e.target.value)}
                    placeholder="What do you want it to do, feel and say? Pages, features, references, deadlines, must-haves — anything custom. The more, the better."
                  />
                  {errors.requirements && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.requirements}
                    </p>
                  )}
                </div>

                <div>
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={SITE_KEY}
                    options={{ theme: "dark", size: "flexible" }}
                    onSuccess={(t) => {
                      setToken(t);
                      setErrors((e) => ({ ...e, captcha: undefined }));
                    }}
                    onExpire={() => setToken("")}
                    onError={() => setToken("")}
                  />
                  {errors.captcha && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.captcha}
                    </p>
                  )}
                </div>

                {status === "error" && serverError && (
                  <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {serverError}
                  </p>
                )}

                <div className="flex items-center justify-between gap-4 pt-2">
                  <p className="text-xs text-white/35">
                    We&apos;ll only use this to reply to you.
                  </p>
                  <MagneticButton type="submit" disabled={status === "sending"}>
                    {status === "sending" ? "Sending…" : "Send inquiry →"}
                  </MagneticButton>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
    </Glass>
  );
}
