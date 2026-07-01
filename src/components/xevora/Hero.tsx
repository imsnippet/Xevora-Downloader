import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowDown,
  Loader2,
  AlertCircle,
  Video as VideoIcon,
  Music2,
  Play,
  Clock,
  User,
  Globe,
  CalendarDays,
  Download,
} from "lucide-react";
import { urlSchema } from "@/lib/url-validation";
import {
  type MediaInfo,
  type MediaFormat,
  formatBytes,
  formatDuration,
  buildDownloadUrl,
} from "@/lib/media";

const LOADING_STEPS = [
  "Analyzing URL…",
  "Contacting source…",
  "Fetching qualities…",
  "Almost ready…",
];

export function Hero() {
  const [url, setUrl] = useState("");
  const [info, setInfo] = useState<MediaInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!loading) return;
    setStep(0);
    const id = setInterval(() => setStep((s) => (s + 1) % LOADING_STEPS.length), 1100);
    return () => clearInterval(id);
  }, [loading]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = urlSchema.safeParse(url);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid URL");
      return;
    }
    setError(null);
    setInfo(null);
    setLoading(true);
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await fetch("/api/public/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: parsed.data }),
        signal: ctrl.signal,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? `Request failed (${res.status})`);
      } else {
        setInfo(data as MediaInfo);
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError((e as Error).message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="top" className="relative overflow-hidden pt-24 pb-20 sm:pt-28 sm:pb-28">
      {/* Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 hero-grid opacity-70" />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="animate-blob absolute -top-32 left-1/4 size-[420px] rounded-full bg-primary/30 blur-3xl" />
        <div
          className="animate-blob absolute -top-10 right-1/4 size-[360px] rounded-full bg-primary-glow/25 blur-3xl"
          style={{ animationDelay: "-6s" }}
        />
      </div>

      <div className="mx-auto max-w-3xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground"
        >
          <span className="inline-block size-1.5 rounded-full bg-success" />
          Fast · Private
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-4 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"

        >
          Download Media <br />
          <span className="text-gradient">in Seconds.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg"
        >
          Fast. Modern. Clean. Paste a media URL and access available download
          options through an elegant experience.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          onSubmit={onSubmit}
          className="glass mx-auto mt-10 flex w-full max-w-2xl flex-col gap-2 rounded-3xl p-2 sm:flex-row sm:items-center sm:rounded-full"
        >
          <label htmlFor="media-url" className="sr-only">
            Media URL
          </label>
          <input
            id="media-url"
            type="url"
            inputMode="url"
            autoComplete="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your media URL…"
            className="min-w-0 flex-1 rounded-2xl bg-transparent px-5 py-3.5 text-base text-foreground placeholder:text-muted-foreground/80 focus:outline-none sm:rounded-full"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-primary px-6 font-medium text-primary-foreground shadow-elegant transition-all hover:scale-[1.02] hover:shadow-[0_25px_60px_-20px_oklch(0.66_0.245_25/0.7)] active:scale-95 disabled:opacity-70 sm:rounded-full"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
            )}
            <span>{loading ? "Working…" : "Analyze"}</span>
          </button>
        </motion.form>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="alert"
              className="mx-auto mt-4 inline-flex max-w-2xl items-center gap-2 rounded-full bg-destructive/10 px-4 py-2 text-sm text-destructive"
            >
              <AlertCircle className="size-4 shrink-0" />
              <span className="text-left">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mx-auto mt-12 max-w-4xl px-4">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl p-8 text-center"
            >
              <div className="grid size-14 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant">
                <Loader2 className="size-6 animate-spin" />
              </div>
              <div className="text-base font-medium">{LOADING_STEPS[step]}</div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-accent">
                <motion.div
                  className="h-full bg-gradient-primary"
                  initial={{ width: "10%" }}
                  animate={{ width: ["10%", "70%", "92%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          )}
          {info && !loading && <ResultCard key={info.webpageUrl + info.title} info={info} />}
        </AnimatePresence>
      </div>
    </section>
  );
}

function ResultCard({ info }: { info: MediaInfo }) {
  const video = useMemo(() => info.formats.filter((f) => f.kind === "video"), [info.formats]);
  const audio = useMemo(() => info.formats.filter((f) => f.kind === "audio"), [info.formats]);
  const [tab, setTab] = useState<"video" | "audio">(video.length ? "video" : "audio");
  const list = tab === "video" ? video : audio;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass overflow-hidden rounded-3xl p-4 sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-muted sm:w-72 sm:shrink-0">
          {info.thumbnail ? (
            <img
              src={info.thumbnail}
              alt={`Thumbnail for ${info.title}`}
              loading="lazy"
              className="size-full object-cover"
            />
          ) : (
            <div className="grid size-full place-items-center text-muted-foreground">
              <Play className="size-8" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="line-clamp-2 text-left text-xl font-semibold leading-snug">
            {info.title}
          </h2>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <Meta icon={<Clock className="size-3.5" />} label="Duration" value={formatDuration(info.duration)} />
            <Meta icon={<Globe className="size-3.5" />} label="Source" value={info.source ?? "—"} />
            <Meta icon={<User className="size-3.5" />} label="Creator" value={info.uploader ?? "—"} />
            <Meta
              icon={<CalendarDays className="size-3.5" />}
              label="Uploaded"
              value={info.uploadDate ?? "—"}
            />
          </dl>

          <div
            role="tablist"
            aria-label="Format type"
            className="mt-5 inline-flex rounded-full bg-accent p-1"
          >
            <TabButton
              active={tab === "video"}
              onClick={() => setTab("video")}
              disabled={!video.length}
              icon={<VideoIcon className="size-4" />}
              label={`Video${video.length ? ` · ${video.length}` : ""}`}
            />
            <TabButton
              active={tab === "audio"}
              onClick={() => setTab("audio")}
              disabled={!audio.length}
              icon={<Music2 className="size-4" />}
              label={`Audio${audio.length ? ` · ${audio.length}` : ""}`}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No {tab} formats were returned for this URL.
          </div>
        )}
        {list.map((f) => (
          <FormatCard key={f.id} info={info} f={f} />
        ))}
      </div>
    </motion.div>
  );
}

function Meta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-left">
      <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground/80">
        {icon} {label}
      </span>
      <span className="truncate text-foreground">{value}</span>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  disabled,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all disabled:opacity-40 ${
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function FormatCard({ info, f }: { info: MediaInfo; f: MediaFormat }) {
  const primary =
    f.kind === "video"
      ? f.height
        ? `${f.height}p${f.height >= 1080 ? " Full HD" : f.height >= 720 ? " HD" : ""}`
        : (f.label ?? f.ext.toUpperCase())
      : f.bitrate
        ? `${Math.round(f.bitrate)} kbps`
        : (f.label ?? "Audio");

  const secondary =
    f.kind === "video"
      ? [f.resolution, f.fps ? `${f.fps}fps` : null, f.ext.toUpperCase()]
          .filter(Boolean)
          .join(" · ")
      : [f.ext.toUpperCase(), f.hasAudio === false ? "audio only" : null]
          .filter(Boolean)
          .join(" · ");

  return (
    <motion.a
      whileHover={{ y: -3 }}
      href={buildDownloadUrl(info.title, f)}
      className="group flex flex-col gap-3 rounded-2xl bg-surface p-4 transition-all hover:shadow-elegant"
      download
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-base font-semibold">{primary}</div>
          <div className="text-xs text-muted-foreground">{secondary}</div>
        </div>
        <span className="rounded-full bg-accent px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {formatBytes(f.filesize)}
        </span>
      </div>
      <span className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition-transform group-hover:scale-[1.02]">
        <Download className="size-4" />
        Download {primary}
      </span>
    </motion.a>
  );
}
