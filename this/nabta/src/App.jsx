import { useState, useEffect, useRef } from "react";
import { C, STEPS, SEGMENTS, FALLBACK_INSIGHTS } from "./data/constants.js";
import { computeBars, computeScore, growthStage } from "./lib/scoring.js";
import { buildContext, getInsights, askCoach, getFinalReport, fallbackReport } from "./lib/ai.js";
import { Header, StepsNav, ScoreCard } from "./components/Layout.jsx";
import { AICoach } from "./components/AICoach.jsx";
import { StepForm } from "./components/StepForm.jsx";

export default function App() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState(() => {
    try { return JSON.parse(localStorage.getItem("nabta") || "{}"); } catch { return {}; }
  });
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const timer = useRef(null);

  const set = (k, v) => setA((p) => ({ ...p, [k]: v }));

  /* حفظ تلقائي */
  useEffect(() => {
    try { localStorage.setItem("nabta", JSON.stringify(a)); } catch { /* incognito */ }
  }, [a]);

  const bars = computeBars(a);
  const score = computeScore(bars);
  const stage = growthStage(score);
  const ctx = () => buildContext(a, SEGMENTS, score);

  const refreshInsights = async (stepId) => {
    setLoading(true);
    try {
      const lines = await getInsights(ctx(), STEPS.find((s) => s.id === stepId)?.name);
      setInsights(lines.length ? lines : FALLBACK_INSIGHTS[stepId]);
    } catch {
      setInsights(FALLBACK_INSIGHTS[stepId]);
    }
    setLoading(false);
  };

  const handleAsk = async (q) => {
    setLoading(true);
    try {
      setInsights([await askCoach(ctx(), q)]);
    } catch {
      setInsights(FALLBACK_INSIGHTS[STEPS[step].id]);
    }
    setLoading(false);
  };

  const handleFinal = async () => {
    setLoading(true);
    setReport("…");
    try {
      setReport(await getFinalReport(ctx()));
    } catch {
      setReport(fallbackReport(score));
    }
    setLoading(false);
  };

  /* رؤى تلقائية مع debounce عند تغيّر الخطوة أو الاختيارات المهمة */
  useEffect(() => {
    if (report) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => refreshInsights(STEPS[step].id), 1200);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, a.segment, a.proto, a.model]);

  const next = () => (step < STEPS.length - 1 ? setStep(step + 1) : handleFinal());
  const restart = () => { setReport(null); setStep(0); setA({}); try { localStorage.removeItem("nabta"); } catch { /* */ } };

  /* أنماط مشتركة */
  const inputStyle = {
    width: "100%", padding: "11px 14px", fontSize: 14,
    border: `1.5px solid ${C.mist}`, borderRadius: 12, outline: "none",
    color: C.ink, background: C.white, fontFamily: "inherit",
    transition: "border-color .2s, box-shadow .2s", boxSizing: "border-box",
  };
  const focus = (e) => { e.target.style.borderColor = C.teal; e.target.style.boxShadow = `0 0 0 3px ${C.tealSoft}`; };
  const blur = (e) => { e.target.style.borderColor = C.mist; e.target.style.boxShadow = "none"; };

  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: `linear-gradient(165deg, ${C.white} 0%, ${C.mintSoft} 55%, ${C.tealSoft} 100%)`, fontFamily: "'Segoe UI', Tahoma, -apple-system, sans-serif", padding: "24px 16px", boxSizing: "border-box" }}>
      <style>{`
        @media (min-width: 880px) { .nabta-grid { grid-template-columns: 330px minmax(0,1fr) !important; } }
        @keyframes nabtaIn { from { opacity:0; transform: translateY(6px);} to { opacity:1; transform:none;} }
        @keyframes nabtaPulse { 0%,100%{opacity:1} 50%{opacity:.35} }
      `}</style>
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <Header />
        <StepsNav step={step} onJump={setStep} />

        <div className="nabta-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 18 }}>
          <aside style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
            <ScoreCard score={score} bars={bars} stage={stage} />
            <AICoach insights={insights} loading={loading} onAsk={handleAsk} inputStyle={inputStyle} focus={focus} blur={blur} />
          </aside>

          <main style={{ background: C.white, borderRadius: 20, boxShadow: "0 4px 20px rgba(31,111,95,.07)", overflow: "hidden", display: "flex", flexDirection: "column", minWidth: 0 }}>
            <div style={{ padding: "15px 22px", borderBottom: `1px solid ${C.mist}`, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: C.deep }}>
                  {report ? "تقرير نبتة النهائي" : `${STEPS[step].name} — الخطوة ${step + 1} من ${STEPS.length}`}
                </div>
                <div style={{ fontSize: 11.5, color: C.sub, marginTop: 2 }}>
                  {report ? "تقييم شامل لفكرتك بناءً على إجاباتك" : "أجب بتفاصيل وأرقام لترتفع درجة نمو فكرتك"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                {STEPS.map((_, i) => (
                  <span key={i} style={{ width: i === step ? 18 : 7, height: 7, borderRadius: 99, background: i < step ? C.mint : i === step ? C.deep : C.mist, transition: "all .3s" }} />
                ))}
              </div>
            </div>

            <div key={report ? "r" : step} style={{ padding: 22, flex: 1, animation: "nabtaIn .3s ease" }}>
              {report ? (
                <div style={{ fontSize: 13.5, lineHeight: 2, color: C.ink, whiteSpace: "pre-wrap", background: C.mintSoft + "66", border: `1.5px solid ${C.mint}`, borderRadius: 16, padding: "18px 20px" }}>
                  {report === "…" ? "جارٍ إنشاء التقرير…" : report}
                </div>
              ) : (
                <StepForm stepId={STEPS[step].id} a={a} set={set} inputStyle={inputStyle} focus={focus} blur={blur} />
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 22px", borderTop: `1px solid ${C.mist}`, background: C.mintSoft + "44", flexWrap: "wrap", gap: 10 }}>
              {report ? (
                <button onClick={restart} style={{ padding: "11px 26px", borderRadius: 12, border: "none", background: C.deep, color: C.white, fontSize: 13.5, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 6px 16px ${C.teal}44` }}>
                  ابدأ من جديد 🌱
                </button>
              ) : (
                <>
                  <button onClick={next} style={{ padding: "11px 26px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${C.teal}, ${C.deep})`, color: C.white, fontSize: 13.5, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 6px 16px ${C.teal}44` }}>
                    {step === STEPS.length - 1 ? "✦ التقييم النهائي" : "التالي ←"}
                  </button>
                  <button onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0} style={{ padding: "11px 22px", borderRadius: 12, border: `1.5px solid ${C.mist}`, background: C.white, color: step === 0 ? C.faint : C.sub, fontSize: 13, fontWeight: 700, cursor: step === 0 ? "default" : "pointer", fontFamily: "inherit", opacity: step === 0 ? 0.55 : 1 }}>
                    → السابق
                  </button>
                </>
              )}
            </div>
          </main>
        </div>

        <footer style={{ textAlign: "center", marginTop: 22, fontSize: 11, color: C.faint }}>
          نبتة 🌱 — منصة التحقق من الأفكار الريادية · صُممت بحب لرواد الأعمال العرب
        </footer>
      </div>
    </div>
  );
}
