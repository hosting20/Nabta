import { STEPS } from '../data/steps.js';
import { stepCompletion } from '../utils/scoring.js';

/* شريط المراحل — أرقام / تقدّم / مقاطع */
export default function Stepper({ answers, stepIndex, stepperStyle, onSelect }) {
  return (
    <div id="nbStepper" style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
      {STEPS.map((s, i) => {
        const active = i === stepIndex;
        const comp = stepCompletion(answers, i);
        const done = comp >= 0.99 && !active;
        const compPct = Math.round(comp * 100);

        const wrap = {
          flex: 1,
          cursor: 'pointer',
          borderRadius: 14,
          padding: '12px 10px',
          transition: 'background .25s',
          background: active ? 'var(--g50)' : 'transparent',
          border: active ? '1.5px solid var(--g100)' : '1.5px solid transparent',
        };
        const dot = {
          width: 34,
          height: 34,
          borderRadius: stepperStyle === 'segments' ? 11 : '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 15,
          flexShrink: 0,
          ...(active
            ? { background: 'var(--g700)', color: '#fff', boxShadow: '0 6px 14px -5px rgba(35,107,68,.7)' }
            : done
            ? { background: 'var(--g500)', color: '#fff' }
            : { background: '#eef2f0', color: '#9db0a5' }),
        };
        const dotText = done && stepperStyle !== 'segments' ? '✓' : String(i + 1);
        const lab = {
          fontWeight: active ? 700 : 600,
          fontSize: 14.5,
          color: active ? 'var(--g700)' : done ? 'var(--ink)' : '#97a99e',
        };

        return (
          <div key={s.key} style={wrap} onClick={() => onSelect(i)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', justifyContent: 'center' }}>
              <div style={dot}>{dotText}</div>
              <div style={{ textAlign: 'right' }}>
                <div style={lab}>{s.label}</div>
                <div style={{ fontSize: 11, color: 'var(--soft)', marginTop: 2 }}>{s.sub}</div>
              </div>
            </div>
            {stepperStyle === 'progress' && (
              <div style={{ height: 4, borderRadius: 4, background: 'var(--g100)', marginTop: 11, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: active ? compPct + '%' : done ? '100%' : '0%',
                    background: 'var(--g600)',
                    borderRadius: 4,
                    transition: 'width .4s',
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
