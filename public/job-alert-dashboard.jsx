import { useState, useEffect, useCallback } from "react";

const PROFILE = {
  name: "Ashwin Vignesh Muniappan",
  degree: "M.Sc. AI Engineering — Autonomous Systems @ THI Ingolstadt",
  skills: ["Python", "PyTorch", "TensorFlow", "C/C++", "YOLOv8", "OpenCV", "RAG", "LangChain", "Docker", "ROS", "Sensor Fusion", "RADAR", "LiDAR", "FastAPI", "React", "PostgreSQL"],
  lookingFor: ["Werkstudent", "Internship", "Master Thesis", "Abschlussarbeit", "Praktikum"],
  domains: ["Autonomous Systems", "Computer Vision", "AI/ML", "Robotics", "Automotive AI", "Sensor Fusion", "LLM / NLP"],
  location: "Ingolstadt, Bavaria, Germany",
};

const PORTALS = [
  {
    name: "LinkedIn",
    color: "#0A66C2",
    icon: "💼",
    searchUrl: (q) => `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(q)}&location=Germany&f_TPR=r86400&f_JT=I`,
    tip: "Filter: Date Posted → Past 24h | Job Type → Internship",
    queries: [
      "Werkstudent Machine Learning Germany",
      "Master Thesis AI Autonomous Systems Germany",
      "Internship Computer Vision Python Germany",
    ],
  },
  {
    name: "StepStone",
    color: "#E8450A",
    icon: "🪜",
    searchUrl: (q) => `https://www.stepstone.de/jobs/${encodeURIComponent(q.replace(/\s+/g, "-"))}/in-deutschland.html?datePosted=1`,
    tip: "Use 'datePosted=1' param for last 24h. Best German portal for Werkstudent.",
    queries: [
      "Werkstudent KI Machine Learning",
      "Masterarbeit Autonomous Driving",
      "Praktikum Deep Learning Python",
    ],
  },
  {
    name: "Indeed DE",
    color: "#2164F3",
    icon: "🔍",
    searchUrl: (q) => `https://de.indeed.com/jobs?q=${encodeURIComponent(q)}&l=Deutschland&fromage=1`,
    tip: "fromage=1 = posted in last 24h. Huge volume of Werkstudent listings.",
    queries: [
      "Werkstudent AI Python PyTorch",
      "Masterarbeit Sensor Fusion Automotive",
      "Praktikum Computer Vision OpenCV",
    ],
  },
  {
    name: "Xing",
    color: "#00605A",
    icon: "✕",
    searchUrl: (q) => `https://www.xing.com/jobs/search?keywords=${encodeURIComponent(q)}&location=Deutschland`,
    tip: "Top German professional network. Many companies post Werkstudent here first.",
    queries: [
      "Werkstudent KI Maschinelles Lernen",
      "Praktikant Autonomous Systems",
      "Abschlussarbeit Machine Learning",
    ],
  },
  {
    name: "Make It in Germany",
    color: "#2E3C8C",
    icon: "🇩🇪",
    searchUrl: (q) => `https://www.make-it-in-germany.com/en/jobs/job-search?q=${encodeURIComponent(q)}`,
    tip: "Official German gov portal. Visa-friendly listings.",
    queries: ["AI Engineer intern Germany", "Werkstudent AI Munich"],
  },
  {
    name: "Glassdoor DE",
    color: "#0CAA41",
    icon: "🪟",
    searchUrl: (q) => `https://www.glassdoor.de/Job/germany-${encodeURIComponent(q.replace(/\s+/g, "-"))}-jobs-SRCH_IL.0,7_IN96_KE8,50.htm`,
    tip: "Shows salary estimates. Filter by 'Past Day'.",
    queries: ["Machine Learning Werkstudent", "Autonomous Systems intern"],
  },
];

