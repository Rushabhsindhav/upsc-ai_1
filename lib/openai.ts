import OpenAI from "openai";

let client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY is not set. Add it in your .env.local (dev) or Vercel project settings (prod)."
      );
    }
    client = new OpenAI({ apiKey });
  }
  return client;
}
