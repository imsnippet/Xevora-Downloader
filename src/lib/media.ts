// Shared types mirrored on the client.

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
  sig: string;
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

export function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v >= 100 ? 0 : 1)} ${units[i]}`;
}

export function formatDuration(sec?: number): string {
  if (!sec || sec <= 0) return "—";
  const s = Math.floor(sec % 60);
  const m = Math.floor((sec / 60) % 60);
  const h = Math.floor(sec / 3600);
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

export function buildDownloadUrl(title: string, f: MediaFormat): string {
  const params = new URLSearchParams({
    url: f.url,
    id: f.id,
    sig: f.sig,
    ext: f.ext,
    title,
  });
  return `/api/public/download?${params.toString()}`;
}
