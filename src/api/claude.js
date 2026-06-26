import { overallScore } from '../utils/scoring.js';

/* استدعاء Claude عبر واجهة Anthropic مباشرة من المتصفح */
export function callClaude(messages, apiKey) {
  return fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1500, messages }),
  })
    .then((res) => {
      if (!res.ok) {
        return res
          .json()
          .catch(() => ({}))
          .then((e) => {
            throw new Error((e.error && e.error.message) || 'HTTP ' + res.status);
          });
      }
      return res.json();
    })
    .then((data) => data.content[0].text);
}

/* تقرير احتياطي يُستخدم بدون مفتاح API أو عند فشل الطلب */
export function fallbackReport(answers) {
  const sc = overallScore(answers || {});
  return {
    score: sc || 58,
    verdict: 'فكرة واعدة تحتاج إثبات الطلب عبر نموذج أولي صغير قبل التوسّع.',
    marketSize: {
      tam: 'كبير',
      sam: 'متوسط',
      som: 'بداية مركّزة',
      note: 'ابدأ بشريحة ضيقة قابلة للوصول ثم اتّسع تدريجياً.',
    },
    revenue: { model: 'اشتراك شهري', arpu: 'متوسط', note: 'اربط التسعير بالقيمة الواضحة للعميل.' },
    swot: {
      strengths: ['حلّ لمشكلة حقيقية', 'تركيز على شريحة محددة'],
      weaknesses: ['الحاجة لإثبات الطلب', 'موارد محدودة'],
      opportunities: ['سوق غير مخدوم', 'إمكانية التوسّع'],
      threats: ['منافسون أكبر', 'تغيّر سلوك العملاء'],
    },
    competitors: [
      { name: 'حلول حالية متفرقة', note: 'تجربة مجزّأة وغير موحّدة.' },
      { name: 'الطريقة اليدوية', note: 'بطيئة وعرضة للأخطاء.' },
    ],
    recommendations: [
      'ابنِ صفحة هبوط لاختبار الطلب',
      'أجرِ 10 مقابلات مع عملاء محتملين',
      'أطلق نموذجاً أولياً مبسّطاً',
    ],
    nextSteps: ['تحقّق من المشكلة بالمقابلات', 'ابنِ MVP لأهم ميزة', 'اختبر مع أول 20 مستخدماً'],
  };
}

/* بناء نص الطلب لتحليل الفكرة كاملة */
export function buildAnalyzePrompt(stepsDump) {
  return (
    'أنت محلل أعمال خبير. حلّل فكرة المشروع التالية وأعد JSON صالحاً فقط دون أي نص قبله أو بعده.\n\n' +
    stepsDump +
    '\n\nأعد بهذا الشكل بالضبط (قيم عربية موجزة):\n' +
    '{"score":<رقم 0-100>,"verdict":"<جملة حكم موجزة>","marketSize":{"tam":"<قيمة>","sam":"<قيمة>","som":"<قيمة>","note":"<سطر شرح>"},"revenue":{"model":"<النموذج>","arpu":"<متوسط الإيراد>","note":"<سطر>"},"swot":{"strengths":["<نقطة>","<نقطة>"],"weaknesses":["<نقطة>","<نقطة>"],"opportunities":["<نقطة>","<نقطة>"],"threats":["<نقطة>","<نقطة>"]},"competitors":[{"name":"<اسم>","note":"<سطر>"},{"name":"<اسم>","note":"<سطر>"}],"recommendations":["<توصية>","<توصية>","<توصية>"],"nextSteps":["<خطوة>","<خطوة>","<خطوة>"]}'
  );
}
