"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: { title: string; topic: string }[];
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm UPSC AI — ask me anything about Polity, Economy, History, or paste a Mains question for a structured answer. This is an early open-source build, so the corpus is small right now.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input };
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

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <h1 style={styles.title}>UPSC AI</h1>
        <span style={styles.badge}>open source · v0</span>
      </header>

      <div style={styles.chatArea}>
        {messages.map((m, i) => (
          <div
            key={i}
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
          <div style={{ ...styles.bubble, ...styles.aiBubble }}>
            Thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={styles.inputRow}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about Polity, Economy, History, or paste a Mains question..."
          style={styles.input}
        />
        <button onClick={sendMessage} disabled={loading} style={styles.sendBtn}>
          Send
        </button>
      </div>
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
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem",
    borderBottom: "1px solid #1e293b",
  },
  title: { margin: 0, fontSize: "1.25rem" },
  badge: {
    fontSize: "0.7rem",
    color: "#94a3b8",
    background: "#1e293b",
    padding: "0.2rem 0.5rem",
    borderRadius: "999px",
  },
  chatArea: {
    flex: 1,
    overflowY: "auto",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
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
  },
  input: {
    flex: 1,
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#fff",
    fontSize: "1rem",
  },
  sendBtn: {
    padding: "0.75rem 1.25rem",
    borderRadius: "8px",
    border: "none",
    background: "#6366f1",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
};