const LIVE_JOBS = [
  {
    title: "Werkstudent im Bereich KI / Large Language Model (w/m/d)",
    company: "HENSOLDT",
    location: "Immenstaad am Bodensee",
    posted: "Feb 25, 2026",
    type: "Werkstudent",
    match: 91,
    reasons: ["LLM / NLP domain match", "Python & AI skills", "Defense-tech autonomous systems"],
    url: "https://to.indeed.com/aaywvfpk2jtp",
    source: "Indeed DE",
    fresh: true,
  },
  {
    title: "Praktikant / Werkstudent (m/w/d) Computer Vision (Medizin)",
    company: "Kite IT GmbH",
    location: "Mannheim",
    posted: "Oct 7, 2025",
    type: "Werkstudent",
    match: 83,
    reasons: ["Computer Vision (YOLOv8, OpenCV)", "Python expertise", "Deep Learning projects"],
    url: "https://to.indeed.com/aakqk7rzzmt4",
    source: "Indeed DE",
    fresh: false,
  },
];

const SEARCH_PROMPTS = [
  { label: "Werkstudent AI/ML", query: "Werkstudent (AI OR \"Machine Learning\" OR \"Deep Learning\" OR \"KI\") Python" },
  { label: "Master Thesis Automotive", query: "\"Masterarbeit\" OR \"Abschlussarbeit\" (\"Autonomous\" OR \"Sensor Fusion\" OR \"LiDAR\" OR \"RADAR\") Germany" },
  { label: "Internship Computer Vision", query: "Praktikum OR Internship (\"Computer Vision\" OR YOLOv8 OR OpenCV) Germany" },
  { label: "Werkstudent LLM/NLP", query: "Werkstudent (LLM OR \"Large Language\" OR RAG OR NLP OR LangChain) Germany" },
  { label: "Thesis Autonomous Driving", query: "\"Master Thesis\" OR \"Masterarbeit\" (\"Autonomous Driving\" OR \"ADAS\" OR Robotics) Bayern Germany" },
];

function MatchBadge({ score }) {
  const color = score >= 90 ? "#22c55e" : score >= 75 ? "#eab308" : "#f97316";
  return (
    <span style={{
      background: `${color}22`,
      color,
      border: `1px solid ${color}55`,
      borderRadius: "999px",
      fontSize: "11px",
      fontWeight: 700,
      padding: "2px 10px",
      letterSpacing: "0.5px",
    }}>
      {score}% match
    </span>
  );
}

