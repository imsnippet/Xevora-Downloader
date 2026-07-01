import { z } from "zod";

export const urlSchema = z
  .string()
  .trim()
  .min(1, "Please paste a media URL")
  .max(2048, "URL is too long")
  .refine((v) => {
    try {
      const u = new URL(v);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }, "Enter a valid http(s) URL");

export type AnalyzeRequest = { url: string };

export const analyzeRequestSchema = z.object({ url: urlSchema });
