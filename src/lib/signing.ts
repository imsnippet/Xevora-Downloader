// HMAC signing using Web Crypto (Workers-compatible).

async function key(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toHex(buf: ArrayBuffer): string {
  const b = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < b.length; i++) s += b[i].toString(16).padStart(2, "0");
  return s;
}

function fromHex(hex: string): ArrayBuffer {
  const buf = new ArrayBuffer(hex.length / 2);
  const view = new Uint8Array(buf);
  for (let i = 0; i < view.length; i++) view[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return buf;
}

export async function sign(payload: string, secret: string): Promise<string> {
  const k = await key(secret);
  const sig = await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(payload));
  return toHex(sig);
}

export async function verify(payload: string, signature: string, secret: string): Promise<boolean> {
  try {
    const k = await key(secret);
    return await crypto.subtle.verify(
      "HMAC",
      k,
      fromHex(signature),
      new TextEncoder().encode(payload),
    );
  } catch {
    return false;
  }
}

export function getSigningSecret(): string {
  return (
    process.env.DOWNLOAD_SIGNING_SECRET ||
    process.env.EXTRACTOR_API_KEY ||
    "xevora-dev-signing-secret-change-me"
  );
}
