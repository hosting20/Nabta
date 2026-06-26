import { DEFAULT_TIPS } from '../data/steps.js';

/* مرشد نبتة الذكي — نصائح ثابتة + نصائح AI */
export default function MentorTips({ stepIndex, aiTips, tipLoading, onAsk }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 22, padding: 20, boxShadow: '0 10px 30px -22px rgba(20,63,42,.35)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--g600)', fontWeight: 600 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3fb06c', display: 'inline-block' }} />
          {tipLoading ? 'يكتب…' : 'جاهز'}
        </span>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 9, fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>
          مرشد نبتة الذكي
          <span style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--g700)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✦</span>
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        <div style={{ background: 'var(--g50)', border: '1px solid var(--g100)', borderRadius: 13, padding: '13px 15px', fontSize: 13.5, lineHeight: 1.7, color: 'var(--ink)', textAlign: 'right' }}>
          {DEFAULT_TIPS[Math.min(stepIndex, DEFAULT_TIPS.length - 1)]}
        </div>
        {stepIndex > 0 && (
          <div style={{ background: '#f6f8f7', borderRadius: 13, padding: '13px 15px', fontSize: 13.5, lineHeight: 1.7, color: 'var(--soft)', textAlign: 'right' }}>
            {DEFAULT_TIPS[stepIndex]}
          </div>
        )}
        {aiTips.map((t, i) => (
          <div
            key={i}
            style={{ background: '#fff', border: '1.5px solid var(--g500)', borderRadius: 13, padding: '13px 15px', fontSize: 13.5, lineHeight: 1.8, color: 'var(--g700)', textAlign: 'right', animation: 'nb-rise .4s ease both' }}
          >
            ✦ {t}
          </div>
        ))}
      </div>

      <button
        onClick={onAsk}
        style={{
          marginTop: 15,
          width: '100%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          background: 'var(--g50)',
          color: 'var(--g700)',
          fontWeight: 700,
          fontSize: 14,
          border: '1.5px solid var(--g100)',
          borderRadius: 12,
          padding: 12,
          opacity: tipLoading ? 0.7 : 1,
        }}
      >
        {tipLoading ? '… المرشد يفكّر' : 'اطلب نصيحة من المرشد ✦'}
      </button>
    </div>
  );
}
