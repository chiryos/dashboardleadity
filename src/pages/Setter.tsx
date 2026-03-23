import { useState, useRef, useEffect } from 'react';
import { Plus, X, ChevronDown, CheckCircle, Copy, RotateCcw, Bot, Zap, Trash2, Send } from 'lucide-react';

// ── Themes ─────────────────────────────────────────────────────────────────
const THEMES = [
  { id: 'blue',   name: 'Ocean',   grad: 'linear-gradient(135deg,#0c1a54 0%,#153080 45%,#1d4ed8 100%)', heroGrad: 'linear-gradient(135deg,#0f2166 0%,#1e3a9f 40%,#2563eb 100%)', accent: '#60a5fa', dot: '#3b82f6', glow: 'rgba(37,99,235,0.4)'   },
  { id: 'purple', name: 'Royal',   grad: 'linear-gradient(135deg,#1a0d47 0%,#3b1f8c 45%,#6d28d9 100%)', heroGrad: 'linear-gradient(135deg,#200e5a 0%,#4c1d95 40%,#7c3aed 100%)', accent: '#a78bfa', dot: '#8b5cf6', glow: 'rgba(109,40,217,0.4)'  },
  { id: 'green',  name: 'Forest',  grad: 'linear-gradient(135deg,#072212 0%,#0f3d22 45%,#15803d 100%)', heroGrad: 'linear-gradient(135deg,#0a2d17 0%,#14522d 40%,#16a34a 100%)', accent: '#4ade80', dot: '#22c55e', glow: 'rgba(22,163,74,0.4)'   },
  { id: 'rose',   name: 'Crimson', grad: 'linear-gradient(135deg,#2a0808 0%,#7f1d1d 45%,#dc2626 100%)', heroGrad: 'linear-gradient(135deg,#380a0a 0%,#991b1b 40%,#ef4444 100%)', accent: '#fb7185', dot: '#ef4444', glow: 'rgba(239,68,68,0.4)'   },
  { id: 'amber',  name: 'Blaze',   grad: 'linear-gradient(135deg,#280e04 0%,#7c2d12 45%,#ea580c 100%)', heroGrad: 'linear-gradient(135deg,#341208 0%,#9a3412 40%,#f97316 100%)', accent: '#fb923c', dot: '#f97316', glow: 'rgba(249,115,22,0.4)'  },
];
const getTheme = (id: string) => THEMES.find(t => t.id === id) ?? THEMES[0];

// ── Automations ─────────────────────────────────────────────────────────────
const AUTOS = [
  { key: 'sendMessages',  label: 'Send Messages',  desc: 'Send automated DMs and engage with messages'  },
  { key: 'commentsReply', label: 'Comments Reply', desc: 'Auto-reply to comments with a DM'             },
  { key: 'followUps',     label: 'Follow Ups',     desc: 'Send scheduled follow-up messages'             },
  { key: 'notifications', label: 'Notifications',  desc: 'Alert you about lead activity and performance' },
];
const AUTO_WITH_SETTINGS = ['sendMessages', 'commentsReply', 'followUps', 'notifications'];

const mkSettings = () => ({
  prompt: `# LEADITY .. DM SETTER AI\n### System Prompt - v4.0\n\n## WHO YOU ARE\n\nYou are Leadity's AI setter.\n\nNot a chatbot. Not a support agent. Not a salesperson.\n\nYou're a sharp, calm operator who talks to people like a real human would. Direct, clean, no fluff. You genuinely want to figure out if this person is a fit — and if they are, get them on a call.\n\n## THE ONLY THREE THINGS YOU DO\n\n1. Qualify — is this person actually worth a call?\n2. Build enough trust that they want to show up\n3. Send the booking link → https://booking.leadity.io/`,
  keywords: ['test', 'info', 'dm'],
  qualifyAmount: '1000',
  accountType: 'Appointments',
  likeAttachmentPct: 50,
  likeLastPct: 50,
  typingSpeed: 140,
  seenWait: 2,
  commentAnswer: "Yes I'm Leadity. What are you currently selling?",
  publicReplies: ["You just texted you! 🎯", "I sent you a DM brotha 💪", "Check your DM's FAST!"],
  followUpMsgs: Array(10).fill(null).map(() => ({ enabled: false, text: '' })),
  notifTypes: {
    hotLead: false,
    missedOpportunity: false,
    newLead: false,
    newSale: false,
    performanceInsights: false,
  },
  notifInsightsPeriod: '7D' as string,
  notifChannel: { app: true, email: false },
  autos: { sendMessages: true, commentsReply: true, followUps: true, notifications: false } as Record<string, boolean>,
});

