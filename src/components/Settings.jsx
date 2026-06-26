/* لوحة الإعدادات العائمة */
function Group({ opts, cur, onPick }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {opts.map((o) => {
        const on = cur === o.v;
        return (
          <button
            key={o.v}
            onClick={() => onPick(o.v)}
            style={{
              flex: 1,
              padding: '7px 4px',
              borderRadius: 9,
              border: '1.5px solid ' + (on ? 'var(--g700)' : 'var(--line)'),
              background: on ? 'var(--g50)' : '#fff',
              color: on ? 'var(--g700)' : 'var(--soft)',
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            {o.l}
          </button>
        );
      })}
    </div>
  );
}

export default function Settings({ gaugeStyle, stepperStyle, onGauge, onStepper, onClose }) {
  return (
    <div
      className="nb-noprint"
      style={{ position: 'fixed', top: 16, left: 16, background: '#fff', border: '1px solid var(--line)', borderRadius: 18, padding: 20, boxShadow: '0 12px 32px -8px rgba(20,63,42,.25)', zIndex: 500, minWidth: 240, animation: 'nb-rise .2s ease' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 16, color: 'var(--soft)', padding: '2px 6px' }}>✕</button>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>الإعدادات</div>
      </div>
      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--soft)', marginBottom: 6 }}>مؤشر النمو</div>
          <Group
            opts={[{ v: 'gauge', l: 'قوس' }, { v: 'ring', l: 'حلقة' }, { v: 'bars', l: 'أعمدة' }]}
            cur={gaugeStyle}
            onPick={onGauge}
          />
        </div>
        <div>
          <div style={{ fontSize: 12, color: 'var(--soft)', marginBottom: 6 }}>شريط المراحل</div>
          <Group
            opts={[{ v: 'numbered', l: 'أرقام' }, { v: 'progress', l: 'تقدّم' }, { v: 'segments', l: 'مقاطع' }]}
            cur={stepperStyle}
            onPick={onStepper}
          />
        </div>
      </div>
    </div>
  );
}
