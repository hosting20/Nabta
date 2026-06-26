import { stageFor } from '../utils/scoring.js';

/* مؤشر نمو الفكرة — قوس / حلقة / أعمدة */
export default function Gauge({ score, style, stage }) {
  const C = 2 * Math.PI * 58;
  const arc = 0.75 * C;
  const arcTrack = arc.toFixed(1) + ' 1000';
  const arcFill = ((arc * score) / 100).toFixed(1) + ' 1000';
  const ringC = 2 * Math.PI * 60;
  const ringFill = ((ringC * score) / 100).toFixed(1) + ' 1000';
  const st = stage || stageFor(score);

  let visual = null;
  if (style === 'gauge') {
    visual = (
      <svg width="210" height="170" viewBox="0 0 150 150">
        <defs>
          <linearGradient id="nbg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5fbf86" />
            <stop offset="1" stopColor="#236b44" />
          </linearGradient>
        </defs>
        <circle
          cx="75" cy="75" r="58" fill="none" stroke="var(--g100)" strokeWidth="13"
          strokeLinecap="round" strokeDasharray={arcTrack} transform="rotate(135 75 75)"
        />
        <circle
          cx="75" cy="75" r="58" fill="none" stroke="url(#nbg)" strokeWidth="13"
          strokeLinecap="round" strokeDasharray={arcFill} transform="rotate(135 75 75)"
          style={{ transition: 'stroke-dasharray .6s ease' }}
        />
      </svg>
    );
  } else if (style === 'ring') {
    visual = (
      <svg width="170" height="170" viewBox="0 0 150 150">
        <defs>
          <linearGradient id="nbg2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5fbf86" />
            <stop offset="1" stopColor="#236b44" />
          </linearGradient>
        </defs>
        <circle cx="75" cy="75" r="60" fill="none" stroke="var(--g100)" strokeWidth="13" />
        <circle
          cx="75" cy="75" r="60" fill="none" stroke="url(#nbg2)" strokeWidth="13"
          strokeLinecap="round" strokeDasharray={ringFill} transform="rotate(-90 75 75)"
          style={{ transition: 'stroke-dasharray .6s ease' }}
        />
      </svg>
    );
  } else {
    visual = (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 9, height: 120 }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const on = score >= (i + 1) * 20 - 12;
          return (
            <div
              key={i}
              style={{
                width: 20,
                height: 40 + i * 18,
                borderRadius: 7,
                background: on ? 'var(--g600)' : 'var(--g100)',
                transition: 'background .4s, height .4s',
              }}
            />
          );
        })}
      </div>
    );
  }

  const top = style === 'ring' ? '50%' : '58%';
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 170 }}>
      {visual}
      <div style={{ position: 'absolute', top, left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 44, lineHeight: 1, color: 'var(--g700)' }}>
          {score}
        </div>
        <div style={{ fontSize: 12, color: 'var(--soft)', marginTop: 2 }}>من ١٠٠</div>
      </div>
    </div>
  );
}
