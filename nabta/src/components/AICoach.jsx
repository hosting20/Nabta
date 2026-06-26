import { useState } from "react";
import { C } from "../data/constants.js";

export function AICoach({ insights, loading, onAsk, inputStyle, focus, blur }) {
  const [q, setQ] = useState("");
  const send = () => {
    if (!q.trim() || loading) return;
    onAsk(q.trim());
    setQ("");
  };
  return (
    <section style={{ background: C.white, borderRadius: 20, boxShadow: "0 4px 20px rgba(31,111,95,.07)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "13px 18px", borderBottom: `1px solid ${C.mist}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 10, background: `linear-gradient(135deg, ${C.teal}, ${C.deep})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: C.white }}>✦</div>
        <span style={{ fontSize: 13.5, fontWeight: 800, color: C.deep, flex: 1 }}>مرشد نبتة الذكي</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10.5, color: C.sub }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: loading ? C.amber : C.mint, animation: "nabtaPulse 2s infinite" }} />
          {loading ? "يفكر…" : "جاهز"}
        </span>
      </div>
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 9, minHeight: 110 }}>
        {loading && !insights ? (
          <div style={{ fontSize: 12.5, color: C.faint }}>المرشد يحلل بياناتك…</div>
        ) : (
          (insights || []).map((line, i) => (
            <div key={i} style={{ fontSize: 12.5, lineHeight: 1.8, color: i === 0 ? C.deep : C.sub, padding: "10px 13px", borderRadius: 12, background: i === 0 ? C.mintSoft : C.mist + "66", borderRight: `3px solid ${i === 0 ? C.mint : "transparent"}`, animation: "nabtaIn .35s ease both", animationDelay: `${i * 0.1}s` }}>
              {line}
            </div>
          ))
        )}
      </div>
      <div style={{ display: "flex", gap: 8, padding: "10px 14px", borderTop: `1px solid ${C.mist}`, background: C.mintSoft + "55" }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="اسأل المرشد عن فكرتك…" style={{ ...inputStyle, padding: "8px 12px", fontSize: 12.5, borderRadius: 10 }} onFocus={focus} onBlur={blur} />
        <button onClick={send} disabled={loading} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: C.deep, color: C.white, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: loading ? 0.5 : 1, whiteSpace: "nowrap" }}>إرسال</button>
      </div>
    </section>
  );
}
