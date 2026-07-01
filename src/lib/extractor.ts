// Typed client for an external media extractor.
// Uses @distube/ytdl-core for YouTube, configured API for other sites, then Cobalt as fallback.

export type FormatKind = "video" | "audio";

export interface MediaFormat {
  id: string;
  kind: FormatKind;
  ext: string;
  url: string;
  resolution?: string;
  height?: number;
  fps?: number;
  bitrate?: number;
  filesize?: number;
  label?: string;
  hasAudio?: boolean;
}

export interface MediaInfo {
  title: string;
  thumbnail?: string;
  duration?: number;
  uploader?: string;
  uploadDate?: string;
  source?: string;
  webpageUrl: string;
  formats: MediaFormat[];
}

export class ExtractorError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

function pickExt(f: Record<string, unknown>): string {
  return String(f.ext ?? f.container ?? f.format ?? f.extension ?? "bin").toLowerCase();
}

function pickKind(f: Record<string, unknown>): FormatKind {
  const vcodec = (f.vcodec ?? f.videoCodec ?? "") as string;
  const acodec = (f.acodec ?? f.audioCodec ?? "") as string;
  const kind = (f.kind ?? f.type ?? "") as string;
  if (kind === "audio" || (vcodec === "none" && acodec && acodec !== "none")) return "audio";
  if (kind === "video" || (vcodec && vcodec !== "none")) return "video";
  if (typeof f.height === "number" && f.height > 0) return "video";
  return "audio";
}

function hostOf(url: string): string | undefined {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return undefined; }
}

function normaliseYtDlp(raw: Record<string, unknown>, originalUrl: string): MediaInfo {
  const formats = Array.isArray(raw.formats) ? (raw.formats as Record<string, unknown>[]) : [];
  const out: MediaFormat[] = [];
  const BLOCKED_EXTS = new Set(["m3u8", "mpd", "mhtml"]);
  const MIN_HEIGHT = 144;

  for (const f of formats) {
    const url = (f.url ?? f.downloadUrl) as string | undefined;
    if (!url) continue;
    const ext = pickExt(f);
    if (BLOCKED_EXTS.has(ext)) continue;
    if (url.includes(".m3u8") || url.includes("manifest.googlevideo")) continue;
    const kind = pickKind(f);
    const height = typeof f.height === "number" ? (f.height as number) : undefined;
    if (kind === "video" && height !== undefined && height < MIN_HEIGHT) continue;
    const width = typeof f.width === "number" ? (f.width as number) : undefined;
    out.push({
      id: String(f.format_id ?? f.id ?? `${kind}-${out.length}`),
      kind,
      ext,
      url,
      resolution: width && height ? `${width}x${height}` : undefined,
      height,
      fps: typeof f.fps === "number" ? (f.fps as number) : undefined,
      bitrate:
        typeof f.abr === "number"
          ? (f.abr as number)
          : typeof f.tbr === "number"
            ? (f.tbr as number)
            : undefined,
      filesize:
        typeof f.filesize === "number"
          ? (f.filesize as number)
          : typeof f.filesize_approx === "number"
            ? (f.filesize_approx as number)
            : undefined,
      label: (f.format_note ?? f.quality ?? f.label) as string | undefined,
      hasAudio: (f.acodec ?? "") !== "none",
    });
  }

  const upload = raw.upload_date as string | undefined;
  const uploadDate =
    upload && /^\d{8}$/.test(upload)
      ? `${upload.slice(0, 4)}-${upload.slice(4, 6)}-${upload.slice(6, 8)}`
      : (raw.uploadDate as string | undefined);

  return {
    title: String(raw.title ?? raw.fulltitle ?? "Untitled"),
    thumbnail: (raw.thumbnail ?? (Array.isArray(raw.thumbnails)
      ? (raw.thumbnails as Array<{ url: string }>).at(-1)?.url
      : undefined)) as string | undefined,
    duration: typeof raw.duration === "number" ? (raw.duration as number) : undefined,
    uploader: (raw.uploader ?? raw.channel ?? raw.creator) as string | undefined,
    uploadDate,
    source: hostOf(originalUrl),
    webpageUrl: originalUrl,
    formats: out,
  };
}

function isYouTubeUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host === "youtube.com" || host === "youtu.be" || host === "m.youtube.com";
  } catch { return false; }
}

