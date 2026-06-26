import { useState } from 'react';

/* احتساب 12 شهراً من الإيرادات والتكاليف */
function project(f) {
  const months = [];
  for (let m = 1; m <= 12; m++) {
    const customers = Math.round(f.customers * Math.pow(1 + f.growth / 100, m - 1));
    const revenue = customers * f.price;
    const variable = customers * f.varCost;
    const cost = f.fixedCost + variable;
    months.push({ m, customers, revenue, cost, profit: revenue - cost });
  }
  return months;
}

function fmt(n) {
  if (Math.abs(n) >= 1000000) return (n / 1000000).toFixed(1) + 'م';
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(1) + 'ك';
  return String(Math.round(n));
}

/* مبلغ بالريال السعودي */
function money(n) {
  return fmt(n) + ' ر.س';
}

const sliders = [
  { id: 'customers', label: 'العملاء البدئيون', min: 1, max: 500, step: 1, suffix: '' },
  { id: 'growth', label: 'النمو الشهري', min: 0, max: 50, step: 1, suffix: '%' },
  { id: 'price', label: 'السعر / عميل', min: 0, max: 1000, step: 5, money: true },
  { id: 'varCost', label: 'تكلفة العميل', min: 0, max: 500, step: 5, money: true },
  { id: 'fixedCost', label: 'تكاليف ثابتة شهرية', min: 0, max: 50000, step: 500, money: true },
];

/* تبويب المالية — مدخلات تفاعلية + رسوم إيرادات/تكاليف */
export default function Finance({ finance, onChange }) {
  const [hover, setHover] = useState(null);
  const data = project(finance);

  const totalRev = data.reduce((s, d) => s + d.revenue, 0);
  const totalCost = data.reduce((s, d) => s + d.cost, 0);
  const netProfit = totalRev - totalCost;
  let breakEven = 0;
  let cum = 0;
  for (const d of data) {
    cum += d.profit;
    if (cum >= 0) { breakEven = d.m; break; }
  }

  const maxVal = Math.max(...data.map((d) => Math.max(d.revenue, d.cost)), 1);

  // أبعاد الرسم
  const W = 560, H = 220, padB = 26, padT = 10;
  const chartH = H - padB - padT;
  const colW = W / data.length;

  // خط الربح التراكمي
  let run = 0;
  const cumPts = data.map((d, i) => {
    run += d.profit;
    return { x: i * colW + colW / 2, v: run };
  });
  const cumMax = Math.max(...cumPts.map((p) => Math.abs(p.v)), 1);
  const zeroY = padT + chartH / 2;
  const linePts = cumPts.map((p) => p.x + ',' + (zeroY - (p.v / cumMax) * (chartH / 2))).join(' ');

  const kpiCard = (label, value, color, sub) => (
    <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 16, padding: 16, textAlign: 'right' }}>
      <div style={{ fontSize: 12, color: 'var(--soft)', marginBottom: 7 }}>{label}</div>
      <div style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 19, color }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: 'var(--soft)', marginTop: 4 }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* مؤشرات */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {kpiCard('إجمالي الإيرادات (12ش)', money(totalRev), 'var(--g700)')}
        {kpiCard('إجمالي التكاليف (12ش)', money(totalCost), '#b06a1f')}
        {kpiCard('صافي الربح (12ش)', money(netProfit), netProfit >= 0 ? 'var(--g600)' : '#b03f3f')}
        {kpiCard('نقطة التعادل', breakEven ? 'الشهر ' + breakEven : 'لم تتحقق', breakEven ? 'var(--g700)' : '#b03f3f', 'تراكمياً')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 20, alignItems: 'start' }}>
        {/* المدخلات التفاعلية */}
        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 20, padding: 22 }}>
          <h3 style={{ margin: '0 0 16px', fontWeight: 700, fontSize: 16, color: 'var(--ink)', textAlign: 'right' }}>افتراضات الجدوى</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {sliders.map((s) => (
              <div key={s.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--g700)' }}>
                    {s.money ? money(finance[s.id]) : fmt(finance[s.id]) + (s.suffix || '')}
                  </span>
                  <span style={{ fontSize: 12.5, color: 'var(--soft)' }}>{s.label}</span>
                </div>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={finance[s.id]}
                  onChange={(e) => onChange(s.id, Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--g600)', direction: 'ltr' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* الرسوم */}
        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 20, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 14 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--soft)' }}><span style={{ width: 11, height: 11, borderRadius: 3, background: 'var(--g600)' }} /> إيرادات</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--soft)' }}><span style={{ width: 11, height: 11, borderRadius: 3, background: '#e0a96d' }} /> تكاليف</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--soft)' }}><span style={{ width: 11, height: 3, background: 'var(--g900)' }} /> ربح تراكمي</span>
            </div>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 16, color: 'var(--ink)', textAlign: 'right' }}>📈 الإيرادات مقابل التكاليف</h3>
          </div>

          <div style={{ position: 'relative' }}>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
              {/* أعمدة */}
              {data.map((d, i) => {
                const x = i * colW;
                const rH = (d.revenue / maxVal) * chartH;
                const cH = (d.cost / maxVal) * chartH;
                const bw = colW * 0.3;
                return (
                  <g key={i} onMouseEnter={() => setHover(d)} onMouseLeave={() => setHover(null)}>
                    <rect x={x + colW / 2 - bw - 2} y={padT + chartH - rH} width={bw} height={rH} rx="3" fill="var(--g600)" />
                    <rect x={x + colW / 2 + 2} y={padT + chartH - cH} width={bw} height={cH} rx="3" fill="#e0a96d" />
                    <rect x={x} y={padT} width={colW} height={chartH} fill="transparent" />
                    <text x={x + colW / 2} y={H - 9} textAnchor="middle" fontSize="9" fill="var(--soft)">{d.m}</text>
                  </g>
                );
              })}
              {/* خط الربح التراكمي */}
              <polyline points={linePts} fill="none" stroke="var(--g900)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {cumPts.map((p, i) => (
                <circle key={i} cx={p.x} cy={zeroY - (p.v / cumMax) * (chartH / 2)} r="2.5" fill="var(--g900)" />
              ))}
            </svg>

            {hover && (
              <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--ink)', color: '#fff', borderRadius: 10, padding: '8px 12px', fontSize: 12, lineHeight: 1.6, pointerEvents: 'none', boxShadow: '0 8px 20px -8px rgba(0,0,0,.4)' }}>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>الشهر {hover.m}</div>
                <div>عملاء: {fmt(hover.customers)}</div>
                <div>إيراد: {money(hover.revenue)}</div>
                <div>تكلفة: {money(hover.cost)}</div>
                <div style={{ color: hover.profit >= 0 ? '#8fe0aa' : '#f0a0a0' }}>ربح: {money(hover.profit)}</div>
              </div>
            )}
          </div>
          <p style={{ margin: '12px 0 0', fontSize: 12, color: 'var(--soft)', textAlign: 'right' }}>مرّر فوق الأعمدة لعرض تفاصيل كل شهر — حرّك المؤشرات لمحاكاة سيناريوهات مختلفة.</p>
        </div>
      </div>
    </div>
  );
}
