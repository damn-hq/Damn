import { CONTACT, TAGLINE } from "../lib/site";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 px-6 py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Damn" className="h-9 w-9 rounded-lg" />
            <span className="text-2xl font-semibold tracking-tightest text-bone">
              DAMN
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-white/45">{TAGLINE}</p>
        </div>

        <div className="flex flex-col items-center gap-4 md:items-end">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 md:justify-end text-sm text-white/55">
            <a href="/#services" className="transition hover:text-white">
              Work
            </a>
            <a href="/#process" className="transition hover:text-white">
              Process
            </a>
            <a href="/inquiry" className="transition hover:text-white">
              Inquiry
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="transition hover:text-white"
            >
              Email
            </a>
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              Instagram
            </a>
            <a
              href={CONTACT.github}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              GitHub
            </a>
            <a
              href={`tel:${CONTACT.phone}`}
              className="transition hover:text-white"
            >
              Call
            </a>
          </div>
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Damn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
