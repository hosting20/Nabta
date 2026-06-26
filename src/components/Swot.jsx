/* مصفوفة تحليل SWOT */
export default function Swot({ swot }) {
  const meta = [
    { title: 'القوة', items: swot.strengths, color: '#236b44', bg: '#eef7f0' },
    { title: 'الضعف', items: swot.weaknesses, color: '#b06a1f', bg: '#fbf3e8' },
    { title: 'الفرص', items: swot.opportunities, color: '#2f6db0', bg: '#eef3fb' },
    { title: 'التهديدات', items: swot.threats, color: '#b03f3f', bg: '#fbeeee' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      {meta.map((q) => (
        <div key={q.title} style={{ background: q.bg, borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: q.color, marginBottom: 10, textAlign: 'right' }}>{q.title}</div>
          <ul style={{ margin: 0, padding: '0 18px 0 0', listStyle: 'none' }}>
            {(q.items || []).map((it, i) => (
              <li key={i} style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--ink)', textAlign: 'right', marginBottom: 6 }}>
                {it}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
