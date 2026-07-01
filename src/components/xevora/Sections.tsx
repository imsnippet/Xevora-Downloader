import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import {
  Zap,
  Shield,
  Smartphone,
  Video,
  Music,
  MoonStar,
  Cpu,
  Rocket,
  FileVideo,
  FileAudio,
  Github,
  Instagram,
  Mail,
  Heart,
  Star,
  ChevronDown,
} from "lucide-react";

const features = [
  { icon: Zap, title: "Lightning Fast", desc: "Sub-second analysis and stream-fast downloads." },
  { icon: Shield, title: "Secure", desc: "HMAC-signed download links, no tracking." },
  { icon: Smartphone, title: "Mobile Friendly", desc: "Crafted for every screen size." },
  { icon: Video, title: "Multiple Video Qualities", desc: "From 240p up to 4K when available." },
  { icon: Music, title: "Multiple Audio Formats", desc: "MP3, M4A, AAC — pick your bitrate." },
  { icon: MoonStar, title: "Light & Dark Mode", desc: "Beautiful in both themes." },
  { icon: Cpu, title: "Modern Architecture", desc: "TanStack Start, edge-rendered." },
  { icon: Rocket, title: "Optimized Performance", desc: "100/100 Core Web Vitals target." },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-24">
      <SectionHeader
        eyebrow="Features"
        title="Everything you need. Nothing you don't."
        desc="A focused toolkit for getting media off the web — quickly and cleanly."
      />
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.04}>
            <div className="glass h-full rounded-3xl p-5 transition-all hover:-translate-y-1 hover:shadow-elegant">
              <div className="grid size-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Formats() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <SectionHeader
        eyebrow="Supported formats"
        title="Video and audio, in the formats you actually use."
      />
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Reveal>
          <FormatGroup
            icon={<FileVideo className="size-5" />}
            title="Video"
            items={["MP4", "WebM"]}
          />
        </Reveal>
        <Reveal delay={0.05}>
          <FormatGroup
            icon={<FileAudio className="size-5" />}
            title="Audio"
            items={["MP3", "M4A", "AAC"]}
          />
        </Reveal>
      </div>
    </section>
  );
}

function FormatGroup({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
          {icon}
        </span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <ul className="mt-5 flex flex-wrap gap-2">
        {items.map((i) => (
          <li
            key={i}
            className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium"
          >
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

const steps = [
  { n: "1", title: "Paste URL", desc: "Drop any media link into Xevora." },
  { n: "2", title: "Analyze", desc: "We fetch metadata and available formats." },
  { n: "3", title: "Choose Quality", desc: "Pick the resolution or bitrate you want." },
  { n: "4", title: "Download", desc: "Stream straight to your device — no waiting." },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <SectionHeader eyebrow="How it works" title="Four steps. One smooth flow." />
      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.06}>
            <div className="relative rounded-3xl border border-border bg-surface p-6">
              <div className="text-6xl font-bold leading-none text-gradient">{s.n}</div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const stats = [
  { value: 10_000_000, suffix: "M+", label: "Downloads", scale: 1_000_000 },
  { value: 500_000, suffix: "K+", label: "Users", scale: 1_000 },
  { value: 99.9, suffix: "%", label: "Uptime", scale: 1 },
  { value: 24, suffix: "/7", label: "Availability", scale: 1 },
];

export function Stats() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <div className="glass grid grid-cols-2 gap-6 rounded-3xl p-8 sm:p-12 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              <Counter target={s.value / s.scale} />
              {s.suffix}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Counter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);
  const display = target >= 100 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, "");
  return <span ref={ref}>{display}</span>;
}

const faqs = [
  {
    q: "How does Xevora work?",
    a: "Paste a URL, Xevora analyzes it through a secure backend, and presents the available video and audio formats for download.",
  },
  {
    q: "Is it free?",
    a: "Yes. Xevora is free to use. Support the project on GitHub if you find it useful.",
  },
  {
    q: "Is registration required?",
    a: "No. There are no accounts, sign-ups, or tracking.",
  },
  {
    q: "Can I choose the quality?",
    a: "Yes — every available resolution and bitrate is shown, including file size.",
  },
  {
    q: "Can I download audio only?",
    a: "Yes. The Audio tab lists every audio-only format the source provides.",
  },
  {
    q: "Is it mobile friendly?",
    a: "Absolutely. Xevora is responsive and works beautifully on phones and tablets.",
  },
  {
    q: "How fast is processing?",
    a: "Analysis usually completes in under a second. Downloads stream at your network speed.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-24">
      <SectionHeader eyebrow="FAQ" title="Questions, answered." />
      <div className="mt-10 divide-y divide-border rounded-3xl border border-border bg-surface">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
              >
                <span className="text-base font-medium">{f.q}</span>
                <ChevronDown
                  className={`size-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="mx-auto max-w-3xl px-4 py-24 text-center">
      <SectionHeader eyebrow="About" title="About Xevora" />
      <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
        Xevora is designed with simplicity, speed, and an intuitive interface in
        mind. It focuses on providing a modern experience for accessing media
        that users have permission to download.
      </p>
    </section>
  );
}

export function Support() {
  return (
    <section id="support" className="mx-auto max-w-3xl px-4 py-24">
      <div className="glass rounded-3xl p-10 text-center sm:p-14">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Support Xevora <Heart className="-mt-1 inline size-7 fill-primary text-primary" />
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          If you enjoy this project, consider supporting development.
        </p>
        <a
          href="https://github.com/imsnippet"
          target="_blank"
          rel="noreferrer noopener"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 font-medium text-primary-foreground shadow-elegant transition-transform hover:scale-[1.03] active:scale-95"
        >
          <Star className="size-4" /> Support Us
        </a>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-4 pb-12 pt-8">
      <div className="rounded-3xl border border-border bg-surface p-8">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div className="flex items-center">
            <span className="font-display text-2xl font-bold tracking-tight">Xevora</span>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground">Features</a></li>
              <li><a href="#faq" className="hover:text-foreground">FAQ</a></li>
              <li><a href="#about" className="hover:text-foreground">About</a></li>
              <li><a href="#support" className="hover:text-foreground">Support</a></li>
              <li>
                <a
                  href="https://github.com/imsnippet"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-foreground"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <SocialLink href="https://github.com/imsnippet" label="GitHub">
              <Github className="size-4" />
            </SocialLink>
            <SocialLink href="https://www.instagram.com/im.snippet" label="Instagram">
              <Instagram className="size-4" />
            </SocialLink>
            <SocialLink href="mailto:imsnippet@gmail.com" label="Email">
              <Mail className="size-4" />
            </SocialLink>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 Xevora</p>
          <p>
            Made with <Heart className="-mt-0.5 inline size-3 fill-primary text-primary" /> by{" "}
            <a
              href="https://github.com/imsnippet"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-foreground"
            >
              imsnippet
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="grid size-9 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {children}
    </a>
  );
}

function SectionHeader({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="text-center">
      <div className="text-xs font-medium uppercase tracking-[0.18em] text-primary">{eyebrow}</div>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {desc && (
        <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">{desc}</p>
      )}
    </div>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
