/**
 * Builds data/embeddings.json from every markdown file in data/corpus/.
 * Run with: npm run embed
 * Requires OPENAI_API_KEY to be set (reads from .env.local automatically
 * if you use a tool like `dotenv-cli`, or export it in your shell first).
 *
 * Re-run this any time you add/edit files in data/corpus/.
 */
import fs from "fs";
import path from "path";
import OpenAI from "openai";

const CORPUS_DIR = path.join(process.cwd(), "data", "corpus");
const OUTPUT_FILE = path.join(process.cwd(), "data", "embeddings.json");

function chunkText(text: string, maxChars = 1200): string[] {
  // naive paragraph-based chunking — good enough for v0
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const chunks: string[] = [];
  let current = "";
  for (const p of paragraphs) {
    if ((current + "\n\n" + p).length > maxChars && current) {
      chunks.push(current.trim());
      current = p;
    } else {
      current = current ? current + "\n\n" + p : p;
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

function parseFrontmatter(raw: string): {
  meta: Record<string, string>;
  body: string;
} {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const [key, ...rest] = line.split(":");
    if (key) meta[key.trim()] = rest.join(":").trim();
  }
  return { meta, body: match[2].trim() };
}

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("Set OPENAI_API_KEY before running this script.");
    process.exit(1);
  }
  const openai = new OpenAI({ apiKey });

  const files = fs
    .readdirSync(CORPUS_DIR)
    .filter((f) => f.endsWith(".md"));

  if (files.length === 0) {
    console.error(`No .md files found in ${CORPUS_DIR}`);
    process.exit(1);
  }

  const results: any[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(CORPUS_DIR, file), "utf-8");
    const { meta, body } = parseFrontmatter(raw);
    const chunks = chunkText(body);

    for (let i = 0; i < chunks.length; i++) {
      const text = chunks[i];
      console.log(`Embedding ${file} chunk ${i + 1}/${chunks.length}...`);
      const res = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
      });
      results.push({
        id: `${file}-${i}`,
        title: meta.title || file,
        source: meta.source || "",
        topic: meta.topic || "",
        text,
        embedding: res.data[0].embedding,
      });
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`\nDone. Wrote ${results.length} chunks to ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
