"use client";

import { useState } from "react";
import Link from "next/link";
import ChakraIcon from "@/components/ChakraIcon";

const GS_TOTAL_Q = 100;
const GS_CORRECT_MARKS = 2;
const GS_NEGATIVE_MARKS = 0.66;
const GS_MAX_MARKS = 200;

const CSAT_TOTAL_Q = 80;
const CSAT_CORRECT_MARKS = 2.5;
const CSAT_NEGATIVE_MARKS = 0.83;
const CSAT_MAX_MARKS = 200;
const CSAT_QUALIFYING_PERCENT = 0.33;

// A rough, illustrative reference point only — actual cutoffs vary by year and category.
const REFERENCE_GS_CUTOFF = 88;

export default function CalculatorPage() {
  const [gsCorrect, setGsCorrect] = useState(55);
  const [gsIncorrect, setGsIncorrect] = useState(25);
  const [csatCorrect, setCsatCorrect] = useState(42);
  const [csatIncorrect, setCsatIncorrect] = useState(15);

  const gsMaxIncorrect = GS_TOTAL_Q - gsCorrect;
  const csatMaxIncorrect = CSAT_TOTAL_Q - csatCorrect;

  const gsScore = Math.max(
    0,
    gsCorrect * GS_CORRECT_MARKS - gsIncorrect * GS_NEGATIVE_MARKS
  );
  const csatScore = Math.max(
    0,
    csatCorrect * CSAT_CORRECT_MARKS - csatIncorrect * CSAT_NEGATIVE_MARKS
  );

  const csatQualifyingMarks = CSAT_MAX_MARKS * CSAT_QUALIFYING_PERCENT;
  const csatPassed = csatScore >= csatQualifyingMarks;
  const gsClearsReference = gsScore >= REFERENCE_GS_CUTOFF;

  return (
    <main style={styles.main}>
      <div className="bg-mesh">
        <div className="blob blob-saffron" />
        <div className="blob blob-indigo" />
        <div className="blob blob-green" />
      </div>
      <div className="tricolor-bar" style={{ position: "relative", zIndex: 1 }} />
      <header className="site-header" style={styles.header}>
        <Link href="/" style={styles.backLink}>
          ← Back to chat
        </Link>
        <div className="glow-icon">
          <ChakraIcon size={26} />
        </div>
        <h1 style={styles.headerTitle}>Prelims Marks Calculator</h1>
        <Link href="/syllabus" style={{ ...styles.backLink, marginLeft: "auto" }}>
          Syllabus & Weightage →
        </Link>
      </header>

      <div style={styles.content}>
        <p className="card-anim" style={styles.intro}>
          Estimate your GS Paper I score and check if your CSAT attempt clears the qualifying
          threshold. Drag the sliders to match your attempt.
        </p>

        <div className="calc-grid">
          {/* GS Paper I */}
          <div className="card-anim soft-card panel-accent-indigo" style={styles.panel}>
            <div style={styles.panelHeader}>
              <span style={styles.panelLabel}>PAPER I · MERIT RANKING</span>
              <h2 style={styles.panelTitle}>General Studies</h2>
              <span style={styles.panelMeta}>
                {GS_TOTAL_Q} Qs · {GS_MAX_MARKS} Marks · +{GS_CORRECT_MARKS} / −{GS_NEGATIVE_MARKS}
              </span>
            </div>

            <label style={styles.sliderLabel}>
              Correct Answers <span style={styles.sliderValue}>{gsCorrect}</span>
            </label>
            <input
              type="range"
              min={0}
              max={GS_TOTAL_Q}
              value={gsCorrect}
              onChange={(e) => {
                const v = Number(e.target.value);
                setGsCorrect(v);
                if (gsIncorrect > GS_TOTAL_Q - v) setGsIncorrect(GS_TOTAL_Q - v);
              }}
              style={styles.slider}
            />

            <label style={styles.sliderLabel}>
              Incorrect Answers <span style={styles.sliderValue}>{gsIncorrect}</span>
            </label>
            <input
              type="range"
              min={0}
              max={gsMaxIncorrect}
              value={gsIncorrect}
              onChange={(e) => setGsIncorrect(Number(e.target.value))}
              style={styles.slider}
            />

            <div style={styles.resultBox}>
              <div style={styles.resultRow}>
                <span>Attempted: {gsCorrect + gsIncorrect} · Left: {GS_TOTAL_Q - gsCorrect - gsIncorrect}</span>
              </div>
              <div style={styles.resultScore}>
                Net GS-1 Score: <strong>{gsScore.toFixed(2)}</strong> / {GS_MAX_MARKS}
              </div>
            </div>
          </div>

          {/* CSAT */}
          <div className="card-anim soft-card panel-accent-green" style={styles.panel}>
            <div style={styles.panelHeader}>
              <span style={{ ...styles.panelLabel, color: "#22c55e" }}>PAPER II · QUALIFYING</span>
              <h2 style={styles.panelTitle}>CSAT</h2>
              <span style={styles.panelMeta}>
                {CSAT_TOTAL_Q} Qs · {CSAT_MAX_MARKS} Marks · +{CSAT_CORRECT_MARKS} / −{CSAT_NEGATIVE_MARKS}
              </span>
            </div>

            <label style={styles.sliderLabel}>
              Correct Answers <span style={styles.sliderValue}>{csatCorrect}</span>
            </label>
            <input
              type="range"
              min={0}
              max={CSAT_TOTAL_Q}
              value={csatCorrect}
              onChange={(e) => {
                const v = Number(e.target.value);
                setCsatCorrect(v);
                if (csatIncorrect > CSAT_TOTAL_Q - v) setCsatIncorrect(CSAT_TOTAL_Q - v);
              }}
              style={styles.slider}
            />

            <label style={styles.sliderLabel}>
              Incorrect Answers <span style={styles.sliderValue}>{csatIncorrect}</span>
            </label>
            <input
              type="range"
              min={0}
              max={csatMaxIncorrect}
              value={csatIncorrect}
              onChange={(e) => setCsatIncorrect(Number(e.target.value))}
              style={styles.slider}
            />

            <div style={styles.resultBox}>
              <div style={styles.resultRow}>
                <span>
                  Attempted: {csatCorrect + csatIncorrect} · Required: {csatQualifyingMarks.toFixed(2)}M
                </span>
              </div>
              <div
                style={{
                  ...styles.resultScore,
                  color: csatPassed ? "#22c55e" : "#ef4444",
                }}
              >
                Net CSAT Score: <strong>{csatScore.toFixed(2)}</strong> / {CSAT_MAX_MARKS}{" "}
                {csatPassed ? "(Qualifying)" : "(Below threshold)"}
              </div>
            </div>
          </div>
        </div>

        <div
          className="card-anim soft-card"
          style={{
            ...styles.summary,
            borderColor: csatPassed && gsClearsReference ? "#22c55e" : "#334155",
          }}
        >
          <strong style={{ color: csatPassed ? "#22c55e" : "#ef4444" }}>
            {csatPassed ? "✓ CSAT Qualifying Zone" : "✗ CSAT Below Qualifying Threshold"}
          </strong>
          <p style={styles.summaryText}>
            Your GS-1 score of <strong>{gsScore.toFixed(2)}</strong> is{" "}
            {gsClearsReference ? "above" : "below"} the illustrative reference cutoff of{" "}
            {REFERENCE_GS_CUTOFF}. Actual Prelims cutoffs vary each year by category and total
            vacancies — treat this as a rough self-check, not an official prediction.
          </p>
        </div>
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
    gap: "1.5rem",
  },
  intro: {
    color: "#94a3b8",
    fontSize: "0.9rem",
    lineHeight: 1.6,
    margin: 0,
  },
  panel: {
    background: "#1e293b",
    borderRadius: "12px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
  },
  panelHeader: {
    marginBottom: "1rem",
  },
  panelLabel: {
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.05em",
    color: "#818cf8",
  },
  panelTitle: {
    margin: "0.25rem 0",
    fontSize: "1.1rem",
    fontFamily: "'Merriweather', Georgia, serif",
  },
  panelMeta: {
    fontSize: "0.75rem",
    color: "#64748b",
  },
  sliderLabel: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.85rem",
    color: "#cbd5e1",
    marginTop: "0.75rem",
    marginBottom: "0.35rem",
  },
  sliderValue: {
    color: "#fff",
    fontWeight: 600,
  },
  slider: {
    width: "100%",
    accentColor: "#6366f1",
  },
  resultBox: {
    marginTop: "1.25rem",
    paddingTop: "1rem",
    borderTop: "1px solid #334155",
  },
  resultRow: {
    fontSize: "0.8rem",
    color: "#94a3b8",
    marginBottom: "0.4rem",
  },
  resultScore: {
    fontSize: "0.95rem",
    color: "#e2e8f0",
  },
  summary: {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "12px",
    padding: "1.25rem 1.5rem",
  },
  summaryText: {
    margin: "0.5rem 0 0",
    fontSize: "0.85rem",
    color: "#94a3b8",
    lineHeight: 1.6,
  },
};
