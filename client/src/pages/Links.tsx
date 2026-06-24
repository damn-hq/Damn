import Glass from "../components/Glass";

type LinkItem = {
  label: string;
  value: string;
  href: string;
};

const links: LinkItem[] = [
  {
    label: "Instagram",
    value: "@damn.hq",
    href: "https://instagram.com/damn.hq",
  },
  {
    label: "GitHub",
    value: "github.com/damn-hq",
    href: "https://github.com/damn-hq",
  },
  {
    label: "Email",
    value: "damn.hq@proton.me",
    href: "mailto:damn.hq@proton.me",
  },
  {
    label: "Phone",
    value: "+91 98240 50461",
    href: "tel:+919824050461",
  },
];

export default function Links() {
  return (
    <main className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 py-28">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Damn" className="h-10 w-10 rounded-lg" />
        <span className="text-3xl font-semibold tracking-tightest text-bone">
          DAMN
        </span>
      </div>
      <p className="mt-3 text-center text-sm text-white/45">
        Custom websites, built to your exact requirements. Damn good.
      </p>

      <div className="mt-10 flex w-full flex-col gap-3">
        {links.map((link) => {
          const external = link.href.startsWith("http");
          return (
            <a
              key={link.label}
              href={link.href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <Glass
                soft
                className="flex items-center justify-between px-6 py-4 transition hover:bg-white/5"
              >
                <span className="text-sm font-medium text-white/85">
                  {link.label}
                </span>
                <span className="text-sm text-white/45">{link.value}</span>
              </Glass>
            </a>
          );
        })}
      </div>
    </main>
  );
}