/**
 * Extract YouTube video using @distube/ytdl-core (no binary, no API key required).
 */
async function tryYtdlCore(url: string): Promise<MediaInfo | null> {
  if (!isYouTubeUrl(url)) return null;
  try {
    const ytdl = await import("@distube/ytdl-core");
    const info = await ytdl.default.getInfo(url);
    const details = info.videoDetails;

    const BLOCKED_ITAGS = new Set([17, 36]); // 3gp formats
    const formats: MediaFormat[] = [];

    for (const f of info.formats) {
      if (BLOCKED_ITAGS.has(f.itag)) continue;
      if (!f.url) continue;
      // Skip HLS/DASH manifests
      if (f.url.includes(".m3u8") || f.url.includes("manifest")) continue;

      const hasVideo = f.hasVideo ?? false;
      const hasAudio = f.hasAudio ?? false;
      if (!hasVideo && !hasAudio) continue;

      const kind: FormatKind = hasVideo ? "video" : "audio";
      const height = f.height ?? undefined;
      if (kind === "video" && height !== undefined && height < 144) continue;

      formats.push({
        id: String(f.itag),
        kind,
        ext: f.container ?? "mp4",
        url: f.url,
        height,
        resolution: f.width && height ? `${f.width}x${height}` : undefined,
        fps: f.fps ?? undefined,
        bitrate: f.audioBitrate ?? undefined,
        filesize: f.contentLength ? Number(f.contentLength) : undefined,
        label: f.qualityLabel ?? (kind === "audio" ? "Audio" : undefined),
        hasAudio,
      });
    }

    if (formats.length === 0) return null;

    // Sort: video formats first by height desc, then audio
    formats.sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === "video" ? -1 : 1;
      return (b.height ?? 0) - (a.height ?? 0);
    });

    const thumb = details.thumbnails?.sort((a: any, b: any) => (b.width ?? 0) - (a.width ?? 0))[0]?.url;

    return {
      title: details.title,
      thumbnail: thumb,
      duration: details.lengthSeconds ? Number(details.lengthSeconds) : undefined,
      uploader: details.author?.name,
      uploadDate: details.publishDate,
      source: "youtube.com",
      webpageUrl: url,
      formats,
    };
  } catch (e) {
    console.warn("ytdl-core extraction failed:", (e as Error).message);
    return null;
  }
}

async function tryLocalYtDlp(url: string): Promise<MediaInfo | null> {
  try {
    const { default: youtubedl } = await import("youtube-dl-exec");
    const data = await youtubedl(url, {
      dumpJson: true,
      noWarnings: true,
      noCallHome: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
    }) as unknown as Record<string, unknown>;
    const info = normaliseYtDlp(data, url);
    if (info.formats.length > 0) return info;
    return null;
  } catch (e) {
    console.warn("Local youtube-dl extraction failed:", (e as Error).message);
    return null;
  }
}

async function tryConfiguredApi(url: string): Promise<MediaInfo | null> {
  const endpoint = process.env.EXTRACTOR_API_URL;
  if (!endpoint) return null;
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.EXTRACTOR_API_KEY
          ? { Authorization: `Bearer ${process.env.EXTRACTOR_API_KEY}` }
          : {}),
      },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(25_000),
    });
    if (!res.ok) { console.warn(`Extractor API returned ${res.status}`); return null; }
    const data = await res.json();
    const info = normaliseYtDlp(data, url);
    if (info.formats.length > 0) return info;
    console.warn("Extractor API returned 0 usable formats");
    return null;
  } catch (e) {
    console.warn("Extractor API failed:", (e as Error).message);
    return null;
  }
}

/**
 * Extract media information from a URL.
 * Tries: ytdl-core (YouTube) -> local yt-dlp -> configured API
 */
export async function extract(url: string): Promise<MediaInfo> {
  // 1. @distube/ytdl-core - best for YouTube, pure Node.js, no binary needed
  const ytdl = await tryYtdlCore(url);
  if (ytdl) return ytdl;

  // 2. Local yt-dlp binary (if installed on server)
  const local = await tryLocalYtDlp(url);
  if (local) return local;

  // 3. Configured external extractor API
  const api = await tryConfiguredApi(url);
  if (api) return api;

  throw new ExtractorError(
    "Could not extract media from this URL. The site may not be supported or extraction services are currently unavailable. Please try again later.",
    422,
  );
}
