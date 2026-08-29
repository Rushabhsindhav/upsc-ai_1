import { NextRequest, NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";
import { retrieveContext } from "@/lib/retrieval";

const SYSTEM_PROMPT = `You are UPSC AI, a study assistant for UPSC Civil Services
Exam aspirants (Prelims, Mains, and Interview). You answer using the provided
context chunks from the curated corpus (NCERT-based notes, PYQs, official
sources) whenever relevant. Always:
- Cite which source/topic your answer draws from when you used the context.
- If the context doesn't cover the question, say so plainly and answer from
  general knowledge, clearly flagged as "not from the corpus."
- For Mains-style answer requests, structure responses with intro-body-
  conclusion and stay mindful of word limits when the user gives one.
- Be exam-focused and concise — this is a study tool, not a general chatbot.`;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing 'message'" }, { status: 400 });
    }

    const contextChunks = await retrieveContext(message, 3);
    const contextBlock = contextChunks
      .map(
        (c, i) =>
          `[Source ${i + 1}: ${c.title} (${c.topic})]\n${c.text}`
      )
      .join("\n\n");

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "system",
          content: `Retrieved context for this query:\n\n${contextBlock || "(no relevant context found in corpus)"}`,
        },
        ...(Array.isArray(history) ? history : []),
        { role: "user", content: message },
      ],
      temperature: 0.4,
    });

    const reply = completion.choices[0]?.message?.content || "";

    return NextResponse.json({
      reply,
      sources: contextChunks.map((c) => ({ title: c.title, topic: c.topic })),
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
