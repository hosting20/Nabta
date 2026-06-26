import Swot from './Swot.jsx';

const card = { background: '#fff', border: '1px solid var(--line)', borderRadius: 20, padding: 24 };
const h3 = { margin: '0 0 16px', fontWeight: 700, fontSize: 17, color: 'var(--ink)', textAlign: 'right' };

export default function Report({ report, onDownload, onOpenDash, onEdit }) {
  const r = report;
  const marketCards = [
    { key: 'TAM', value: r.marketSize.tam },
    { key: 'SAM', value: r.marketSize.sam },
    { key: 'SOM', value: r.marketSize.som },
  ];

  return (
    <div className="nb-report" style={{ maxWidth: 1080, margin: '0 auto', padding: '30px 28px 64px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
        <div className="nb-noprint" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={onDownload} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--g700)', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 12, padding: '12px 20px' }}>
            ⬇ تنزيل التقرير PDF
          </button>
          <button onClick={onOpenDash} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: 'var(--g700)', fontWeight: 700, fontSize: 14, border: '1.5px solid var(--g100)', borderRadius: 12, padding: '12px 20px' }}>
            ↗ لوحة المتابعة
          </button>
          <button onClick={onEdit} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: 'var(--soft)', fontWeight: 600, fontSize: 14, border: '1.5px solid var(--line)', borderRadius: 12, padding: '12px 20px' }}>
            ↺ تعديل الإجابات
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexDirection: 'row-reverse' }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: 'linear-gradient(150deg,var(--g500),var(--g700))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🌱</div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--ink)' }}>تقرير نبتة</div>
            <div style={{ fontSize: 12, color: 'var(--soft)' }}>تحليل جدوى الفكرة بالذكاء الاصطناعي</div>
          </div>
        </div>
      </div>

      {/* الحكم العام */}
      <div style={{ background: 'linear-gradient(135deg,var(--g700),var(--g900))', color: '#eafaef', borderRadius: 24, padding: '30px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 26, margin: '14px 0 22px' }}>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 60, lineHeight: 1 }}>{r.score}</div>
          <div style={{ fontSize: 13, opacity: 0.8 }}>درجة النضج / ١٠٠</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 6 }}>الحكم العام</div>
          <div style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 24, lineHeight: 1.5 }}>{r.verdict}</div>
        </div>
      </div>

      {/* السوق والإيرادات */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20, marginBottom: 20 }}>
        <div style={card}>
          <h3 style={h3}>📊 حجم السوق</h3>
          <div style={{ display: 'flex', gap: 12 }}>
            {marketCards.map((c) => (
              <div key={c.key} style={{ flex: 1, background: 'var(--g50)', borderRadius: 14, padding: '16px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--g600)', fontWeight: 700, marginBottom: 6 }}>{c.key}</div>
                <div style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 19, color: 'var(--g700)' }}>{c.value}</div>
              </div>
            ))}
          </div>
          <p style={{ margin: '16px 0 0', fontSize: 13.5, lineHeight: 1.7, color: 'var(--soft)', textAlign: 'right' }}>{r.marketSize.note}</p>
        </div>
        <div style={card}>
          <h3 style={h3}>💰 نموذج الإيرادات</h3>
          <div style={{ textAlign: 'right', fontSize: 14, color: 'var(--ink)', lineHeight: 1.9 }}>
            <div><span style={{ color: 'var(--soft)' }}>النموذج: </span><b>{r.revenue.model}</b></div>
            <div><span style={{ color: 'var(--soft)' }}>متوسط الإيراد: </span><b>{r.revenue.arpu}</b></div>
          </div>
          <p style={{ margin: '14px 0 0', fontSize: 13.5, lineHeight: 1.7, color: 'var(--soft)', textAlign: 'right' }}>{r.revenue.note}</p>
        </div>
      </div>

      {/* SWOT */}
      <div style={{ ...card, marginBottom: 20 }}>
        <h3 style={{ ...h3, margin: '0 0 18px' }}>🧭 تحليل SWOT</h3>
        <Swot swot={r.swot} />
      </div>

      {/* المنافسون وخطة البدء */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={card}>
          <h3 style={h3}>⚔ المنافسون</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(r.competitors || []).map((c, i) => (
              <div key={i} style={{ border: '1px solid var(--line)', borderRadius: 13, padding: '13px 15px', textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--ink)' }}>{c.name}</div>
                <div style={{ fontSize: 13, color: 'var(--soft)', marginTop: 4, lineHeight: 1.6 }}>{c.note}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={card}>
          <h3 style={h3}>🚀 خطة البدء</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {(r.nextSteps || []).map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', flexDirection: 'row-reverse', textAlign: 'right' }}>
                <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 8, background: 'var(--g700)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                <span style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--ink)' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
