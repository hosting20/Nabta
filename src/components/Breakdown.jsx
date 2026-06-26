import { stepCompletion } from '../utils/scoring.js';

const LABELS = ['ملاءمة المشكلة', 'حجم السوق', 'وضوح الحل', 'نموذج الإيرادات'];

/* تفصيل الدرجة عبر المحاور الأربعة الأولى */
export default function Breakdown({ answers }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginTop: 6 }}>
      {LABELS.map((l, i) => {
        const v = Math.round(stepCompletion(answers, i) * 100);
        return (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--ink)', minWidth: 96, textAlign: 'right' }}>{l}</span>
            <div style={{ flex: 1, height: 7, borderRadius: 7, background: 'var(--g100)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: v + '%',
                  background: 'linear-gradient(90deg,#5fbf86,var(--g600))',
                  borderRadius: 7,
                  transition: 'width .5s ease',
                }}
              />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--g700)', minWidth: 26 }}>{v}</span>
          </div>
        );
      })}
    </div>
  );
}
