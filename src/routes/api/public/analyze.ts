import { createFileRoute } from "@tanstack/react-router";
import { analyzeRequestSchema } from "@/lib/url-validation";
import { extract, ExtractorError } from "@/lib/extractor";
import { sign, getSigningSecret } from "@/lib/signing";

// In-memory token bucket per IP (per-instance; good-enough rate limit).
const buckets = new Map<string, { tokens: number; updated: number }>();
const RATE = { capacity: 20, refillPerSec: 0.2 };

function rateLimit(ip: string): boolean {
  const now = Date.now() / 1000;
  const b = buckets.get(ip) ?? { tokens: RATE.capacity, updated: now };
  const refill = (now - b.updated) * RATE.refillPerSec;
  b.tokens = Math.min(RATE.capacity, b.tokens + refill);
  b.updated = now;
  if (b.tokens < 1) {
    buckets.set(ip, b);
    return false;
  }
  b.tokens -= 1;
  buckets.set(ip, b);
  return true;
}

export const Route = createFileRoute("/api/public/analyze")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip =
          request.headers.get("cf-connecting-ip") ??
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          "anon";
        if (!rateLimit(ip)) {
          return Response.json(
            { error: "Too many requests. Please slow down." },
            { status: 429 },
          );
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const parsed = analyzeRequestSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { error: parsed.error.issues[0]?.message ?? "Invalid request" },
            { status: 400 },
          );
        }

        try {
          const info = await extract(parsed.data.url);
          const secret = getSigningSecret();

          // Sign each format URL so the download endpoint can verify integrity.
          const formats = await Promise.all(
            info.formats.map(async (f) => {
              const payload = `${f.id}|${f.url}`;
              const sig = await sign(payload, secret);
              return { ...f, sig };
            }),
          );

          return Response.json({ ...info, formats });
        } catch (e) {
          const err = e as ExtractorError;
          const status = err.status ?? 500;
          return Response.json(
            { error: err.message ?? "Failed to analyze URL" },
            { status },
          );
        }
      },
    },
  },
});
