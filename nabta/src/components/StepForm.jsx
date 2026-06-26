import { C, SEGMENTS } from "../data/constants.js";

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: C.deep, marginBottom: 7 }}>{label}</label>
    {children}
  </div>
);

const ChoiceBtn = ({ active, onClick, children, style = {} }) => (
  <button
    onClick={onClick}
    style={{
      padding: "11px 12px", borderRadius: 12,
      border: `1.5px solid ${active ? C.teal : C.mist}`,
      background: active ? C.tealSoft : C.white,
      color: active ? C.deep : C.sub,
      fontWeight: active ? 700 : 500, fontSize: 13,
      cursor: "pointer", transition: "all .18s",
      fontFamily: "inherit", textAlign: "center", ...style,
    }}
  >
    {children}
  </button>
);

const grid = (min = 130) => ({ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`, gap: 10 });

export function StepForm({ stepId, a, set, inputStyle, focus, blur }) {
  const ta = (key, placeholder, idealRows = 3) => (
    <textarea rows={idealRows} style={{ ...inputStyle, resize: "vertical" }} placeholder={placeholder} value={a[key] || ""} onFocus={focus} onBlur={blur} onChange={(e) => set(key, e.target.value)} />
  );
  const inp = (key, placeholder, type = "text") => (
    <input type={type} style={inputStyle} placeholder={placeholder} value={a[key] || ""} onFocus={focus} onBlur={blur} onChange={(e) => set(key, e.target.value)} />
  );

  if (stepId === "problem")
    return (
      <>
        <Field label="ما المشكلة التي تحلها؟">{ta("problem", "مثال: رواد الأعمال يضيعون ٥ ساعات أسبوعياً في البحث اليدوي عن بيانات السوق…")}</Field>
        <Field label="من يعاني من هذه المشكلة؟">{inp("who", "مثال: رواد الأعمال الناشئون في مرحلة التأسيس بالسعودية")}</Field>
        <Field label="لماذا لا تُحلّ الآن؟">{inp("why", "مثال: الأدوات الموجودة معقدة ومكلفة وبالإنجليزية فقط")}</Field>
      </>
    );

  if (stepId === "market")
    return (
      <>
        <Field label="من هو عميلك الرئيسي؟">
          <div style={grid(150)}>
            {SEGMENTS.map((s) => (
              <ChoiceBtn key={s.v} active={a.segment === s.v} onClick={() => set("segment", s.v)} style={{ textAlign: "right", padding: "13px 14px" }}>
                <div style={{ fontSize: 13.5 }}>{s.label}</div>
                <div style={{ fontSize: 11, opacity: 0.65, marginTop: 3, fontWeight: 400 }}>{s.d}</div>
              </ChoiceBtn>
            ))}
          </div>
        </Field>
        <Field label="حجم السوق المستهدف (TAM)">{inp("tam", "مثال: ٢ مليون رائد أعمال في الشرق الأوسط بإنفاق ٥٠$ شهرياً")}</Field>
      </>
    );

  if (stepId === "solution")
    return (
      <>
        <Field label="ما هو حلك؟">{ta("solution", "مثال: منصة SaaS بالعربية توجّه رائد الأعمال خطوة بخطوة بالذكاء الاصطناعي…")}</Field>
        <Field label="الميزة التنافسية (USP)">{inp("usp", "مثال: توجيه ذكي بالعربية مخصص لسوق الخليج")}</Field>
        <Field label="هل لديك نموذج أولي؟">
          <div style={grid()}>
            {["نموذج أولي جاهز", "فكرة فقط", "مستخدمون أوائل"].map((o) => (
              <ChoiceBtn key={o} active={a.proto === o} onClick={() => set("proto", o)}>{o}</ChoiceBtn>
            ))}
          </div>
        </Field>
      </>
    );

  if (stepId === "revenue")
    return (
      <>
        <Field label="نموذج الإيرادات">
          <div style={grid()}>
            {["اشتراك شهري", "دفع لكل استخدام", "Freemium", "عمولة"].map((o) => (
              <ChoiceBtn key={o} active={a.model === o} onClick={() => set("model", o)}>{o}</ChoiceBtn>
            ))}
          </div>
        </Field>
        <Field label="السعر المتوقع للخطة الأساسية ($)">{inp("price", "29", "number")}</Field>
        <Field label="الإيرادات المستهدفة للسنة الأولى ($)">{inp("arr", "50000", "number")}</Field>
      </>
    );

  // gtm
  return (
    <>
      <Field label="القنوات التسويقية الرئيسية">
        <div style={grid(140)}>
          {["وسائل التواصل", "المحتوى والـ SEO", "الشراكات", "المبيعات المباشرة", "إعلانات مدفوعة", "المجتمعات"].map((c) => {
            const on = (a.channels || []).includes(c);
            return (
              <ChoiceBtn key={c} active={on} onClick={() => set("channels", on ? a.channels.filter((x) => x !== c) : [...(a.channels || []), c])}>{c}</ChoiceBtn>
            );
          })}
        </div>
      </Field>
      <Field label="الجدول الزمني للإطلاق">{<input style={inputStyle} placeholder="مثال: نسخة تجريبية خلال ٣ أشهر، إطلاق عام بعد ٦" value={a.timeline || ""} onFocus={focus} onBlur={blur} onChange={(e) => set("timeline", e.target.value)} />}</Field>
      <div style={{ padding: "14px 16px", background: C.mintSoft, border: `1.5px solid ${C.mint}`, borderRadius: 14, textAlign: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: C.deep }}>🌳 وصلت لنهاية الرحلة!</div>
        <div style={{ fontSize: 12.5, color: C.sub, marginTop: 4 }}>اضغط «التقييم النهائي» لتحصل على تقرير شامل لفكرتك</div>
      </div>
    </>
  );
}
