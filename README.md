# UPSC AI

An open-source AI study companion for UPSC Civil Services Exam aspirants —
Q&A with citations, Mains-answer structuring, and a growing curated corpus
of NCERT-based notes, PYQs, and official sources.

Built with Next.js (deployable free on Vercel) + OpenAI + a lightweight
RAG (retrieval-augmented generation) pipeline over a markdown corpus.

> ⚠️ v0 — early scaffold. The corpus currently has 3 sample documents.
> Contributions of curated, correctly-licensed study content are very
> welcome (see Contributing below).

## How it works

1. Study material lives as markdown files in `data/corpus/`.
2. `npm run embed` turns that corpus into vector embeddings (`data/embeddings.json`).
3. When a user asks a question, the app embeds the query, finds the most
   relevant chunks (cosine similarity), and passes them as context to the
   OpenAI model along with the question.
4. The model answers using that context, and cites which source it used.

## Fastest path: deploy with zero local setup

The app works out of the box without any corpus/embeddings step — it just
answers from the model directly until you add study material. To launch
right now:

1. Push this folder to a new GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new), import that repo.
3. In the import screen (or Settings → Environment Variables after), add:
   - `OPENAI_API_KEY` — your OpenAI key
   - `UPSC_ACCESS_PASSWORD` — the password you want, e.g. `UPSCWITHRUSHABH`
4. Click Deploy. That's it — live app, password-gated, answering questions.

Add the curated corpus (for citations + better exam-specific answers)
whenever you have time — see "Adding to the corpus" below. If you also add
`OPENAI_API_KEY` as a **GitHub Actions secret** (Settings → Secrets →
Actions, in your GitHub repo), a workflow is already included
(`.github/workflows/embed.yml`) that automatically rebuilds
`data/embeddings.json` and pushes it whenever you add files to
`data/corpus/` — so even corpus updates never need a local step or a manual
redeploy trigger beyond the push itself.

## Local setup (optional — only needed if you want to develop/test locally)

```bash
git clone <your-repo-url>
cd upsc-ai
npm install
cp .env.example .env.local
```

Edit `.env.local` and fill in:
- `OPENAI_API_KEY` — your OpenAI API key
- `UPSC_ACCESS_PASSWORD` — whatever password you want to gate access with

Build the vector index from the sample corpus:

```bash
export OPENAI_API_KEY=sk-...   # needed by the embed script directly
npm run embed
```

Run the dev server:

```bash
npm run dev
```

Visit `http://localhost:3000` — you'll be redirected to `/login` first.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import the repo into Vercel.
3. In the Vercel project's **Settings → Environment Variables**, add:
   - `OPENAI_API_KEY`
   - `UPSC_ACCESS_PASSWORD`
4. **Important:** `data/embeddings.json` needs to exist in the repo at
   deploy time (Vercel's serverless functions can't run the embed script
   for you). Run `npm run embed` locally and commit the resulting
   `data/embeddings.json` before pushing — or wire it into a GitHub Action
   that regenerates it on corpus changes.
5. Deploy. Share the URL + your chosen password with users.

## Security notes (read before open-sourcing)

- The access password lives in `UPSC_ACCESS_PASSWORD`, an environment
  variable — **never hardcode it in source files**, since anyone can read
  public GitHub code.
- Same for `OPENAI_API_KEY` — it's server-side only (used inside API
  routes), never exposed to the browser. Don't add `NEXT_PUBLIC_` prefixes
  to secrets.
- The password gate here is basic (single shared password, simple cookie).
  It stops casual/opportunistic access but is not hardened auth — don't
  rely on it if API costs are a serious concern; consider rate-limiting or
  per-user API keys as the project grows.

## Adding to the corpus

Drop a new `.md` file into `data/corpus/` with frontmatter:

```markdown
---
title: Your topic title
source: Where this came from (NCERT Class XI Polity, PIB, etc.)
topic: Polity | Economy | History | Geography | ...
---

Your content here.
```

Then re-run `npm run embed` and commit the updated `data/embeddings.json`.

**Licensing note:** only add content that's public domain, official
government sources (NCERT, PIB, Economic Survey), or your own original
notes. Do not scrape copyrighted commercial books (Laxmikanth, Spectrum,
etc.) into the corpus.

## Roadmap

- [ ] Answer-writing grader (rubric-based feedback on Mains answers)
- [ ] Daily current-affairs digest
- [ ] Spaced-repetition revision scheduler
- [ ] Support for self-hosted open models (Ollama) as a free alternative to OpenAI
- [ ] Bigger, community-contributed corpus

## Contributing

PRs welcome — especially corpus additions (properly sourced/licensed),
prompt improvements, and the grader feature. Open an issue first for
anything structural.

## License

MIT — see [LICENSE](./LICENSE).
