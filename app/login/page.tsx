"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push(params.get("from") || "/");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
    }
  }

  return (
    <main style={styles.wrap}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.title}>UPSC AI</h1>
        <p style={styles.subtitle}>Enter the access password to continue</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={styles.input}
          autoFocus
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Checking..." : "Enter"}
        </button>
      </form>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f172a",
    padding: "1rem",
  },
  card: {
    background: "#1e293b",
    padding: "2rem",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "360px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },
  title: { color: "#fff", margin: 0, fontSize: "1.5rem" },
  subtitle: { color: "#94a3b8", marginTop: "0.25rem", fontSize: "0.9rem" },
  input: {
    width: "100%",
    padding: "0.75rem",
    marginTop: "1.25rem",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#fff",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  error: { color: "#f87171", fontSize: "0.85rem", marginTop: "0.5rem" },
  button: {
    width: "100%",
    padding: "0.75rem",
    marginTop: "1rem",
    borderRadius: "8px",
    border: "none",
    background: "#6366f1",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "1rem",
  },
};