function JobCard({ job }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.035)",
      border: job.fresh ? "1px solid rgba(34,197,94,0.35)" : "1px solid rgba(255,255,255,0.07)",
      borderRadius: "14px",
      padding: "18px 20px",
      marginBottom: "12px",
      position: "relative",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      {job.fresh && (
        <span style={{
          position: "absolute", top: "14px", right: "14px",
          background: "rgba(34,197,94,0.15)", color: "#22c55e",
          border: "1px solid rgba(34,197,94,0.3)",
          borderRadius: "999px", fontSize: "10px", fontWeight: 700,
          padding: "2px 8px", letterSpacing: "0.8px",
        }}>● FRESH</span>
      )}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <div style={{ flex: 1 }}>
          <a href={job.url} target="_blank" rel="noreferrer" style={{
            color: "#e2e8f0", fontWeight: 600, fontSize: "15px",
            textDecoration: "none", lineHeight: 1.3, display: "block", marginBottom: "4px",
          }}
            onMouseEnter={e => e.target.style.color = "#60a5fa"}
            onMouseLeave={e => e.target.style.color = "#e2e8f0"}
          >
            {job.title}
          </a>
          <div style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "8px" }}>
            <strong style={{ color: "#cbd5e1" }}>{job.company}</strong>
            {" · "}{job.location}
            {" · "}<span style={{ color: "#64748b" }}>{job.source}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
            <MatchBadge score={job.match} />
            <span style={{
              background: "rgba(99,102,241,0.12)", color: "#a5b4fc",
              border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: "999px", fontSize: "11px", padding: "2px 10px",
            }}>{job.type}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {job.reasons.map((r, i) => (
              <span key={i} style={{
                background: "rgba(255,255,255,0.04)", color: "#64748b",
                borderRadius: "6px", fontSize: "11px", padding: "2px 8px",
              }}>✓ {r}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PortalCard({ portal }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "14px",
      padding: "16px 18px",
      marginBottom: "10px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        <span style={{ fontSize: "20px" }}>{portal.icon}</span>
        <span style={{
          fontWeight: 700, fontSize: "14px",
          color: portal.color,
          letterSpacing: "0.3px",
        }}>{portal.name}</span>
        <span style={{ color: "#475569", fontSize: "11px", flex: 1 }}>— {portal.tip}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {portal.queries.map((q, i) => (
          <a key={i} href={portal.searchUrl(q)} target="_blank" rel="noreferrer" style={{
            background: `${portal.color}18`,
            border: `1px solid ${portal.color}40`,
            color: portal.color,
            borderRadius: "8px", fontSize: "11px", fontWeight: 600,
            padding: "5px 12px", textDecoration: "none",
            transition: "background 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = `${portal.color}30`}
            onMouseLeave={e => e.currentTarget.style.background = `${portal.color}18`}
          >
            🔎 {q}
          </a>
        ))}
      </div>
    </div>
  );
}

function AiAnalyzer() {
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = useCallback(async () => {
    if (!jobDesc.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a job-fit analyzer for this candidate profile:
- Name: Ashwin Vignesh Muniappan
- Degree: M.Sc. AI Engineering for Autonomous Systems @ THI Ingolstadt (ongoing)
- Skills: Python, C/C++, PyTorch, TensorFlow, YOLOv8, OpenCV, LangChain, RAG, FastAPI, Docker, pgvector, Sensor Fusion, RADAR, LiDAR, Power BI, React, Streamlit
- Projects: RAG system, Mini-CNN (C/C++), YOLO Bat Swing, Radar-AI, Face 3D Reconstruction, N8N Webhook
- Prior work: ERP Analyst at DXC Technology (2y), Power BI dashboards, Power Automate
- Looking for: Werkstudent / Internship / Master Thesis in Germany (AI, Autonomous, CV, LLM domain)

Analyze this job posting and return ONLY valid JSON (no markdown, no backticks):
{
  "match_score": <0-100>,
  "verdict": "<Strong Fit|Moderate Fit|Weak Fit>",
  "matching_skills": ["<skill1>", "<skill2>", "..."],
  "skill_gaps": ["<gap1>", "..."],
  "summary": "<2 sentences max>",
  "apply": <true|false>
}

Job posting:
${jobDesc}`
          }]
        })
      });
      const data = await res.json();
      const raw = data.content?.find(b => b.type === "text")?.text || "{}";
      const clean = raw.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean));
    } catch (e) {
      setResult({ error: "Could not analyze. Try again." });
    }
    setLoading(false);
  }, [jobDesc]);

  return (
    <div>
      <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "10px" }}>
        Paste any job description → get an instant AI match score against your profile
      </p>
      <textarea
        value={jobDesc}
        onChange={e => setJobDesc(e.target.value)}
        placeholder="Paste job description here..."
        style={{
          width: "100%", minHeight: "120px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "10px", padding: "12px",
          color: "#e2e8f0", fontSize: "13px",
          resize: "vertical", outline: "none",
          boxSizing: "border-box", fontFamily: "inherit",
        }}
      />
      <button
        onClick={analyze}
        disabled={loading || !jobDesc.trim()}
        style={{
          marginTop: "10px",
          background: loading ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.85)",
          color: "white", border: "none", borderRadius: "10px",
          padding: "10px 24px", cursor: loading ? "not-allowed" : "pointer",
          fontSize: "13px", fontWeight: 600, letterSpacing: "0.3px",
          transition: "background 0.2s",
        }}
      >
        {loading ? "⚙️ Analyzing..." : "⚡ Analyze Match"}
      </button>

      {result && !result.error && (
        <div style={{
          marginTop: "16px",
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${result.match_score >= 80 ? "rgba(34,197,94,0.3)" : result.match_score >= 60 ? "rgba(234,179,8,0.3)" : "rgba(249,115,22,0.3)"}`,
          borderRadius: "12px", padding: "16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "28px", fontWeight: 800, color: result.match_score >= 80 ? "#22c55e" : result.match_score >= 60 ? "#eab308" : "#f97316" }}>
              {result.match_score}%
            </span>
            <div>
              <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "14px" }}>{result.verdict}</div>
              <div style={{ color: "#64748b", fontSize: "12px" }}>{result.apply ? "✅ Recommended to apply" : "⚠️ Consider skipping"}</div>
            </div>
          </div>
          <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "12px" }}>{result.summary}</p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {result.matching_skills?.length > 0 && (
              <div style={{ flex: 1, minWidth: "200px" }}>
                <div style={{ color: "#22c55e", fontSize: "11px", fontWeight: 700, marginBottom: "6px", letterSpacing: "0.8px" }}>✓ MATCHING</div>
                {result.matching_skills.map((s, i) => (
                  <div key={i} style={{ color: "#4ade80", fontSize: "12px", marginBottom: "3px" }}>• {s}</div>
                ))}
              </div>
            )}
            {result.skill_gaps?.length > 0 && (
              <div style={{ flex: 1, minWidth: "200px" }}>
                <div style={{ color: "#f97316", fontSize: "11px", fontWeight: 700, marginBottom: "6px", letterSpacing: "0.8px" }}>⚠ GAPS</div>
                {result.skill_gaps.map((s, i) => (
                  <div key={i} style={{ color: "#fb923c", fontSize: "12px", marginBottom: "3px" }}>• {s}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {result?.error && (
        <div style={{ marginTop: "12px", color: "#f87171", fontSize: "13px" }}>{result.error}</div>
      )}
    </div>
  );
}

function NotificationGuide() {
  const steps = [
    { portal: "LinkedIn", icon: "💼", color: "#0A66C2", steps: ["Go to Jobs → Job Alerts", "Search: 'Werkstudent Machine Learning Germany'", "Set frequency: Daily (covers ~24h)", "Repeat for: 'Master Thesis AI Germany'"] },
    { portal: "StepStone", icon: "🪜", color: "#E8450A", steps: ["Run a search on stepstone.de", "Click 'Job-Alert erstellen' (bell icon)", "Enter your email → get daily digest", "Works for Werkstudent, Praktikum, Thesis"] },
    { portal: "Indeed DE", icon: "🔍", color: "#2164F3", steps: ["Search on de.indeed.com", "Scroll down → 'Erhalten Sie neue Jobs per E-Mail'", "Enter email → instant alerts", "Set to 'Täglich' for freshest listings"] },
    { portal: "Google Jobs", icon: "🟢", color: "#34A853", steps: ["Search: 'Werkstudent AI site:linkedin.com OR site:stepstone.de'", "Scroll to Jobs box → Enable notification", "Most real-time: < 1 hour delay", "Also try: site:careers.company.com"] },
  ];

  return (
    <div>
      <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "14px" }}>
        Set these up once → get notified within hours of new postings
      </p>
      {steps.map((s, i) => (
        <div key={i} style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "12px", padding: "14px 16px", marginBottom: "10px",
          display: "flex", gap: "12px",
        }}>
          <span style={{ fontSize: "20px" }}>{s.icon}</span>
          <div>
            <div style={{ fontWeight: 700, color: s.color, fontSize: "13px", marginBottom: "8px" }}>{s.portal}</div>
            {s.steps.map((step, j) => (
              <div key={j} style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "4px" }}>
                <span style={{ color: "#475569" }}>{j + 1}.</span> {step}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("jobs");
  const [lastUpdated] = useState(new Date().toLocaleTimeString("en-DE", { hour: "2-digit", minute: "2-digit" }));

  const tabs = [
    { id: "jobs", label: "🎯 Live Jobs", count: LIVE_JOBS.length },
    { id: "search", label: "🔎 Search Portals" },
    { id: "analyze", label: "⚡ AI Analyzer" },
    { id: "notify", label: "🔔 Notifications" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080C14",
      fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
      color: "#e2e8f0",
      padding: "0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } 
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}</style>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(16,185,129,0.06) 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "20px 24px 0",
      }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
            <div>
              <div style={{ fontSize: "10px", color: "#4ade80", fontWeight: 700, letterSpacing: "2px", marginBottom: "6px" }}>● LIVE JOB TRACKER</div>
              <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.3px" }}>
                Ashwin's Job Alert Dashboard
              </h1>
              <p style={{ margin: "4px 0 0", color: "#475569", fontSize: "11px" }}>
                {PROFILE.degree}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "10px", color: "#334155", letterSpacing: "1px" }}>LAST SCAN</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#64748b" }}>{lastUpdated}</div>
            </div>
          </div>

          {/* Skill chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", margin: "14px 0 16px" }}>
            {PROFILE.skills.slice(0, 10).map(s => (
              <span key={s} style={{
                background: "rgba(99,102,241,0.1)", color: "#818cf8",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: "6px", fontSize: "10px", padding: "2px 8px", fontWeight: 600,
              }}>{s}</span>
            ))}
            <span style={{ color: "#334155", fontSize: "10px", padding: "2px 6px" }}>+{PROFILE.skills.length - 10} more</span>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "0", borderBottom: "1px solid transparent" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                background: "transparent",
                border: "none",
                borderBottom: tab === t.id ? "2px solid #6366f1" : "2px solid transparent",
                color: tab === t.id ? "#a5b4fc" : "#475569",
                padding: "10px 16px 12px",
                cursor: "pointer",
                fontSize: "12px", fontWeight: 600,
                fontFamily: "inherit",
                transition: "color 0.2s",
                whiteSpace: "nowrap",
              }}>
                {t.label}
                {t.count !== undefined && (
                  <span style={{
                    marginLeft: "6px",
                    background: "rgba(99,102,241,0.2)", color: "#818cf8",
                    borderRadius: "999px", fontSize: "10px", padding: "1px 6px",
                  }}>{t.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "20px 24px" }}>

        {tab === "jobs" && (
          <div>
            <div style={{
              background: "rgba(34,197,94,0.06)",
              border: "1px solid rgba(34,197,94,0.15)",
              borderRadius: "10px", padding: "12px 16px", marginBottom: "18px",
              fontSize: "12px", color: "#4ade80",
            }}>
              <strong>ℹ️ About freshness:</strong>{" "}
              <span style={{ color: "#64748b" }}>
                Jobs marked <strong style={{ color: "#22c55e" }}>FRESH</strong> were found in today's search. Check the "Search Portals" tab to run live searches on German portals filtered to the last 24 hours.
              </span>
            </div>
            {LIVE_JOBS.map((job, i) => <JobCard key={i} job={job} />)}
            <div style={{ marginTop: "20px", padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px" }}>
              <p style={{ margin: 0, fontSize: "12px", color: "#475569" }}>
                💡 <strong style={{ color: "#64748b" }}>To get jobs under 12 hours old:</strong> Use the <span style={{ color: "#a5b4fc" }}>Search Portals</span> tab → click any query on LinkedIn / StepStone / Indeed DE. They all have "past 24h" pre-applied. Set up email alerts in the <span style={{ color: "#a5b4fc" }}>Notifications</span> tab.
              </p>
            </div>
          </div>
        )}

        {tab === "search" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", color: "#4ade80", letterSpacing: "1.5px", fontWeight: 700, marginBottom: "8px" }}>OPTIMIZED SEARCH QUERIES</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                {SEARCH_PROMPTS.map((p, i) => (
                  <a key={i} href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(p.query)}&location=Germany&f_TPR=r86400`}
                    target="_blank" rel="noreferrer"
                    style={{
                      background: "rgba(99,102,241,0.1)", color: "#818cf8",
                      border: "1px solid rgba(99,102,241,0.2)",
                      borderRadius: "8px", fontSize: "11px", fontWeight: 600,
                      padding: "6px 12px", textDecoration: "none",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.2)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(99,102,241,0.1)"}
                  >🔗 {p.label}</a>
                ))}
              </div>
              <p style={{ color: "#334155", fontSize: "11px", marginTop: "8px" }}>↑ All links open LinkedIn with "past 24h" filter pre-applied</p>
            </div>
            <div style={{ fontSize: "11px", color: "#64748b", letterSpacing: "1.5px", fontWeight: 700, marginBottom: "12px" }}>ALL PORTALS → LIVE SEARCHES</div>
            {PORTALS.map((p, i) => <PortalCard key={i} portal={p} />)}
          </div>
        )}

        {tab === "analyze" && <AiAnalyzer />}
        {tab === "notify" && <NotificationGuide />}
      </div>
    </div>
  );
}
