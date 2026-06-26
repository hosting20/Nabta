/* تبويب الخطة الزمنية — مخطط Gantt مبسّط مبني من المهام */
export default function Gantt({ tasks, onToggleTask }) {
  // توزيع المهام على أسابيع متتالية حسب الفئة
  let cursor = 0;
  const rows = tasks.map((t) => {
    const len = t.cat === 'النمو' ? 3 : 2;
    const start = cursor;
    cursor += len;
    return { ...t, start, len };
  });
  const totalWeeks = Math.max(cursor, 1);
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  const colorFor = (cat) => (cat === 'النمو' ? 'linear-gradient(90deg,#5fbf86,var(--g700))' : 'linear-gradient(90deg,#7fcf9c,var(--g500))');

  if (!rows.length) {
    return <div style={{ textAlign: 'center', color: 'var(--soft)', padding: 40 }}>لا توجد مهام لبناء الخطة الزمنية بعد.</div>;
  }

  return (
    <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 20, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--soft)' }}>
            <span style={{ width: 14, height: 9, borderRadius: 3, background: 'linear-gradient(90deg,#7fcf9c,var(--g500))', display: 'inline-block' }} /> التحقق
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--soft)' }}>
            <span style={{ width: 14, height: 9, borderRadius: 3, background: 'linear-gradient(90deg,#5fbf86,var(--g700))', display: 'inline-block' }} /> النمو
          </span>
        </div>
        <h3 style={{ margin: 0, fontWeight: 700, fontSize: 16, color: 'var(--ink)', textAlign: 'right' }}>🗓️ الخطة الزمنية ({totalWeeks} أسبوعاً)</h3>
      </div>

      {/* رأس الأسابيع */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div style={{ minWidth: 150, flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row-reverse' }}>
          {weeks.map((w) => (
            <div key={w} style={{ flex: 1, textAlign: 'center', fontSize: 11, color: 'var(--soft)', fontWeight: 600 }}>{w}</div>
          ))}
        </div>
      </div>

      {/* صفوف المهام */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {rows.map((t) => {
          const rightPct = (t.start / totalWeeks) * 100;
          const widthPct = (t.len / totalWeeks) * 100;
          return (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                onClick={() => onToggleTask && onToggleTask(t.id)}
                title={t.text}
                style={{ minWidth: 150, maxWidth: 150, flexShrink: 0, fontSize: 12.5, color: 'var(--ink)', textAlign: 'right', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textDecoration: t.done ? 'line-through' : 'none', opacity: t.done ? 0.55 : 1 }}
              >
                {t.text}
              </div>
              <div style={{ flex: 1, position: 'relative', height: 26, background: 'var(--g50)', borderRadius: 8 }}>
                <div
                  onClick={() => onToggleTask && onToggleTask(t.id)}
                  style={{
                    position: 'absolute',
                    top: 3,
                    bottom: 3,
                    right: rightPct + '%',
                    width: widthPct + '%',
                    background: colorFor(t.cat),
                    borderRadius: 7,
                    cursor: 'pointer',
                    opacity: t.done ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                    boxShadow: '0 4px 10px -5px rgba(35,107,68,.6)',
                    transition: 'opacity .25s',
                  }}
                >
                  {t.done ? '✓' : t.len + 'أ'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