interface SetterData {
  id: number;
  name: string;
  colorId: string;
  settings: ReturnType<typeof mkSettings>;
}

// ── Helpers ─────────────────────────────────────────────────────────────────
const Tog = ({ on, toggle, accent }: { on: boolean; toggle: () => void; accent: string }) => (
  <button onClick={e => { e.stopPropagation(); toggle(); }} className="tog flex-shrink-0"
    style={{ background: on ? accent : 'rgba(255,255,255,0.12)' }}>
    <span className="tog-knob" style={{ left: on ? 21 : 3 }} />
  </button>
);

const Slide = ({ label, value, min, max, unit, onChange, accent }: any) => (
  <div>
    <div className="flex justify-between mb-1.5">
      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
      <span className="text-xs font-semibold text-white">{value}{unit}</span>
    </div>
    <input type="range" min={min} max={max} value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full cursor-pointer" style={{ accentColor: accent, height: 3 }} />
  </div>
);

const iStyle = () => ({
  background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10, color: '#e2e5f7', fontSize: 13,
  outline: 'none', padding: '9px 12px', width: '100%',
} as const);

// ── Auto sub-settings ───────────────────────────────────────────────────────
const NOTIF_ALERTS = [
  { key: 'hotLead',            emoji: '🔥', label: 'HOT LEAD ALERT',        desc: '@username is Qualified with a X budget'                              },
  { key: 'missedOpportunity',  emoji: '🎯', label: 'MISSED OPPORTUNITY',     desc: '@username has ignored our X follow ups, you need to follow up yourself' },
  { key: 'newLead',            emoji: '⚡️', label: 'NEW LEAD',               desc: '@username booked a call / paid a commission'                         },
  { key: 'newSale',            emoji: '🏆', label: 'NEW SALE 🏆',            desc: '@username paid $ and sent a screenshot as proof'                     },
  { key: 'performanceInsights',emoji: '📊', label: 'PERFORMANCE INSIGHTS',   desc: ''                                                                     },
];
const INSIGHT_PERIODS = ['1D','2D','3D','7D','14D','30D'];

