"use client";

import Link from "next/link";
import ChakraIcon from "@/components/ChakraIcon";

const WEIGHTAGE = [
  { subject: "Environment, Ecology, Biodiversity & Climate", priority: "Very High" },
  { subject: "Indian Polity, Constitution & Governance", priority: "High" },
  { subject: "Indian Economy & Social Development", priority: "High" },
  { subject: "History of India & Art/Culture", priority: "High" },
  { subject: "Science & Technology", priority: "High" },
  { subject: "Current Affairs & International Relations", priority: "High" },
  { subject: "Geography (Physical, Indian & World)", priority: "Medium" },
];

const PRELIMS_TOPICS = [
  "Indian Polity & Governance — Constitution, Panchayati Raj, public policy, rights issues",
  "Economy — Growth & development, budgeting, inclusion, sustainable development",
  "Environment & Ecology — Biodiversity, climate change, protected areas, pollution",
  "History & Culture — Ancient to modern India, art forms, literature, architecture",
  "Geography — Physical, Indian, and world geography",
  "Science & Technology — Everyday science, space, biotech, IT, defense",
  "Current Affairs — National and international events of contemporary importance",
];

const MAINS_PAPERS = [
  { paper: "Essay", detail: "Two essays, 125 marks each" },
  { paper: "GS Paper I", detail: "Indian Heritage & Culture, History, Geography of the World & Society" },
  { paper: "GS Paper II", detail: "Governance, Constitution, Polity, Social Justice & International Relations" },
  { paper: "GS Paper III", detail: "Technology, Economic Development, Biodiversity, Environment, Security & Disaster Management" },
  { paper: "GS Paper IV", detail: "Ethics, Integrity & Aptitude" },
  { paper: "Optional Paper I & II", detail: "One subject of the candidate's choice from the UPSC optional list" },
];

const priorityColor: Record<string, string> = {
  "Very High": "#ef4444",
  High: "#f59e0b",
  Medium: "#22c55e",
};

export default function SyllabusPage() {
  return (
    <main style={styles.main}>
      <div className="bg-pattern" />
      <div className="tricolor-bar" style={{ position: "relative", zIndex: 1 }} />
      <header style={styles.header}>
        <Link href="/" style={styles.backLink}>
          ← Back to chat
        </Link>
        <div className="glow-icon">
          <ChakraIcon size={26} />
        </div>
        <h1 style={styles.headerTitle}>Syllabus & Weightage</h1>
      </header>

      <div style={styles.content}>
        <section className="card-anim" style={styles.section}>
          <h2 style={styles.h2}>UPSC Prelims — GS Paper I & CSAT</h2>
          <p style={styles.p}>
            Prelims is a qualifying stage (200 marks GS Paper I, scored; 200 marks CSAT, qualifying-only at 33%).
            These are the recurring high-yield areas:
          </p>
          <ul style={styles.list}>
            {PRELIMS_TOPICS.map((t) => (
              <li key={t} style={styles.listItem}>{t}</li>
            ))}
          </ul>
        </section>

        <section className="card-anim" style={styles.section}>
          <h2 style={styles.h2}>Subject-Wise Preparation Priority</h2>
          <p style={styles.p}>
            Based on how frequently each area has appeared across recent Prelims papers — useful for allocating
            your study time.
          </p>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Subject Domain</th>
                  <th style={styles.th}>Preparation Priority</th>
                </tr>
              </thead>
              <tbody>
                {WEIGHTAGE.map((row) => (
                  <tr key={row.subject}>
                    <td style={styles.td}>{row.subject}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          background: `${priorityColor[row.priority]}22`,
                          color: priorityColor[row.priority],
                        }}
                      >
                        {row.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card-anim" style={styles.section}>
          <h2 style={styles.h2}>UPSC Mains — Written Papers</h2>
          <p style={styles.p}>
            Nine papers total, of which seven count toward the merit rank (Essay + GS I–IV + two Optional papers);
            English and a regional language paper are qualifying-only.
          </p>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Paper</th>
                  <th style={styles.th}>Covers</th>
                </tr>
              </thead>
              <tbody>
                {MAINS_PAPERS.map((row) => (
                  <tr key={row.paper}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{row.paper}</td>
                    <td style={styles.td}>{row.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card-anim" style={{ ...styles.section, textAlign: "center" }}>
          <p style={styles.p}>Have a question about any of these topics?</p>
          <Link href="/" style={styles.ctaBtn}>
            Ask UPSC AI →
          </Link>
        </section>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    maxWidth: "900px",
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
  backLink: {
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: "0.85rem",
  },
  headerTitle: {
    margin: 0,
    fontSize: "1.15rem",
    fontFamily: "'Merriweather', Georgia, serif",
    fontWeight: 700,
  },
  content: {
    padding: "1.5rem 1rem 3rem",
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "1.75rem",
  },
  section: {
    background: "#1e293b",
    borderRadius: "12px",
    padding: "1.5rem",
  },
  h2: {
    margin: "0 0 0.75rem",
    fontSize: "1.15rem",
    fontFamily: "'Merriweather', Georgia, serif",
  },
  p: {
    color: "#94a3b8",
    fontSize: "0.9rem",
    lineHeight: 1.6,
    margin: "0 0 0.75rem",
  },
  list: {
    margin: 0,
    paddingLeft: "1.2rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  listItem: {
    fontSize: "0.9rem",
    lineHeight: 1.5,
    color: "#e2e8f0",
  },
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.85rem",
  },
  th: {
    textAlign: "left",
    padding: "0.6rem 0.75rem",
    borderBottom: "1px solid #334155",
    color: "#94a3b8",
    fontWeight: 600,
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  },
  td: {
    padding: "0.6rem 0.75rem",
    borderBottom: "1px solid #263449",
    color: "#e2e8f0",
  },
  badge: {
    padding: "0.2rem 0.6rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: 600,
  },
  ctaBtn: {
    display: "inline-block",
    marginTop: "0.5rem",
    padding: "0.6rem 1.25rem",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "0.9rem",
  },
};
