import { C, STEPS } from "../data/constants.js";
import { BAR_LABELS } from "../lib/scoring.js";

/* ── الهيدر ── */
export function Header() {
  return (
    <header style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14, marginBottom: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: `linear-gradient(135deg, ${C.mint}, ${C.deep})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: `0 6px 18px ${C.mint}55` }}>🌱</div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: C.deep, letterSpacing: "-0.3px" }}>نبتة</div>
          <div style={{ fontSize: 11.5, color: C.sub, marginTop: 1 }}>ازرع فكرتك · تحقق منها · اجعلها تثمر</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, padding: "6px 14px", borderRadius: 99, background: C.white, color: C.teal, border: `1.5px solid ${C.mint}` }}>المرحلة ١ · الفكرة والتحقق</span>
        <span style={{ fontSize: 11.5, fontWeight: 700, padding: "6px 14px", borderRadius: 99, background: C.deep, color: C.white }}>✦ مدعوم بالذكاء الاصطناعي</span>
      </div>
    </header>
  );
}

/* ── شريط الخطوات ── */
export function StepsNav({ step, onJump }) {
  return (
    <nav style={{ display: "grid", gridTemplateColumns: `repeat(${STEPS.length}, 1fr)`, gap: 6, background: C.white, padding: 8, borderRadius: 18, boxShadow: "0 4px 20px rgba(31,111,95,.07)", marginBottom: 20 }}>
      {STEPS.map((s, i) => {
        const done = i < step, active = i === step;
        return (
          <button key={s.id} onClick={() => i <= step && onJump(i)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "10px 4px", borderRadius: 12, border: "none", cursor: i <= step ? "pointer" : "default", background: active ? C.tealSoft : done ? C.mintSoft : "transparent", transition: "background .2s", fontFamily: "inherit" }}>
            <span style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, background: done ? C.mint : active ? C.deep : C.mist, color: done || active ? C.white : C.faint, transition: "all .2s" }}>
              {done ? "✓" : i + 1}
            </span>
            <span style={{ fontSize: 11, fontWeight: active ? 800 : 600, color: active ? C.deep : done ? C.teal : C.faint, whiteSpace: "nowrap" }}>{s.name}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ── بطاقة الدرجة ── */
export function ScoreCard({ score, bars, stage }) {
  const R = 52;
  const CIRC = Math.PI * R;
  const offset = CIRC * (1 - score / 100);
  return (
    <section style={{ background: C.white, borderRadius: 20, boxShadow: "0 4px 20px rgba(31,111,95,.07)", overflow: "hidden" }}>
      <div style={{ padding: "13px 18px", borderBottom: `1px solid ${C.mist}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13.5, fontWeight: 800, color: C.deep }}>مؤشر نمو الفكرة</span>
        <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, background: stage.tone === "strong" ? C.mintSoft : stage.tone === "medium" ? C.amberSoft : C.mist, color: stage.tone === "strong" ? C.teal : stage.tone === "medium" ? C.amber : C.sub }}>
          {stage.emoji} {stage.label}
        </span>
      </div>
      <div style={{ padding: "18px 18px 14px", textAlign: "center" }}>
        <svg viewBox="0 0 120 68" width="150" style={{ maxWidth: "100%", overflow: "visible" }}>
          <path d="M 8 62 A 52 52 0 0 1 112 62" fill="none" stroke={C.mist} strokeWidth="9" strokeLinecap="round" />
          <path d="M 8 62 A 52 52 0 0 1 112 62" fill="none" stroke="url(#nabtaGrad)" strokeWidth="9" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset .8s cubic-bezier(.4,0,.2,1)" }} />
          <defs>
            <linearGradient id="nabtaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={C.mint} />
              <stop offset="100%" stopColor={C.deep} />
            </linearGradient>
          </defs>
          <text x="60" y="56" textAnchor="middle" fontSize="26" fontWeight="900" fill={C.deep}>{score}</text>
          <text x="60" y="67" textAnchor="middle" fontSize="9" fill={C.faint}>من ١٠٠</text>
        </svg>
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 9 }}>
          {BAR_LABELS.map((lbl, i) => (
            <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ fontSize: 11, color: C.sub, minWidth: 88, textAlign: "right" }}>{lbl}</span>
              <div style={{ flex: 1, height: 6, background: C.mist, borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${bars[i]}%`, borderRadius: 99, background: `linear-gradient(90deg, ${C.mint}, ${C.teal})`, transition: "width .7s cubic-bezier(.4,0,.2,1)" }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: C.deep, minWidth: 24, textAlign: "left" }}>{bars[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
