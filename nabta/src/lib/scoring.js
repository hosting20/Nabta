/* ─────────────────────────────────────────────
   محرك تقييم نبتة v2 — تحليل جودة وليس وجوداً
   كل حقل نصي يُقيَّم على 4 محاور:
   1. الطول الكافي  2. التحديد (أرقام/أسماء)
   3. كلمات النوعية  4. تجنب العمومية
───────────────────────────────────────────── */

const SPECIFICITY_WORDS = [
  // كلمات تدل على تفكير محدد وليس عاماً
  "مثل", "مثال", "تحديداً", "خصوصاً", "شهرياً", "سنوياً", "يومياً",
  "ساعة", "ساعات", "دقيقة", "ريال", "دولار", "درهم", "دينار",
  "نسبة", "%", "$", "تكلفة", "يدوياً", "حالياً", "السعودية",
  "الخليج", "مصر", "الإمارات", "الشرق الأوسط", "عميل", "عملاء",
  "مقابلة", "استبيان", "بحث", "بيانات",
];

const VAGUE_WORDS = [
  // كلمات عامة تُخفّض الجودة إذا كانت وحدها
  "الجميع", "كل الناس", "أي شخص", "كثير", "أشياء", "stuff",
  "مشاكل عامة", "كل شيء",
];

/** يقيّم جودة نص من 0 إلى 1 */
export function textQuality(text, { minWords = 4, idealWords = 12 } = {}) {
  if (!text || !text.trim()) return 0;
  const t = text.trim();
  const words = t.split(/\s+/).filter(Boolean);

  // 1) درجة الطول (0 → 0.4): تتدرج حتى العدد المثالي للكلمات
  const lengthScore = Math.min(1, words.length / idealWords) * 0.4;
  if (words.length < minWords) return Math.min(0.25, lengthScore);

  // 2) التحديد الرقمي (0 → 0.2): وجود أرقام = تفكير كمي
  const hasNumbers = /[0-9٠-٩]/.test(t);
  const numberScore = hasNumbers ? 0.2 : 0;

  // 3) كلمات النوعية (0 → 0.25)
  const specHits = SPECIFICITY_WORDS.filter((w) => t.includes(w)).length;
  const specScore = Math.min(1, specHits / 2) * 0.25;

  // 4) عقوبة العمومية (حتى -0.15)
  const vagueHits = VAGUE_WORDS.filter((w) => t.includes(w)).length;
  const vaguePenalty = Math.min(0.15, vagueHits * 0.08);

  // 5) أساس الوجود (0.15): كتب شيئاً ذا معنى أصلاً
  return Math.max(0, Math.min(1, 0.15 + lengthScore + numberScore + specScore - vaguePenalty));
}

/** الأبعاد الأربعة — كل بُعد من 0 إلى 100 */
export function computeBars(a) {
  const q = textQuality;
  return [
    // ملاءمة المشكلة: الوصف 35 + من يعاني 30 + لماذا الآن 35
    Math.round(q(a.problem, { idealWords: 15 }) * 35 + q(a.who) * 30 + q(a.why, { idealWords: 10 }) * 35),

    // حجم السوق: الشريحة اختيار (40) + TAM نص يُقيَّم بالجودة (60)
    Math.round((a.segment ? 40 : 0) + q(a.tam, { idealWords: 8 }) * 60),

    // وضوح الحل: الوصف 40 + الميزة 35 + النموذج الأولي 25 (مرجّح بمستوى التقدم)
    Math.round(
      q(a.solution, { idealWords: 15 }) * 40 +
        q(a.usp, { idealWords: 8 }) * 35 +
        (a.proto === "مستخدمون أوائل" ? 25 : a.proto === "نموذج أولي جاهز" ? 20 : a.proto === "فكرة فقط" ? 8 : 0)
    ),

    // الإيرادات: النموذج 40 + سعر منطقي 30 + هدف سنوي منطقي 30
    Math.round(
      (a.model ? 40 : 0) +
        (a.price > 0 ? (a.price >= 5 ? 30 : 15) : 0) +
        (a.arr > 0 ? (a.arr >= 1000 ? 30 : 15) : 0)
    ),
  ].map((v) => Math.min(100, v));
}

/** الدرجة الكلية الموزونة */
export function computeScore(bars) {
  return Math.round(bars[0] * 0.3 + bars[1] * 0.25 + bars[2] * 0.25 + bars[3] * 0.2);
}

/** مرحلة النمو */
export function growthStage(score) {
  if (score >= 70) return { label: "شجرة مثمرة", emoji: "🌳", tone: "strong" };
  if (score >= 40) return { label: "نبتة تنمو", emoji: "🌿", tone: "medium" };
  return { label: "بذرة", emoji: "🌱", tone: "seed" };
}

export const BAR_LABELS = ["ملاءمة المشكلة", "حجم السوق", "وضوح الحل", "نموذج الإيرادات"];
