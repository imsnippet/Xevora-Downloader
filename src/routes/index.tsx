import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/xevora/Navbar";
import { Hero } from "@/components/xevora/Hero";
import {
  Features,
  Formats,
  HowItWorks,
  Stats,
  FAQ,
  About,
  Support,
  Footer,
} from "@/components/xevora/Sections";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { q: "How does Xevora work?", a: "Paste a URL, Xevora analyzes it through a secure backend, and presents the available video and audio formats for download." },
    { q: "Is it free?", a: "Yes. Xevora is free to use." },
    { q: "Is registration required?", a: "No accounts, no sign-ups, no tracking." },
    { q: "Can I choose the quality?", a: "Yes — every available resolution and bitrate is shown with file size." },
    { q: "Can I download audio only?", a: "Yes. The Audio tab lists every audio-only format provided." },
    { q: "Is it mobile friendly?", a: "Absolutely. Xevora is responsive across phones and tablets." },
    { q: "How fast is processing?", a: "Analysis usually completes in under a second." },
  ].map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Xevora — Download Media in Seconds" },
      {
        name: "description",
        content:
          "Xevora is a fast, modern, beautiful media downloader. Paste a URL and access available video and audio formats in seconds.",
      },
      { property: "og:title", content: "Xevora — Download Media in Seconds" },
      {
        property: "og:description",
        content: "Fast. Modern. Clean. Beautiful. A premium media downloader.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: "Xevora — Download Media in Seconds" },
      {
        name: "twitter:description",
        content: "A premium media downloader. Fast, modern, beautiful.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(faqJsonLd),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Formats />
        <HowItWorks />
        <Stats />
        <FAQ />
        <About />
        <Support />
      </main>
      <Footer />
    </div>
  );
}
