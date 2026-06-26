import { useEffect, useRef, useState } from 'react';
import { STEPS, DEFAULT_TIPS } from './data/steps.js';
import { callClaude, fallbackReport, buildAnalyzePrompt } from './api/claude.js';
import Wizard from './components/Wizard.jsx';
import Analyzing from './components/Analyzing.jsx';
import Report from './components/Report.jsx';
import Dashboard from './components/Dashboard.jsx';
import Landing from './components/Landing.jsx';
import Settings from './components/Settings.jsx';

/* يُقرأ مفتاح Anthropic من متغيّرات البيئة وقت البناء (Vite) */
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || '';

/* استخراج رقم من نص حر (للسعر/التكلفة) */
function numFrom(s, d) {
  const m = String(s || '').match(/\d[\d,.]*/);
  return m ? Math.round(parseFloat(m[0].replace(/,/g, ''))) : d;
}

const ANALYZE_MSGS = [
  'نقرأ المشكلة والجمهور المستهدف…',
  'نُقدّر حجم السوق والإيرادات…',
  'نُجري تحليل SWOT والمنافسين…',
  'نبني خطة البدء…',
];

export default function App() {
  const [screen, setScreen] = useState('wizard'); // wizard | analyzing | report | dashboard
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [aiTips, setAiTips] = useState([]);
  const [tipLoading, setTipLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [analyzingMsg, setAnalyzingMsg] = useState(ANALYZE_MSGS[0]);
  const [tasks, setTasks] = useState([]);
  const [dashTab, setDashTab] = useState('overview');
  const [gaugeStyle, setGaugeStyle] = useState('gauge');
  const [stepperStyle, setStepperStyle] = useState('numbered');
  const apiKey = API_KEY;
  const [showSettings, setShowSettings] = useState(false);
  const [finance, setFinance] = useState(null);
  const [landing, setLanding] = useState(null);
  const [landingLoading, setLandingLoading] = useState(false);

  const analyzeTimer = useRef(null);

  useEffect(() => () => clearInterval(analyzeTimer.current), []);

  /* ── الإجابات ── */
  const setAnswer = (id, value) => setAnswers((a) => ({ ...a, [id]: value }));

  /* ── اطلب نصيحة من المرشد ── */
  const askTip = () => {
    if (tipLoading) return;
    setTipLoading(true);
    const step = STEPS[stepIndex];
    const ans = step.fields.map((f) => f.label + ': ' + (answers[f.id] || '(لم يُجب)')).join('\n');
    const finish = (text) => {
      setAiTips((t) => [...t, text]);
      setTipLoading(false);
    };
    if (apiKey) {
      callClaude(
        [
          {
            role: 'user',
            content:
              'أنت «مرشد نبتة»، مستشار أعمال ودود يساعد رائد أعمال في مرحلة "' +
              step.title +
              '". إجاباته:\n' +
              ans +
              '\n\nأعطه نصيحة عملية واحدة محددة وقصيرة (جملتان كحد أقصى) بالعربية لتقوية فكرته في هذه المرحلة بالذات. ابدأ مباشرة دون مقدمات.',
          },
        ],
        apiKey
      )
        .then((t) => finish(t.trim()))
        .catch(() => finish('تعذّر جلب النصيحة الآن، تأكد من مفتاح API وحاول مجدداً.'));
    } else {
      setTimeout(() => finish(DEFAULT_TIPS[(stepIndex + aiTips.length + 1) % DEFAULT_TIPS.length]), 350);
    }
  };

  /* ── تحليل الفكرة ── */
  const analyze = () => {
    setScreen('analyzing');
    let k = 0;
    setAnalyzingMsg(ANALYZE_MSGS[0]);
    analyzeTimer.current = setInterval(() => {
      k = (k + 1) % ANALYZE_MSGS.length;
      setAnalyzingMsg(ANALYZE_MSGS[k]);
    }, 1600);

    const dump = STEPS.map(
      (s) => '# ' + s.title + '\n' + s.fields.map((f) => '- ' + f.label + ': ' + (answers[f.id] || '(لم يُجب)')).join('\n')
    ).join('\n\n');
    const prompt = buildAnalyzePrompt(dump);

    const finish = (json) => {
      clearInterval(analyzeTimer.current);
      setReport(json);
      setScreen('report');
    };

    if (apiKey) {
      callClaude([{ role: 'user', content: prompt }], apiKey)
        .then((raw) => {
          const m = raw.match(/\{[\s\S]*\}/);
          finish(JSON.parse(m[0]));
        })
        .catch(() => finish(fallbackReport(answers)));
    } else {
      setTimeout(() => finish(fallbackReport(answers)), 2200);
    }
  };

  /* ── فتح لوحة المتابعة ── */
  const openDashboard = () => {
    const r = report || fallbackReport(answers);
    let t = tasks;
    if (!t.length) {
      t = [];
      (r.nextSteps || []).forEach((x, i) => t.push({ id: 'n' + i, text: x, cat: 'التحقق', done: false }));
      (r.recommendations || []).forEach((x, i) => t.push({ id: 'r' + i, text: x, cat: 'النمو', done: false }));
    }
    setTasks(t);
    if (!finance) {
      setFinance({
        customers: 20,
        growth: 15,
        price: numFrom(answers.r_price, 49),
        varCost: numFrom(answers.r_cost, 15),
        fixedCost: 5000,
      });
    }
    setScreen('dashboard');
  };

  const toggleTask = (id) =>
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const setFinanceField = (id, value) => setFinance((f) => ({ ...f, [id]: value }));

  /* ── صفحة الهبوط ── */
  const fallbackLanding = () => {
    const r = report || {};
    const feats = (answers.s_what || answers.s_uvp || answers.s_how)
      ? [answers.s_uvp, answers.s_what, answers.s_how].filter(Boolean).slice(0, 3)
      : (r.recommendations || ['ميزة 1', 'ميزة 2', 'ميزة 3']).slice(0, 3);
    while (feats.length < 3) feats.push('');
    return {
      headline: answers.s_uvp || (r.verdict ? r.verdict : 'حلٌّ ذكي يوفّر وقتك وجهدك'),
      subheadline: answers.p_what || (r.marketSize && r.marketSize.note) || 'نساعدك على حلّ مشكلتك بأبسط طريقة وأسرع وقت.',
      cta: 'ابدأ الآن مجاناً',
      audience: answers.p_who || answers.m_customer || 'لرواد الأعمال الطموحين',
      features: feats,
      color: '#236b44',
    };
  };

  const openLanding = () => {
    setLanding((l) => l || fallbackLanding());
    setScreen('landing');
  };

  const setLandingField = (id, value) => setLanding((l) => ({ ...l, [id]: value }));
  const setLandingFeature = (i, value) =>
    setLanding((l) => {
      const features = [...l.features];
      features[i] = value;
      return { ...l, features };
    });

  const generateLanding = () => {
    if (landingLoading) return;
    setLandingLoading(true);
    const dump = STEPS.map(
      (s) => '# ' + s.title + '\n' + s.fields.map((f) => '- ' + f.label + ': ' + (answers[f.id] || '(لم يُجب)')).join('\n')
    ).join('\n\n');
    const fin = (obj) => {
      setLanding((l) => ({ ...l, ...obj, features: (obj.features || l.features).slice(0, 3) }));
      setLandingLoading(false);
    };
    if (apiKey) {
      callClaude(
        [
          {
            role: 'user',
            content:
              'أنت كاتب إعلانات محترف. بناءً على فكرة المشروع التالية، اكتب نص صفحة هبوط عربية مقنعة. أعد JSON صالحاً فقط دون أي نص آخر بهذا الشكل:\n{"headline":"<عنوان جذاب قصير>","subheadline":"<جملة قيمة>","cta":"<نص زر>","features":["<ميزة>","<ميزة>","<ميزة>"],"audience":"<وصف الجمهور>"}\n\n' +
              dump,
          },
        ],
        apiKey
      )
        .then((raw) => {
          const m = raw.match(/\{[\s\S]*\}/);
          fin(JSON.parse(m[0]));
        })
        .catch(() => fin(fallbackLanding()));
    } else {
      setTimeout(() => fin(fallbackLanding()), 1200);
    }
  };

  const handleNext = () => {
    if (stepIndex < 4) setStepIndex(stepIndex + 1);
    else analyze();
  };
  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  /* ── العرض ── */
  return (
    <>
      {screen === 'wizard' && (
        <Wizard
          stepIndex={stepIndex}
          answers={answers}
          aiTips={aiTips}
          tipLoading={tipLoading}
          gaugeStyle={gaugeStyle}
          stepperStyle={stepperStyle}
          onAnswer={setAnswer}
          onSelectStep={setStepIndex}
          onNext={handleNext}
          onPrev={handlePrev}
          onAskTip={askTip}
        />
      )}

      {screen === 'analyzing' && <Analyzing message={analyzingMsg} />}

      {screen === 'report' && report && (
        <Report
          report={report}
          onDownload={() => window.print()}
          onOpenDash={openDashboard}
          onEdit={() => setScreen('wizard')}
        />
      )}

      {screen === 'dashboard' && report && (
        <Dashboard
          report={report}
          tasks={tasks}
          dashTab={dashTab}
          finance={finance}
          onBackReport={() => setScreen('report')}
          onDownload={() => window.print()}
          onTab={setDashTab}
          onToggleTask={toggleTask}
          onFinanceChange={setFinanceField}
          onOpenLanding={openLanding}
        />
      )}

      {screen === 'landing' && landing && (
        <Landing
          landing={landing}
          loading={landingLoading}
          onField={setLandingField}
          onFeature={setLandingFeature}
          onGenerate={generateLanding}
          onBack={() => setScreen('dashboard')}
        />
      )}

      {screen === 'wizard' && showSettings && (
        <Settings
          gaugeStyle={gaugeStyle}
          stepperStyle={stepperStyle}
          onGauge={setGaugeStyle}
          onStepper={setStepperStyle}
          onClose={() => setShowSettings(false)}
        />
      )}

      {screen === 'wizard' && (
        <button
          className="nb-noprint"
          title="الإعدادات"
          onClick={() => setShowSettings((s) => !s)}
          style={{ position: 'fixed', bottom: 24, left: 24, width: 44, height: 44, borderRadius: 13, background: '#fff', border: '1.5px solid var(--line)', boxShadow: '0 4px 14px -4px rgba(20,63,42,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, zIndex: 400 }}
        >
          ⚙
        </button>
      )}
    </>
  );
}
