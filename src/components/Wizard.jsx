import { STEPS } from '../data/steps.js';
import { overallScore, stageFor } from '../utils/scoring.js';
import Stepper from './Stepper.jsx';
import Gauge from './Gauge.jsx';
import Breakdown from './Breakdown.jsx';
import MentorTips from './MentorTips.jsx';

const cardShadow = '0 10px 30px -22px rgba(20,63,42,.35)';

export default function Wizard({
  stepIndex,
  answers,
  aiTips,
  tipLoading,
  gaugeStyle,
  stepperStyle,
  onAnswer,
  onSelectStep,
  onNext,
  onPrev,
  onAskTip,
}) {
  const step = STEPS[stepIndex];
  const score = overallScore(answers);
  const stage = stageFor(score);

  const fieldStyle = {
    width: '100%',
    textAlign: 'right',
    fontSize: 15,
    color: 'var(--ink)',
    background: 'var(--field)',
    border: '1.5px solid var(--line)',
    borderRadius: 14,
    padding: '14px 16px',
    outline: 'none',
  };

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '26px 28px 56px' }}>
      {/* رأس الصفحة */}
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 22 }}>
        <div className="nb-noprint" style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--g700)', color: '#eafaef', fontSize: 13, fontWeight: 600, padding: '9px 15px', borderRadius: 999 }}>
            ✦ مدعوم بالذكاء الاصطناعي
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', border: '1px solid var(--line)', color: 'var(--g700)', fontSize: 13, fontWeight: 600, padding: '9px 15px', borderRadius: 999 }}>
            المرحلة 01 · الفكرة والتحقق
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexDirection: 'row-reverse' }}>
          <div style={{ width: 54, height: 54, borderRadius: 16, background: 'linear-gradient(150deg,var(--g500),var(--g700))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: '0 8px 20px -6px rgba(35,107,68,.55)' }}>🌱</div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 27, lineHeight: 1, color: 'var(--ink)' }}>نبتة</div>
            <div style={{ fontSize: 12.5, color: 'var(--soft)', marginTop: 5 }}>ازرع فكرتك · تحقّق منها · اجعلها تُثمر</div>
          </div>
        </div>
      </header>

      {/* شريط المراحل */}
      <div className="nb-noprint" style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 20, padding: '18px 22px', marginBottom: 22, boxShadow: '0 1px 2px rgba(20,63,42,.04)' }}>
        <Stepper answers={answers} stepIndex={stepIndex} stepperStyle={stepperStyle} onSelect={onSelectStep} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.65fr 1fr', gap: 22, alignItems: 'start' }}>
        {/* بطاقة الأسئلة */}
        <section style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 22, overflow: 'hidden', boxShadow: cardShadow }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: '22px 26px', borderBottom: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  style={{ width: i === stepIndex ? 22 : 7, height: 7, borderRadius: 7, display: 'inline-block', marginLeft: 4, background: i <= stepIndex ? 'var(--g600)' : 'var(--g100)', transition: 'all .3s' }}
                />
              ))}
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ margin: 0, fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 22, color: 'var(--g700)' }}>
                {step.title} <span style={{ color: 'var(--ink)', fontWeight: 700 }}>— الخطوة {stepIndex + 1} من 5</span>
              </h2>
              <p style={{ margin: '6px 0 0', fontSize: 13.5, color: 'var(--soft)' }}>{step.subtitle}</p>
            </div>
          </div>

          <div style={{ padding: '24px 26px' }}>
            {step.fields.map((f) => (
              <div key={f.id} style={{ marginBottom: 20, animation: 'nb-rise .35s ease both' }}>
                <label style={{ display: 'block', textAlign: 'right', fontWeight: 600, fontSize: 14.5, color: 'var(--ink)', marginBottom: 9 }}>
                  {f.label}
                </label>
                {f.type === 'area' ? (
                  <textarea
                    placeholder={f.ph}
                    value={answers[f.id] || ''}
                    onChange={(e) => onAnswer(f.id, e.target.value)}
                    style={{ ...fieldStyle, minHeight: 96, lineHeight: 1.7 }}
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={f.ph}
                    value={answers[f.id] || ''}
                    onChange={(e) => onAnswer(f.id, e.target.value)}
                    style={fieldStyle}
                  />
                )}
              </div>
            ))}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 8 }}>
              <button onClick={onNext} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'var(--g700)', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', borderRadius: 13, padding: '14px 26px', boxShadow: '0 8px 18px -8px rgba(35,107,68,.7)' }}>
                {stepIndex < 4 ? 'التالي ←' : 'حلّل فكرتي ✦'}
              </button>
              <button
                onClick={onPrev}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: stepIndex > 0 ? 'var(--soft)' : '#c2cfc8', fontWeight: 600, fontSize: 15, border: 'none', padding: '14px 10px', cursor: stepIndex > 0 ? 'pointer' : 'default' }}
              >
                → السابق
              </button>
            </div>
          </div>
        </section>

        {/* العمود الجانبي */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 22, padding: 22, boxShadow: cardShadow }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--amberbg)', color: '#9a6320', fontSize: 12.5, fontWeight: 700, padding: '6px 12px', borderRadius: 999 }}>
                {stage.emoji} {stage.label}
              </span>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>مؤشر نمو الفكرة</h3>
            </div>
            <Gauge score={score} style={gaugeStyle} stage={stage} />
            <Breakdown answers={answers} />
          </div>

          <MentorTips stepIndex={stepIndex} aiTips={aiTips} tipLoading={tipLoading} onAsk={onAskTip} />
        </aside>
      </div>
    </div>
  );
}
