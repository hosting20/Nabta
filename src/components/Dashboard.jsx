import { stageFor } from '../utils/scoring.js';
import Swot from './Swot.jsx';
import Gantt from './Gantt.jsx';
import Finance from './Finance.jsx';

const card = { background: '#fff', border: '1px solid var(--line)', borderRadius: 20, padding: 24 };

function TabBtn({ id, label, tab, onTab }) {
  const on = tab === id;
  return (
    <button
      onClick={() => onTab(id)}
      style={{ cursor: 'pointer', fontWeight: 700, fontSize: 14, padding: '10px 18px', borderRadius: 11, border: on ? 'none' : '1.5px solid var(--line)', background: on ? 'var(--g700)' : '#fff', color: on ? '#fff' : 'var(--soft)' }}
    >
      {label}
    </button>
  );
}

export default function Dashboard({ report, tasks, dashTab, finance, onBackReport, onDownload, onTab, onToggleTask, onFinanceChange, onOpenLanding }) {
  const r = report;
  const done = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const stage = stageFor(r.score);

  let body = null;

  if (dashTab === 'overview') {
    const kpis = [
      { label: 'درجة النضج', value: String(r.score), sub: 'من ١٠٠' },
      { label: 'مرحلة الفكرة', value: stage.emoji + ' ' + stage.label, sub: 'حسب التحليل' },
      { label: 'نموذج الإيراد', value: r.revenue.model, sub: r.revenue.arpu },
      { label: 'المهام المنجزة', value: done + '/' + tasks.length, sub: pct + '%' },
    ];
    body = (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
          {kpis.map((k) => (
            <div key={k.label} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 18, padding: 20, textAlign: 'right', boxShadow: '0 10px 30px -24px rgba(20,63,42,.35)' }}>
              <div style={{ fontSize: 12.5, color: 'var(--soft)', marginBottom: 9 }}>{k.label}</div>
              <div style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 21, color: 'var(--g700)', lineHeight: 1.2 }}>{k.value}</div>
              <div style={{ fontSize: 12, color: 'var(--soft)', marginTop: 5 }}>{k.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 20 }}>
          <div style={{ ...card, textAlign: 'right' }}>
            <h3 style={{ margin: '0 0 16px', fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>تقدّم التنفيذ</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 40, color: 'var(--g700)' }}>{pct}%</div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 12, borderRadius: 12, background: 'var(--g100)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: pct + '%', background: 'linear-gradient(90deg,#5fbf86,var(--g700))', borderRadius: 12, transition: 'width .5s' }} />
                </div>
                <div style={{ fontSize: 13, color: 'var(--soft)', marginTop: 8 }}>{done} من {tasks.length} مهمة مكتملة</div>
              </div>
            </div>
          </div>
          <div style={card}>
            <h3 style={{ margin: '0 0 16px', fontWeight: 700, fontSize: 16, color: 'var(--ink)', textAlign: 'right' }}>توصيات النمو</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {(r.recommendations || []).map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', flexDirection: 'row-reverse', textAlign: 'right' }}>
                  <span style={{ flexShrink: 0, width: 23, height: 23, borderRadius: 8, background: 'var(--g50)', color: 'var(--g700)', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--g100)' }}>{i + 1}</span>
                  <span style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--ink)' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  } else if (dashTab === 'tasks') {
    body = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 760, marginRight: 'auto' }}>
        {tasks.map((t) => {
          const check = t.done
            ? { background: 'var(--g600)', color: '#fff', border: 'none' }
            : { background: '#fff', color: 'transparent', border: '2px solid var(--line)' };
          return (
            <div
              key={t.id}
              onClick={() => onToggleTask(t.id)}
              style={{ display: 'flex', gap: 13, alignItems: 'flex-start', flexDirection: 'row-reverse', textAlign: 'right', cursor: 'pointer', background: t.done ? 'var(--g50)' : '#fff', border: '1.5px solid ' + (t.done ? 'var(--g100)' : 'var(--line)'), borderRadius: 14, padding: '15px 17px', transition: 'all .25s' }}
            >
              <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, ...check }}>✓</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink)', textDecoration: t.done ? 'line-through' : 'none', opacity: t.done ? 0.6 : 1 }}>{t.text}</div>
                <div style={{ fontSize: 11.5, color: 'var(--g600)', fontWeight: 600, marginTop: 5 }}>{t.cat}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  } else if (dashTab === 'timeline') {
    body = <Gantt tasks={tasks} onToggleTask={onToggleTask} />;
  } else if (dashTab === 'finance') {
    body = <Finance finance={finance} onChange={onFinanceChange} />;
  } else {
    const mc = [
      { key: 'TAM', value: r.marketSize.tam },
      { key: 'SAM', value: r.marketSize.sam },
      { key: 'SOM', value: r.marketSize.som },
    ];
    body = (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20, marginBottom: 20 }}>
          <div style={card}>
            <h3 style={{ margin: '0 0 16px', fontWeight: 700, fontSize: 16, color: 'var(--ink)', textAlign: 'right' }}>📊 حجم السوق</h3>
            <div style={{ display: 'flex', gap: 12 }}>
              {mc.map((c) => (
                <div key={c.key} style={{ flex: 1, background: 'var(--g50)', borderRadius: 14, padding: '16px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: 'var(--g600)', fontWeight: 700, marginBottom: 6 }}>{c.key}</div>
                  <div style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--g700)' }}>{c.value}</div>
                </div>
              ))}
            </div>
            <p style={{ margin: '14px 0 0', fontSize: 13.5, lineHeight: 1.7, color: 'var(--soft)', textAlign: 'right' }}>{r.marketSize.note}</p>
          </div>
          <div style={card}>
            <h3 style={{ margin: '0 0 16px', fontWeight: 700, fontSize: 16, color: 'var(--ink)', textAlign: 'right' }}>💰 الإيرادات</h3>
            <div style={{ textAlign: 'right', fontSize: 14, color: 'var(--ink)', lineHeight: 1.9 }}>
              <div><span style={{ color: 'var(--soft)' }}>النموذج: </span><b>{r.revenue.model}</b></div>
              <div><span style={{ color: 'var(--soft)' }}>متوسط الإيراد: </span><b>{r.revenue.arpu}</b></div>
            </div>
            <p style={{ margin: '12px 0 0', fontSize: 13.5, lineHeight: 1.7, color: 'var(--soft)', textAlign: 'right' }}>{r.revenue.note}</p>
          </div>
        </div>
        <div style={card}>
          <h3 style={{ margin: '0 0 18px', fontWeight: 700, fontSize: 16, color: 'var(--ink)', textAlign: 'right' }}>🧭 تحليل SWOT</h3>
          <Swot swot={r.swot} />
        </div>
      </>
    );
  }

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '30px 28px 64px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={onBackReport} style={{ background: '#fff', color: 'var(--soft)', fontWeight: 600, fontSize: 14, border: '1.5px solid var(--line)', borderRadius: 12, padding: '11px 18px' }}>→ التقرير</button>
          <button onClick={onDownload} style={{ background: 'var(--g700)', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 12, padding: '11px 18px' }}>⬇ تنزيل PDF</button>
          <button onClick={onOpenLanding} style={{ background: '#fff', color: 'var(--g700)', fontWeight: 700, fontSize: 14, border: '1.5px solid var(--g100)', borderRadius: 12, padding: '11px 18px' }}>🛬 صفحة الهبوط</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexDirection: 'row-reverse' }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: 'linear-gradient(150deg,var(--g500),var(--g700))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🌱</div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--ink)' }}>لوحة متابعة نبتة</div>
            <div style={{ fontSize: 12, color: 'var(--soft)' }}>حوّل الخطة إلى تنفيذ خطوة بخطوة</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexDirection: 'row-reverse', justifyContent: 'flex-end' }}>
        <TabBtn id="overview" label="نظرة عامة" tab={dashTab} onTab={onTab} />
        <TabBtn id="tasks" label="المهام" tab={dashTab} onTab={onTab} />
        <TabBtn id="timeline" label="الخطة الزمنية" tab={dashTab} onTab={onTab} />
        <TabBtn id="finance" label="المالية" tab={dashTab} onTab={onTab} />
        <TabBtn id="analysis" label="التحليل" tab={dashTab} onTab={onTab} />
      </div>
      {body}
    </div>
  );
}
