import fs from "fs";
import path from "path";
import { getOpenAI } from "./openai";

export type CorpusChunk = {
  id: string;
  title: string;
  source: string;
  topic: string;
  text: string;
  embedding: number[];
};

let cache: CorpusChunk[] | null = null;

function loadEmbeddings(): CorpusChunk[] {
  if (cache) return cache;
  const file = path.join(process.cwd(), "data", "embeddings.json");
  if (!fs.existsSync(file)) {
    // No corpus index yet — that's fine, the app still works, it just
    // answers from the model's general knowledge instead of the corpus.
    // Run `npm run embed` later (see README) to enable citations.
    cache = [];
    return cache;
  }
  cache = JSON.parse(fs.readFileSync(file, "utf-8"));
  return cache!;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function retrieveContext(
  query: string,
  topK = 3
): Promise<CorpusChunk[]> {
  const chunks = loadEmbeddings();
  if (chunks.length === 0) return [];

  const openai = getOpenAI();

  const embedRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  const queryEmbedding = embedRes.data[0].embedding;

  const scored = chunks.map((chunk) => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map((s) => s.chunk);
}
