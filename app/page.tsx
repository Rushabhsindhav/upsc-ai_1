"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import BrandingPopup from "@/components/BrandingPopup";
import ChakraIcon from "@/components/ChakraIcon";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: { title: string; topic: string }[];
};

const TOPIC_CHIPS = [
  { label: "🏛️ Polity", prompt: "Explain the key features of the Indian Constitution." },
  { label: "📈 Economy", prompt: "What is the role of the RBI's Monetary Policy Committee?" },
  { label: "📜 History", prompt: "Summarize the major causes of India's independence movement." },
  { label: "🌍 Geography", prompt: "Explain the monsoon system and its importance for India." },
  { label: "✍️ Mains Practice", prompt: "Give me a Mains-style answer-writing question on governance." },
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Namaste! I'm UPSC AI — ask me anything about Polity, Economy, History, or paste a Mains question for a structured answer. This is an early open-source build, so the corpus is small right now.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(overrideText?: string) {
    const text = overrideText ?? input;
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          history: newMessages
            .slice(-6)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: `Error: ${data.error}` },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.reply, sources: data.sources },
        ]);
      }
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `Error: ${e.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const showHero = messages.length === 1;

  return (
    <main style={styles.main}>
      <div className="bg-mesh">
        <div className="blob blob-saffron" />
        <div className="blob blob-indigo" />
        <div className="blob blob-green" />
      </div>
      <div className="tricolor-bar" style={{ position: "relative", zIndex: 1 }} />
      <header className="site-header" style={styles.header}>
        <div className="glow-icon">
          <ChakraIcon size={30} />
        </div>
        <h1 className="brand-title-lg" style={styles.title}>UPSC AI</h1>
        <nav style={styles.nav}>
          <Link href="/syllabus" style={styles.navLink}>
            Syllabus & Weightage
          </Link>
          <Link href="/calculator" style={styles.navLink}>
            Marks Calculator
          </Link>
        </nav>
        <span style={styles.badge}>open source · v0</span>
      </header>

      <div style={styles.chatArea}>
        {showHero && (
          <div className="card-anim soft-card" style={styles.hero}>
            <ChakraIcon size={48} />
            <h2 style={styles.heroTitle}>Your UPSC prep companion</h2>
            <p style={styles.heroSubtitle}>
              Pick a subject to get started, or ask your own question below.
            </p>
            <div className="chip-row" style={styles.chipRow}>
              {TOPIC_CHIPS.map((c) => (
                <button
                  key={c.label}
                  className="chip"
                  onClick={() => sendMessage(c.prompt)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className="message-anim soft-card"
            style={{
              ...styles.bubble,
              ...(m.role === "user" ? styles.userBubble : styles.aiBubble),
            }}
          >
            <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
            {m.sources && m.sources.length > 0 && (
              <div style={styles.sources}>
                Sources: {m.sources.map((s) => s.title).join(", ")}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div
            className="message-anim"
            style={{ ...styles.bubble, ...styles.aiBubble, display: "flex", alignItems: "center", gap: "0.6rem" }}
          >
            <ChakraIcon size={18} spin />
            Thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={styles.inputRow}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about Polity, Economy, History, or paste a Mains question..."
          className="input-glow"
          style={styles.input}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading}
          className="send-btn-glow"
          style={styles.sendBtn}
        >
          Send
        </button>
      </div>
      <BrandingPopup />
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    maxWidth: "800px",
    margin: "0 auto",
    position: "relative",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem",
    borderBottom: "1px solid #1e293b",
    position: "relative",
    zIndex: 1,
  },
  title: {
    margin: 0,
    fontSize: "1.25rem",
    fontFamily: "'Merriweather', Georgia, serif",
    fontWeight: 700,
    background: "linear-gradient(90deg, #FF9933, #f8fafc 45%, #138808)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  badge: {
    fontSize: "0.7rem",
    color: "#94a3b8",
    background: "#1e293b",
    padding: "0.2rem 0.5rem",
    borderRadius: "999px",
  },
  navLink: {
    color: "#94a3b8",
    fontSize: "0.85rem",
    textDecoration: "none",
  },
  nav: {
    marginLeft: "auto",
    display: "flex",
    gap: "1rem",
  },
  chatArea: {
    flex: 1,
    overflowY: "auto",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    position: "relative",
    zIndex: 1,
  },
  hero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "0.5rem",
    padding: "2rem 1rem",
    marginBottom: "0.5rem",
  },
  heroTitle: {
    margin: "0.5rem 0 0",
    fontFamily: "'Merriweather', Georgia, serif",
    fontSize: "1.4rem",
    color: "#f8fafc",
  },
  heroSubtitle: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "0.9rem",
    maxWidth: "420px",
  },
  chipRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "0.5rem",
    marginTop: "1rem",
  },
  bubble: {
    padding: "0.75rem 1rem",
    borderRadius: "12px",
    maxWidth: "80%",
    lineHeight: 1.5,
  },
  userBubble: {
    alignSelf: "flex-end",
    background: "#6366f1",
    color: "#fff",
  },
  aiBubble: {
    alignSelf: "flex-start",
    background: "#1e293b",
  },
  sources: {
    marginTop: "0.5rem",
    fontSize: "0.75rem",
    color: "#94a3b8",
  },
  inputRow: {
    display: "flex",
    gap: "0.5rem",
    padding: "1rem",
    borderTop: "1px solid #1e293b",
    position: "relative",
    zIndex: 1,
  },
  input: {
    flex: 1,
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#fff",
    fontSize: "1rem",
    transition: "box-shadow 0.2s ease, border-color 0.2s ease",
  },
  sendBtn: {
    padding: "0.75rem 1.25rem",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
};
