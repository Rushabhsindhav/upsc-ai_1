"use client";

import { useState } from "react";

// ⚠️ EDIT THESE TWO LINES with your real profile URLs before deploying:
const LINKEDIN_URL = "https://linkedin.com/in/your-profile-here";
const INSTAGRAM_URL = "https://instagram.com/your-profile-here";

export default function BrandingPopup() {
  const [open, setOpen] = useState(false);

  return (
    <div style={styles.wrap}>
      {open && (
        <div style={styles.menu}>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            <span style={styles.icon}>in</span> LinkedIn
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            <span style={styles.icon}>◎</span> Instagram
          </a>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        style={styles.fab}
        aria-label="Connect with the creator"
      >
        {open ? "✕" : "R"}
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    position: "fixed",
    bottom: "1.25rem",
    right: "1.25rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "0.6rem",
    zIndex: 50,
  },
  fab: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "none",
    background: "linear-gradient(135deg, #FF9933, #FFFFFF 50%, #138808)",
    color: "#1e293b",
    fontWeight: 700,
    fontSize: "1.1rem",
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    background: "#1e293b",
    padding: "0.6rem",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#e2e8f0",
    textDecoration: "none",
    fontSize: "0.85rem",
    padding: "0.4rem 0.6rem",
    borderRadius: "8px",
    background: "#0f172a",
    whiteSpace: "nowrap",
  },
  icon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "18px",
    height: "18px",
    fontSize: "0.75rem",
    fontWeight: 700,
  },
};
