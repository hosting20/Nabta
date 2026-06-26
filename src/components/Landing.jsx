import { useState } from 'react';

/* شاشة بناء صفحة الهبوط + توليد بالـAI + اختبار الطلب */
export default function Landing({ landing, loading, onField, onFeature, onGenerate, onBack }) {
  const [emails, setEmails] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  const [visits, setVisits] = useState(0);
  const [simSignups, setSimSignups] = useState(0);

  const totalSignups = emails.length + simSignups;
  const conv = visits ? Math.round((totalSignups / visits) * 1000) / 10 : 0;
  const demand = conv >= 12 ? { label: 'طلب قوي', color: 'var(--g600)' } : conv >= 5 ? { label: 'طلب متوسط', color: '#b06a1f' } : visits ? { label: 'طلب ضعيف', color: '#b03f3f' } : { label: 'لم يُختبر بعد', color: 'var(--soft)' };

  // معدل تحويل تقديري يعتمد على جودة المحتوى
  const quality = Math.min(1, (landing.headline.length > 12 ? 0.4 : 0.2) + (landing.features.filter((f) => f.trim()).length * 0.12) + (landing.subheadline.length > 20 ? 0.2 : 0.1));

  const submitEmail = () => {
    const v = emailInput.trim();
    if (v && /@/.test(v) && !emails.includes(v)) {
      setEmails((e) => [...e, v]);
      setVisits((n) => n + 1);
    }
    setEmailInput('');
  };

  const simulate = () => {
    const newVisits = 100;
    const rate = quality * (0.08 + Math.random() * 0.12); // 8%–20% مرجّحة بالجودة
    setVisits((n) => n + newVisits);
    setSimSignups((n) => n + Math.round(newVisits * rate));
  };

  const resetTest = () => {
    setEmails([]); setVisits(0); setSimSignups(0); setEmailInput('');
  };

  const field = (id, label, ph, area) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', textAlign: 'right', fontWeight: 600, fontSize: 13.5, color: 'var(--ink)', marginBottom: 7 }}>{label}</label>
      {area ? (
        <textarea value={landing[id]} placeholder={ph} onChange={(e) => onField(id, e.target.value)} style={{ ...inputStyle, minHeight: 70, lineHeight: 1.7 }} />
      ) : (
        <input value={landing[id]} placeholder={ph} onChange={(e) => onField(id, e.target.value)} style={inputStyle} />
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '26px 28px 64px' }}>
      {/* رأس */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 22 }}>
        <div className="nb-noprint" style={{ display: 'flex', gap: 10 }}>
          <button onClick={onBack} style={btn('#fff', 'var(--soft)', '1.5px solid var(--line)')}>→ لوحة المتابعة</button>
          <button onClick={onGenerate} disabled={loading} style={{ ...btn('var(--g700)', '#fff', 'none'), opacity: loading ? 0.7 : 1 }}>
            {loading ? '… يكتب المحتوى' : '✦ توليد المحتوى بالذكاء الاصطناعي'}
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexDirection: 'row-reverse' }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: 'linear-gradient(150deg,var(--g500),var(--g700))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🛬</div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--ink)' }}>باني صفحة الهبوط</div>
            <div style={{ fontSize: 12, color: 'var(--soft)' }}>صمّم · ولّد بالذكاء الاصطناعي · اختبر الطلب الحقيقي</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 22, alignItems: 'start' }}>
        {/* المُنشئ */}
        <section style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 22, padding: 24 }}>
          <h3 style={{ margin: '0 0 18px', fontWeight: 700, fontSize: 16, color: 'var(--ink)', textAlign: 'right' }}>🧱 محتوى الصفحة</h3>
          {field('headline', 'العنوان الرئيسي', 'اكتب عنواناً جذاباً…')}
          {field('subheadline', 'العنوان الفرعي', 'وضّح القيمة في جملة…', true)}
          {field('cta', 'نص زر الإجراء (CTA)', 'مثال: ابدأ مجاناً')}
          {field('audience', 'الجمهور المستهدف', 'لمن هذه الصفحة؟')}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', textAlign: 'right', fontWeight: 600, fontSize: 13.5, color: 'var(--ink)', marginBottom: 7 }}>المزايا (3)</label>
            {[0, 1, 2].map((i) => (
              <input key={i} value={landing.features[i] || ''} placeholder={'ميزة ' + (i + 1)} onChange={(e) => onFeature(i, e.target.value)} style={{ ...inputStyle, marginBottom: 8 }} />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <input type="color" value={landing.color} onChange={(e) => onField('color', e.target.value)} style={{ width: 46, height: 34, border: '1.5px solid var(--line)', borderRadius: 10, background: '#fff', cursor: 'pointer' }} />
            <span style={{ fontSize: 13, color: 'var(--soft)' }}>لون العلامة التجارية</span>
          </div>
        </section>

        {/* المعاينة + اختبار الطلب */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* معاينة حيّة */}
          <div style={{ border: '1px solid var(--line)', borderRadius: 22, overflow: 'hidden', boxShadow: '0 14px 40px -26px rgba(20,63,42,.4)' }}>
            <div style={{ display: 'flex', gap: 6, padding: '10px 14px', background: '#f3f6f4', borderBottom: '1px solid var(--line)' }}>
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#e0a96d' }} />
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#7fcf9c' }} />
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#d0d8d4' }} />
              <span style={{ marginRight: 'auto', fontSize: 11, color: 'var(--soft)' }}>معاينة الصفحة</span>
            </div>
            <div style={{ padding: '44px 32px', textAlign: 'center', background: 'radial-gradient(120% 80% at 50% 0%, ' + landing.color + '14 0%, #fff 60%)' }}>
              <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, color: landing.color, background: landing.color + '1a', padding: '6px 14px', borderRadius: 999, marginBottom: 16 }}>
                {landing.audience || 'لجمهورك المستهدف'}
              </div>
              <h1 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 30, lineHeight: 1.3, color: 'var(--ink)', margin: '0 0 12px' }}>
                {landing.headline || 'عنوان رئيسي يلفت الانتباه'}
              </h1>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--soft)', maxWidth: 440, margin: '0 auto 22px' }}>
                {landing.subheadline || 'اشرح هنا القيمة التي تقدّمها لعميلك في جملة أو جملتين مقنعتين.'}
              </p>
              <div style={{ display: 'flex', gap: 8, maxWidth: 420, margin: '0 auto 26px' }}>
                <input
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitEmail()}
                  placeholder="بريدك الإلكتروني"
                  style={{ flex: 1, textAlign: 'right', fontSize: 14, color: 'var(--ink)', background: '#fff', border: '1.5px solid var(--line)', borderRadius: 12, padding: '12px 14px', outline: 'none' }}
                />
                <button onClick={submitEmail} style={{ background: landing.color, color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 12, padding: '12px 20px', whiteSpace: 'nowrap' }}>
                  {landing.cta || 'ابدأ الآن'}
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: '16px 12px' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: landing.color + '1a', color: landing.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', fontWeight: 800 }}>✓</div>
                    <div style={{ fontSize: 12.5, color: 'var(--ink)', lineHeight: 1.5 }}>{landing.features[i] || 'ميزة ' + (i + 1)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* لوحة اختبار الطلب */}
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 22, padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: demand.color + '1a', color: demand.color, fontSize: 12.5, fontWeight: 700, padding: '6px 12px', borderRadius: 999 }}>● {demand.label}</span>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: 16, color: 'var(--ink)', textAlign: 'right' }}>🧪 اختبار الطلب</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }}>
              {[
                { l: 'الزيارات', v: visits },
                { l: 'التسجيلات', v: totalSignups },
                { l: 'معدل التحويل', v: conv + '%' },
              ].map((k) => (
                <div key={k.l} style={{ background: 'var(--g50)', borderRadius: 14, padding: '14px 10px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--g700)' }}>{k.v}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--soft)', marginTop: 4 }}>{k.l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={simulate} style={{ ...btn('var(--g700)', '#fff', 'none'), flex: 1, justifyContent: 'center' }}>محاكاة 100 زائر</button>
              <button onClick={resetTest} style={btn('#fff', 'var(--soft)', '1.5px solid var(--line)')}>تصفير</button>
            </div>
            {emails.length > 0 && (
              <div style={{ marginTop: 14, textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: 'var(--soft)', marginBottom: 6 }}>تسجيلات حقيقية ({emails.length})</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-end' }}>
                  {emails.map((e, i) => (
                    <span key={i} style={{ direction: 'ltr', fontSize: 12, background: 'var(--g50)', color: 'var(--g700)', padding: '4px 10px', borderRadius: 999 }}>{e}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  textAlign: 'right',
  fontSize: 14.5,
  color: 'var(--ink)',
  background: 'var(--field)',
  border: '1.5px solid var(--line)',
  borderRadius: 12,
  padding: '12px 14px',
  outline: 'none',
};

function btn(bg, color, border) {
  return { display: 'inline-flex', alignItems: 'center', gap: 8, background: bg, color, fontWeight: 700, fontSize: 14, border, borderRadius: 12, padding: '12px 18px', cursor: 'pointer' };
}
