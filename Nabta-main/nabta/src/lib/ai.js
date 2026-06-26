/* ─────────────────────────────────────────────
   طبقة الذكاء الاصطناعي — Claude API + Fallback
   داخل claude.ai المفتاح يُحقن تلقائياً.
   خارجها: ضع VITE_ANTHROPIC_API_KEY في .env
───────────────────────────────────────────── */

const API_KEY = import.meta.env?.VITE_ANTHROPIC_API_KEY;

export async function callClaude(prompt, maxTokens = 700) {
  const headers = { "Content-Type": "application/json" };
  if (API_KEY) {
    headers["x-api-key"] = API_KEY;
    headers["anthropic-version"] = "2023-06-01";
    // يسمح بالاستدعاء المباشر من المتصفح (للتجربة فقط — استخدم proxy في الإنتاج)
    headers["anthropic-dangerous-direct-browser-access"] = "true";
  }
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const d = await res.json();
  return d.content?.find((b) => b.type === "text")?.text || "";
}

export function buildContext(a, segments, score) {
  const seg = segments.find((s) => s.v === a.segment)?.label || "—";
  return [
    `المشكلة: ${a.problem || "—"}`,
    `من يعاني: ${a.who || "—"}`,
    `لماذا لم تُحل: ${a.why || "—"}`,
    `الشريحة: ${seg}`,
    `حجم السوق: ${a.tam || "—"}`,
    `الحل: ${a.solution || "—"}`,
    `الميزة التنافسية: ${a.usp || "—"}`,
    `النموذج الأولي: ${a.proto || "—"}`,
    `نموذج الإيرادات: ${a.model || "—"}`,
    `السعر: ${a.price ? a.price + "$" : "—"}`,
    `هدف السنة الأولى: ${a.arr ? a.arr + "$" : "—"}`,
    `القنوات: ${(a.channels || []).join("، ") || "—"}`,
    `درجة النمو الحالية: ${score}/100`,
  ].join("\n");
}

export async function getInsights(ctx, stepName) {
  const text = await callClaude(
    `أنت مستشار ريادة أعمال خبير في منصة «نبتة».\nبيانات المشروع:\n${ctx}\n\nقدّم 3 رؤى عملية مختصرة للخطوة «${stepName}». اكتب بالعربية فقط، كل رؤية في سطر يبدأ بـ "•"، لا تتجاوز كل رؤية جملتين، واربطها ببيانات المشروع الفعلية إن وُجدت.`,
    500
  );
  return text
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => l.replace(/^[•\-\*]\s*/, ""))
    .slice(0, 3);
}

export async function askCoach(ctx, question) {
  return callClaude(
    `أنت مستشار ريادة أعمال في منصة «نبتة».\nبيانات المشروع:\n${ctx}\n\nسؤال رائد الأعمال: ${question}\n\nأجب بالعربية بشكل مباشر وعملي في 3-5 جمل.`,
    500
  );
}

export async function getFinalReport(ctx) {
  return callClaude(
    `أنت مستشار ريادة أعمال في منصة «نبتة». قيّم هذا المشروع:\n${ctx}\n\nاكتب تقريراً بالعربية: ملخص تنفيذي (جملتان)، ثم "نقاط القوة" (3)، ثم "مخاطر يجب معالجتها" (3)، ثم "الخطوات التالية" (3)، ثم "الحكم النهائي" (قابل للتنفيذ / قابل مع تحفظات / يحتاج مراجعة). لا تتجاوز 250 كلمة، بدون رموز markdown.`,
    900
  );
}

/** تقرير احتياطي ديناميكي حسب الدرجة */
export function fallbackReport(score) {
  const verdict =
    score >= 70
      ? "قابلة للتنفيذ — انتقل لاختبار السوق فوراً."
      : score >= 50
      ? "قابلة للتنفيذ مع تحفظات — عالج المخاطر أولاً."
      : "تحتاج مراجعة جوهرية قبل الاستثمار فيها.";
  const summary =
    score >= 70
      ? "أساس قوي وإجابات محددة — فكرتك جاهزة للاختبار الفعلي."
      : score >= 40
      ? "الاتجاه صحيح لكن بعض الأبعاد تحتاج تعميقاً وأرقاماً أدق."
      : "الفكرة ما زالت بذرة — أكمل الإجابات بتفاصيل وأمثلة وأرقام.";
  return `الملخص التنفيذي
حصلت فكرتك على ${score}/100. ${summary}

نقاط القوة
• وعي مبكر بأهمية تعريف المشكلة قبل بناء الحل.
• اختيار شريحة مستهدفة بدل مخاطبة الجميع.
• التفكير في نموذج الإيرادات منذ البداية.

مخاطر يجب معالجتها
• لم يتم التحقق من الطلب مع عملاء حقيقيين بعد.
• الميزة التنافسية تحتاج صياغة يصعب على المنافسين تقليدها.
• الأرقام المالية تقديرية وتحتاج اختباراً واقعياً.

الخطوات التالية
• أجرِ 10 مقابلات مع عملاء محتملين خلال أسبوعين.
• ابنِ نموذجاً أولياً مبسطاً واعرضه عليهم.
• قس تكلفة اكتساب العميل مقابل قيمته قبل أي إنفاق تسويقي.

الحكم النهائي
${verdict}`;
}
