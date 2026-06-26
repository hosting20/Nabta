import { STEPS } from '../data/steps.js';

/* احتساب نسبة اكتمال خطوة واحدة بناءً على طول الإجابات */
export function stepCompletion(answers, idx) {
  const step = STEPS[idx];
  let tot = 0;
  step.fields.forEach((f) => {
    const v = (answers[f.id] || '').trim();
    tot += v.length === 0 ? 0 : v.length < 10 ? 0.5 : v.length < 35 ? 0.82 : 1;
  });
  return tot / step.fields.length;
}

/* الدرجة الإجمالية من 100 */
export function overallScore(answers) {
  let s = 0;
  for (let i = 0; i < STEPS.length; i++) s += stepCompletion(answers, i);
  return Math.round((s / STEPS.length) * 100);
}

/* مرحلة نمو الفكرة حسب الدرجة */
export function stageFor(sc) {
  if (sc < 25) return { emoji: '🌰', label: 'بذرة' };
  if (sc < 55) return { emoji: '🌱', label: 'نبتة تنمو' };
  if (sc < 82) return { emoji: '🌿', label: 'نبتة مزهرة' };
  return { emoji: '🌳', label: 'شجرة مُثمرة' };
}
