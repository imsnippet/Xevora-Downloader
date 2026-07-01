import { createFileRoute } from "@tanstack/react-router";
import { verify, getSigningSecret } from "@/lib/signing";

function safeFilename(name: string, ext: string): string {
  const clean = name
    .replace(/[^\p{L}\p{N}\s._-]+/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
  const safe = clean || "xevora-download";
  return ext && !safe.toLowerCase().endsWith(`.${ext.toLowerCase()}`)
    ? `${safe}.${ext}`
    : safe;
}

export const Route = createFileRoute("/api/public/download")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const src = url.searchParams.get("url");
        const id = url.searchParams.get("id") ?? "";
        const sig = url.searchParams.get("sig") ?? "";
        const title = url.searchParams.get("title") ?? "xevora-download";
        const ext = (url.searchParams.get("ext") ?? "bin").replace(/[^a-z0-9]/gi, "");

        if (!src || !sig) {
          return new Response("Missing parameters", { status: 400 });
        }
        try {
          const u = new URL(src);
          if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error("bad proto");
        } catch {
          return new Response("Invalid source URL", { status: 400 });
        }

        const valid = await verify(`${id}|${src}`, sig, getSigningSecret());
        if (!valid) {
          return new Response("Invalid or expired download link", { status: 403 });
        }

        let upstream: Response;
        try {
          upstream = await fetch(src, {
            headers: { "user-agent": "Mozilla/5.0 Xevora/1.0" },
          });
        } catch (e) {
          return new Response(`Upstream unreachable: ${(e as Error).message}`, {
            status: 502,
          });
        }

        if (!upstream.ok || !upstream.body) {
          return new Response(`Upstream returned ${upstream.status}`, {
            status: 502,
          });
        }

        const filename = safeFilename(title, ext);
        const headers = new Headers();
        const contentType =
          upstream.headers.get("content-type") ?? "application/octet-stream";
        headers.set("content-type", contentType);
        const len = upstream.headers.get("content-length");
        if (len) headers.set("content-length", len);
        headers.set(
          "content-disposition",
          `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`
        );
        headers.set("cache-control", "no-store");

        return new Response(upstream.body, { status: 200, headers });
      },
    },
  },
});
