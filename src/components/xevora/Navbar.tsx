import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Github } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "#top", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#faq", label: "FAQ" },
  { href: "#about", label: "About" },
  { href: "#support", label: "Support" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4">
        <nav
          className={`glass flex h-14 items-center justify-between rounded-full px-3 pl-5 transition-shadow ${
            scrolled ? "shadow-elegant" : ""
          }`}
          aria-label="Primary"
        >
          <Link to="/" className="flex items-center">
            <span className="font-display text-2xl font-bold tracking-tight">Xevora</span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="https://github.com/imsnippet"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Github className="size-4" /> GitHub
              </a>
            </li>
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="grid size-10 place-items-center rounded-full glass md:hidden"
            >
              {open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="glass mt-2 rounded-3xl p-2 md:hidden">
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-sm text-foreground transition-colors hover:bg-accent"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="https://github.com/imsnippet"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm text-foreground transition-colors hover:bg-accent"
                >
                  <Github className="size-4" /> GitHub
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