const AutoSub = ({ autoKey, s, set, accent }: any) => {
  const inp = iStyle();

  if (autoKey === 'sendMessages') return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Slide label="Like Attachment %" value={s.likeAttachmentPct} min={0} max={100} unit="%" accent={accent} onChange={(v: number) => set({ likeAttachmentPct: v })} />
        <Slide label="Like Last Message %" value={s.likeLastPct} min={0} max={100} unit="%" accent={accent} onChange={(v: number) => set({ likeLastPct: v })} />
      </div>
      <Slide label="Bot Typing Speed" value={s.typingSpeed} min={50} max={300} unit=" wpm" accent={accent} onChange={(v: number) => set({ typingSpeed: v })} />
      <Slide label="Seen Wait Time" value={s.seenWait} min={1} max={10} unit="s" accent={accent} onChange={(v: number) => set({ seenWait: v })} />
    </div>
  );

  if (autoKey === 'commentsReply') return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Comment Answer (DM)</label>
        <textarea value={s.commentAnswer} onChange={e => set({ commentAnswer: e.target.value })}
          rows={2} className="resize-none outline-none" style={{ ...inp, padding: '9px 12px' }} />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Public Replies</label>
        <div className="flex flex-wrap gap-1.5">
          {s.publicReplies.map((r: string, i: number) => (
            <span key={i} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
              style={{ background: 'rgba(255,255,255,0.07)', color: '#e2e5f7', border: '1px solid rgba(255,255,255,0.1)' }}>
              {r}<button onClick={() => set({ publicReplies: s.publicReplies.filter((_: any, j: number) => j !== i) })}><X size={8} /></button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  if (autoKey === 'followUps') {
    const ready = s.followUpMsgs.filter((m: any) => m.enabled && m.text.trim().length >= 10).length;
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{ready}/10 messages ready</span>
          <div className="flex-1 h-1 rounded-full mx-3" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <div className="h-1 rounded-full transition-all" style={{ width: `${(ready/10)*100}%`, background: accent }} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {s.followUpMsgs.map((msg: any, i: number) => (
            <div key={i} className="rounded-xl p-3 transition-all"
              style={{
                background: msg.enabled ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.15)',
                border: `1px solid ${msg.enabled ? accent + '35' : 'rgba(255,255,255,0.05)'}`,
              }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">Message {i + 1}</span>
                <button
                  onClick={() => {
                    const msgs = [...s.followUpMsgs];
                    msgs[i] = { ...msgs[i], enabled: !msgs[i].enabled };
                    set({ followUpMsgs: msgs });
                  }}
                  className="text-xs px-2 py-0.5 rounded-full font-bold transition-all"
                  style={{
                    background: msg.enabled ? `${accent}25` : 'rgba(255,255,255,0.07)',
                    color: msg.enabled ? accent : 'rgba(255,255,255,0.3)',
                    border: `1px solid ${msg.enabled ? accent + '40' : 'rgba(255,255,255,0.08)'}`,
                  }}>
                  {msg.enabled ? 'ON' : 'OFF'}
                </button>
              </div>
              <textarea
                value={msg.text}
                onChange={e => {
                  const msgs = [...s.followUpMsgs];
                  msgs[i] = { ...msgs[i], text: e.target.value };
                  set({ followUpMsgs: msgs });
                }}
                placeholder={`Write message ${i + 1}...`}
                rows={3}
                className="w-full bg-transparent text-xs outline-none resize-none leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.65)', caretColor: accent }}
              />
              <p className="text-right text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>{msg.text.length}/250</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (autoKey === 'notifications') {
    const nt = s.notifTypes;
    const nc = s.notifChannel;
    const setNt = (key: string) => set({ notifTypes: { ...nt, [key]: !nt[key] } });
    const setNc = (key: 'app' | 'email') => set({ notifChannel: { ...nc, [key]: !nc[key] } });

    return (
      <div className="space-y-4">
        {/* Alert types */}
        <div>
          <p className="text-xs font-bold mb-2" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>ALERT TYPES</p>
          <div className="space-y-1.5">
            {NOTIF_ALERTS.map(({ key, emoji, label, desc }) => (
              <div key={key}>
                <div className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-all"
                  style={{
                    background: nt[key as keyof typeof nt] ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.15)',
                    border: `1px solid ${nt[key as keyof typeof nt] ? accent + '30' : 'rgba(255,255,255,0.04)'}`,
                  }}>
                  <div className="flex items-start gap-2.5 flex-1 min-w-0 pr-2">
                    <span style={{ fontSize: 14, lineHeight: 1.2, flexShrink: 0 }}>{emoji}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white leading-none">{label}</p>
                      {desc && <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>{desc}</p>}
                    </div>
                  </div>
                  <Tog on={nt[key as keyof typeof nt]} toggle={() => setNt(key)} accent={accent} />
                </div>
                {/* Performance Insights period picker */}
                {key === 'performanceInsights' && nt.performanceInsights && (
                  <div className="mt-1.5 ml-2 flex flex-wrap gap-1.5">
                    {INSIGHT_PERIODS.map(p => (
                      <button key={p} onClick={() => set({ notifInsightsPeriod: p })}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
                        style={{
                          background: s.notifInsightsPeriod === p ? accent : 'rgba(255,255,255,0.06)',
                          color: s.notifInsightsPeriod === p ? '#fff' : 'rgba(255,255,255,0.4)',
                          border: `1px solid ${s.notifInsightsPeriod === p ? accent + '50' : 'rgba(255,255,255,0.08)'}`,
                        }}>
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Delivery channel */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
          <p className="text-xs font-bold mb-2.5" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>DELIVERY CHANNEL</p>
          <div className="flex gap-3">
            {([['app', '📱 App'], ['email', '✉️ Email']] as const).map(([key, lbl]) => (
              <div key={key} className="flex items-center gap-2.5 px-3 py-2 rounded-xl flex-1"
                style={{
                  background: nc[key] ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.15)',
                  border: `1px solid ${nc[key] ? accent + '30' : 'rgba(255,255,255,0.05)'}`,
                }}>
                <Tog on={nc[key]} toggle={() => setNc(key)} accent={accent} />
                <span className="text-xs font-semibold" style={{ color: nc[key] ? '#fff' : 'rgba(255,255,255,0.35)' }}>{lbl}</span>
              </div>
            ))}
          </div>
          {nc.app && nc.email && (
            <p className="text-xs mt-1.5 text-center" style={{ color: accent, opacity: 0.7 }}>Both channels active</p>
          )}
        </div>
      </div>
    );
  }

  return null;
};

// ── Test Chat Widget ─────────────────────────────────────────────────────────
const BOT_REPLIES = [
  "Hey! What are you currently selling?",
  "Interesting! How much revenue are you doing monthly?",
  "Got it. Are you serious about scaling your outreach?",
  "I only work with people who are ready to move fast. Are you one of them?",
  "Let me send you our booking link: https://booking.leadity.io/",
  "What's stopping you from taking action right now?",
];

const TestChat = ({ theme, onClose }: { theme: typeof THEMES[0]; onClose: () => void }) => {
  const [msgs, setMsgs] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hey! I'm your Leadity AI Setter. Send me a test message to see how I respond." },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

  const send = () => {
    if (!input.trim() || typing) return;
    const txt = input.trim();
    setMsgs(prev => [...prev, { role: 'user', text: txt }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMsgs(prev => {
        const botCount = prev.filter(m => m.role === 'bot').length;
        return [...prev, { role: 'bot', text: BOT_REPLIES[botCount % BOT_REPLIES.length] }];
      });
      setTyping(false);
    }, 1000 + Math.random() * 600);
  };

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col"
      style={{ height: 380, background: 'rgba(5,7,18,0.95)', border: `1px solid ${theme.accent}30`, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      <div className="flex items-center gap-2.5 px-4 py-2.5 flex-shrink-0"
        style={{ background: theme.heroGrad, borderBottom: `1px solid ${theme.accent}25` }}>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.18)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
        </div>
        <p className="text-xs font-bold text-white flex-1">Test Leadity AI · Live Preview</p>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
        <button onClick={onClose} className="w-5 h-5 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors ml-1"
          style={{ color: 'rgba(255,255,255,0.5)' }}>
          <X size={11} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[80%] px-2.5 py-2 text-xs leading-relaxed"
              style={{
                background: m.role === 'user' ? theme.dot : 'rgba(99,102,241,0.12)',
                color: '#e2e5f7',
                borderRadius: m.role === 'user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
              }}>
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="px-3 py-2.5" style={{ background: 'rgba(99,102,241,0.12)', borderRadius: '12px 12px 12px 3px' }}>
              <div className="flex gap-1 items-center">
                {[0,1,2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.4)', animation: 'bounce 1s infinite', animationDelay: `${i*0.18}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex items-center gap-2 px-3 py-2.5 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(99,102,241,0.1)', background: 'rgba(0,0,0,0.2)' }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Send a test message..."
          className="flex-1 bg-transparent text-xs outline-none text-white"
          style={{ caretColor: theme.accent }} />
        <button onClick={send}
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
          style={{ background: theme.dot, color: '#fff', opacity: input.trim() ? 1 : 0.4 }}>
          <Send size={11} />
        </button>
      </div>
    </div>
  );
};

// ── Setter Card (accordion) ──────────────────────────────────────────────────
const SetterCard = ({ setter, isExpanded, onToggle, onDelete, onSave, registerSave }:
  { setter: SetterData; isExpanded: boolean; onToggle: () => void; onDelete: () => void; onSave: (s: SetterData) => void; registerSave: (fn: () => void) => void }) => {

  const theme = getTheme(setter.colorId);
  const [s, setS] = useState(setter.settings);
  const [tab, setTab] = useState<'automations' | 'prompt'>('automations');
  const [_saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [kwi, setKwi] = useState('');
  const [showTest, setShowTest] = useState(false);

  const set = (patch: Partial<typeof s>) => setS(prev => ({ ...prev, ...patch }));
  const setAuto = (key: string) => set({ autos: { ...s.autos, [key]: !s.autos[key] } });

  const activeCount = Object.values(s.autos).filter(Boolean).length;
  const pct = Math.round((activeCount / AUTOS.length) * 100);

  const doSave = () => {
    onSave({ ...setter, settings: s });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  useEffect(() => {
    if (isExpanded) registerSave(doSave);
  }, [isExpanded, s]);

  return (
    <div className="overflow-hidden transition-all"
      style={{
        background: 'linear-gradient(160deg,#0e1128 0%,#0b0d1f 55%,#090b1d 100%) padding-box, linear-gradient(135deg,rgba(99,102,241,0.3),rgba(59,130,246,0.18),rgba(139,92,246,0.24)) border-box',
        border: '1px solid transparent',
        borderRadius: 18,
        boxShadow: isExpanded ? `0 8px 40px ${theme.glow}` : 'none',
        transition: 'box-shadow 0.4s ease',
      }}>

      {/* ── Collapsed header ── */}
      <div onClick={onToggle} className="flex items-center gap-4 px-5 py-4 cursor-pointer select-none"
        style={{ borderBottom: isExpanded ? '1px solid rgba(99,102,241,0.1)' : 'none' }}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: theme.grad, boxShadow: `0 4px 14px ${theme.glow}` }}>
          <Bot size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white leading-none mb-0.5">{setter.name}</p>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>{theme.name} theme</p>
          <div className="flex items-center gap-2.5 mt-2">
            <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <div className="h-1 rounded-full transition-all"
                style={{ width: `${pct}%`, background: `linear-gradient(90deg,${theme.dot},${theme.accent})` }} />
            </div>
            <span className="text-xs font-semibold flex-shrink-0" style={{ color: theme.accent }}>{pct}%</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={e => { e.stopPropagation(); onDelete(); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: 'var(--dim)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--dim)'}>
            <Trash2 size={13} />
          </button>
          <ChevronDown size={16} style={{
            color: 'var(--muted)',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
          }} />
        </div>
      </div>

      {/* ── Expanded content ── */}
      <div style={{ maxHeight: isExpanded ? '4000px' : '0px', overflow: 'hidden', transition: 'max-height 0.55s cubic-bezier(0.4,0,0.2,1)' }}>
        <div className="px-5 pt-4 pb-5 space-y-4">

          {/* Sub-tabs */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-xl p-1"
              style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(99,102,241,0.1)', width: 'fit-content' }}>
              {(['automations', 'prompt'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                  style={tab === t
                    ? { background: theme.grad, color: '#fff', boxShadow: `0 2px 8px ${theme.glow}` }
                    : { color: 'var(--muted)' }}>
                  {t === 'prompt' ? 'AI Prompt' : 'Automations'}
                </button>
              ))}
            </div>
            {/* Test button */}
            <button onClick={() => setShowTest(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={{ background: showTest ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#818cf8" />
              </svg>
              Test Leadity
            </button>
          </div>
          {showTest && <TestChat theme={theme} onClose={() => setShowTest(false)} />}

          {/* ── AUTOMATIONS ── */}
          {tab === 'automations' && (
            <div className="space-y-2.5">
              {/* Hero card */}
              <div className="rounded-2xl p-5"
                style={{ background: theme.heroGrad, border: `1px solid ${theme.accent}28`, boxShadow: `0 8px 32px ${theme.glow}, inset 0 1px 0 rgba(255,255,255,0.1)` }}>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                    <Zap size={13} className="text-white" fill="white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Automations</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{activeCount}/{AUTOS.length} active</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {AUTOS.map(({ key, label, desc }) => (
                    <div key={key}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all"
                      style={{ background: s.autos[key] ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)', border: `1px solid ${s.autos[key] ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.04)'}` }}>
                      <div>
                        <p className="text-xs font-semibold text-white">{label}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{desc}</p>
                      </div>
                      <Tog on={s.autos[key]} toggle={() => setAuto(key)} accent={theme.accent} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sub-settings (smooth expand) */}
              {AUTOS.filter(a => AUTO_WITH_SETTINGS.includes(a.key)).map(({ key, label }) => (
                <div key={key} style={{ maxHeight: s.autos[key] ? '2000px' : '0px', opacity: s.autos[key] ? 1 : 0, overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease' }}>
                  <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${theme.accent}20` }}>
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: theme.accent }} />
                      <span className="text-xs font-bold" style={{ color: theme.accent }}>{label}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: `${theme.accent}15`, color: theme.accent }}>settings</span>
                    </div>
                    <AutoSub autoKey={key} s={s} set={set} accent={theme.accent} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── AI PROMPT ── */}
          {tab === 'prompt' && (
            <div className="space-y-4">
              {/* Keywords — first in AI Prompt */}
              <div>
                <p className="text-xs font-bold mb-2" style={{ color: 'var(--muted)', letterSpacing: '0.06em' }}>KEYWORDS</p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {s.keywords.map((k, i) => (
                    <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium"
                      style={{ background: `${theme.accent}15`, color: theme.accent, border: `1px solid ${theme.accent}25` }}>
                      {k}<button onClick={() => set({ keywords: s.keywords.filter((_, j) => j !== i) })}><X size={9} /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={kwi} onChange={e => setKwi(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && kwi.trim()) { set({ keywords: [...s.keywords, kwi.trim()] }); setKwi(''); } }}
                    placeholder="Add keyword..." className="input-clean flex-1 text-xs" style={{ height: 36 }} />
                  <button onClick={() => { if (kwi.trim()) { set({ keywords: [...s.keywords, kwi.trim()] }); setKwi(''); } }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${theme.accent}15`, color: theme.accent }}>
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* Account Type + Qualify Amount — moved from General */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-bold mb-2" style={{ color: 'var(--muted)', letterSpacing: '0.06em' }}>ACCOUNT TYPE</p>
                  <select value={s.accountType} onChange={e => set({ accountType: e.target.value })}
                    className="input-clean text-xs w-full">
                    {['Appointments','E-commerce','Agency'].map(o =>
                      <option key={o} value={o} style={{ background: '#0b0d1f' }}>{o}</option>
                    )}
                  </select>
                </div>
                <div>
                  <p className="text-xs font-bold mb-2" style={{ color: 'var(--muted)', letterSpacing: '0.06em' }}>QUALIFY AMOUNT ($)</p>
                  <input type="number" value={s.qualifyAmount} onChange={e => set({ qualifyAmount: e.target.value })}
                    className="input-clean text-xs w-full" />
                </div>
              </div>

              {/* Prompt editor */}
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(99,102,241,0.15)', background: 'rgba(0,0,0,0.2)' }}>
                <div className="flex items-center justify-between px-4 py-2.5"
                  style={{ borderBottom: '1px solid rgba(99,102,241,0.1)', background: 'rgba(99,102,241,0.05)' }}>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(239,68,68,0.5)' }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(245,158,11,0.5)' }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(34,197,94,0.5)' }} />
                  </div>
                  <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>system_prompt.md</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { navigator.clipboard.writeText(s.prompt); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                      className="text-xs px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
                      style={{ color: copied ? '#4ade80' : 'var(--muted)', background: 'rgba(255,255,255,0.05)' }}>
                      {copied ? <CheckCircle size={10} /> : <Copy size={10} />}{copied ? 'Copied' : 'Copy'}
                    </button>
                    <button onClick={() => set({ prompt: setter.settings.prompt })}
                      className="text-xs px-2 py-1 rounded-lg flex items-center gap-1"
                      style={{ color: '#f87171', background: 'rgba(239,68,68,0.07)' }}>
                      <RotateCcw size={10} />Reset
                    </button>
                  </div>
                </div>
                <textarea value={s.prompt} onChange={e => set({ prompt: e.target.value })}
                  rows={12}
                  className="w-full bg-transparent outline-none resize-none font-mono text-xs p-4 leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.7)', caretColor: theme.accent }} />
                <div className="flex items-center justify-between px-4 py-2"
                  style={{ borderTop: '1px solid rgba(99,102,241,0.08)', background: 'rgba(99,102,241,0.03)' }}>
                  <span className="text-xs" style={{ color: 'var(--dim)' }}>{s.prompt.length.toLocaleString()} chars</span>
                  <div className="w-20 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div className="h-1 rounded-full" style={{ width: `${Math.min((s.prompt.length/30000)*100,100)}%`, background: theme.accent }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Create Modal ────────────────────────────────────────────────────────────
const CreateModal = ({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string, colorId: string) => void }) => {
  const [name, setName] = useState('');
  const [colorId, setColorId] = useState('blue');
  const theme = getTheme(colorId);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}>
      <div className="w-full max-w-sm mx-4 mb-4 sm:mb-0 rounded-2xl p-6"
        style={{ background: 'linear-gradient(160deg,#0e1128,#0b0d20) padding-box, linear-gradient(135deg,rgba(99,102,241,0.4),rgba(59,130,246,0.25),rgba(139,92,246,0.3)) border-box', border: '1px solid transparent', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-base font-bold text-white">Create a Setter</p>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors" style={{ color: 'var(--muted)' }}>
            <X size={14} />
          </button>
        </div>
        <div className="space-y-4">
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="Setter name (e.g. Instagram Main)..."
            className="input-clean w-full text-sm" autoFocus />
          <div>
            <p className="text-xs font-medium mb-3" style={{ color: 'var(--muted)' }}>Color Theme</p>
            <div className="flex gap-3">
              {THEMES.map(t => (
                <button key={t.id} onClick={() => setColorId(t.id)} className="flex flex-col items-center gap-1.5">
                  <div className="w-9 h-9 rounded-xl transition-all"
                    style={{ background: t.grad, boxShadow: colorId === t.id ? `0 0 0 2px #fff, 0 0 0 4px ${t.dot}, 0 6px 16px ${t.glow}` : `0 4px 10px ${t.glow}`, transform: colorId === t.id ? 'scale(1.12)' : 'scale(1)' }} />
                  <span className="text-xs" style={{ color: colorId === t.id ? t.accent : 'var(--dim)' }}>{t.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: theme.grad, border: `1px solid ${theme.accent}28` }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Bot size={14} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{name || 'My Setter'}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{theme.name} · {AUTOS.length}/{AUTOS.length} automations</p>
            </div>
          </div>
        </div>
        <button onClick={() => { if (name.trim()) onCreate(name.trim(), colorId); }}
          disabled={!name.trim()}
          className="w-full mt-5 py-3 rounded-xl text-sm font-bold text-white transition-all"
          style={{ background: name.trim() ? `linear-gradient(135deg,${theme.dot},${theme.accent})` : 'rgba(255,255,255,0.07)', color: name.trim() ? '#fff' : 'var(--dim)', boxShadow: name.trim() ? `0 4px 16px ${theme.glow}` : 'none', cursor: name.trim() ? 'pointer' : 'not-allowed' }}>
          Create Setter
        </button>
      </div>
    </div>
  );
};

// ── Main ────────────────────────────────────────────────────────────────────
const initSetters: SetterData[] = [
  { id: 1, name: 'Instagram Main', colorId: 'blue',   settings: mkSettings() },
  { id: 2, name: 'Story Replies',  colorId: 'purple', settings: mkSettings() },
];

export default function Setter() {
  const [setters, setSetters] = useState<SetterData[]>(initSetters);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const saveFnRef = useRef<(() => void) | null>(null);

  const toggle = (id: number) => setExpandedId(prev => prev === id ? null : id);

  const handleCreate = (name: string, colorId: string) => {
    const ns: SetterData = { id: Date.now(), name, colorId, settings: mkSettings() };
    setSetters(prev => [...prev, ns]);
    setShowCreate(false);
    setExpandedId(ns.id);
  };

  const handleDelete = (id: number) => {
    setSetters(prev => prev.filter(s => s.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const handleSave = (updated: SetterData) => {
    setSetters(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  return (
    <div className="space-y-3 max-w-2xl">
      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-base font-bold text-white">Your Setters</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{setters.length} setter{setters.length !== 1 ? 's' : ''} configured</p>
        </div>
      </div>
      {setters.map(setter => (
        <SetterCard key={setter.id} setter={setter} isExpanded={expandedId === setter.id}
          onToggle={() => toggle(setter.id)} onDelete={() => handleDelete(setter.id)} onSave={handleSave}
          registerSave={fn => { saveFnRef.current = fn; }} />
      ))}
      {expandedId !== null ? (
        <button onClick={() => { saveFnRef.current?.(); setExpandedId(null); }}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2.5 text-sm font-bold text-white transition-all mt-2"
          style={{ background: 'linear-gradient(135deg,#16a34a 0%,#22c55e 50%,#4ade80 100%)', boxShadow: '0 4px 20px rgba(34,197,94,0.35)' }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 28px rgba(34,197,94,0.55)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(34,197,94,0.35)'}>
          <CheckCircle size={16} />
          Save Setter
        </button>
      ) : (
        <button onClick={() => setShowCreate(true)}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2.5 text-sm font-bold text-white transition-all mt-2"
          style={{ background: 'linear-gradient(135deg,#4f46e5 0%,#2563eb 50%,#3b82f6 100%)', boxShadow: '0 4px 20px rgba(79,70,229,0.35)' }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 28px rgba(79,70,229,0.5)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(79,70,229,0.35)'}>
          <Plus size={16} />
          Create a Setter
        </button>
      )}
    </div>
  );
}
