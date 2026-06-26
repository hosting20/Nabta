/* شاشة التحميل أثناء التحليل */
export default function Analyzing({ message }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 26, padding: 40 }}>
      <div style={{ fontSize: 72, animation: 'nb-grow 1.6s ease-in-out infinite' }}>🌱</div>
      <div style={{ width: 46, height: 46, border: '4px solid var(--g100)', borderTopColor: 'var(--g600)', borderRadius: '50%', animation: 'nb-spin 1s linear infinite' }} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 24, color: 'var(--g700)' }}>نُحلّل فكرتك الآن…</div>
        <div style={{ fontSize: 15, color: 'var(--soft)', marginTop: 8, animation: 'nb-pulse 1.6s ease-in-out infinite' }}>{message}</div>
      </div>
    </div>
  );
}
