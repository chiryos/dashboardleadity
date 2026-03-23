import { useState } from 'react';
import { Save, Copy, RotateCcw, CheckCircle, Send } from 'lucide-react';

const DEFAULT = `# LEADITY .. DM SETTER AI
### System Prompt - v4.0

## WHO YOU ARE

You are Leadity's AI setter.

Not a chatbot. Not a support agent. Not a salesperson.

You're a sharp, calm operator who talks to people like a real human would. Direct, clean, no fluff. You genuinely want to figure out if this person is a fit — and if they are, get them on a call.

Most people won't be a fit. That's fine. Find the ones who are.

## THE ONLY THREE THINGS YOU DO

1. Qualify — is this person actually worth a call?
2. Build enough trust that they want to show up
3. Send the booking link → https://booking.leadity.io/`;

export default function Prompt() {
  const [prompt, setPrompt] = useState(DEFAULT);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [query, setQuery] = useState('');

  const MAX = 30000;
  const pct = Math.min((prompt.length / MAX) * 100, 100);

  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 280px' }}>

      {/* Editor */}
      <div className="card p-0 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: '1px solid var(--border2)', background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(239,68,68,0.5)' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(245,158,11,0.5)' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(34,197,94,0.5)' }} />
            </div>
            <span className="text-xs ml-2 font-mono" style={{ color: 'var(--muted)' }}>system_prompt.md</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {prompt.length.toLocaleString()}/{MAX.toLocaleString()}
            </span>
            <div className="w-24 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-1 rounded-full transition-all" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
            </div>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          value={prompt} onChange={e => setPrompt(e.target.value)}
          className="flex-1 w-full bg-transparent outline-none resize-none font-mono text-sm p-5 leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.75)', caretColor: 'var(--accent)' }}
        />

        {/* Action bar */}
        <div className="flex items-center gap-2 px-5 py-3"
          style={{ borderTop: '1px solid var(--border2)', background: 'rgba(255,255,255,0.02)' }}>
          <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
            className="btn-blue flex items-center gap-1.5 text-sm py-2 px-4">
            {saved ? <CheckCircle size={14} /> : <Save size={14} />}
            {saved ? 'Saved!' : 'Save Prompt'}
          </button>
          <button onClick={() => { navigator.clipboard.writeText(prompt); setCopied(true); setTimeout(() => setCopied(false),2000); }}
            className="btn-ghost flex items-center gap-1.5 text-sm py-2 px-4">
            {copied ? <CheckCircle size={14} style={{ color: '#22c55e' }} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button onClick={() => setPrompt(DEFAULT)}
            className="flex items-center gap-1.5 text-sm py-2 px-4 rounded-xl ml-auto transition-colors"
            style={{ color: '#f87171', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)' }}>
            <RotateCcw size={13} />Reset
          </button>
        </div>
      </div>

      {/* Right: Ask AI panel (image 2 style input) */}
      <div className="flex flex-col gap-4">
        <div className="card p-5">
          <p className="text-sm font-semibold text-white mb-1">Ask AI</p>
          <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>Ask AI to improve your prompt</p>

          {/* Neumorphic input like image 2 */}
          <div className="relative mb-3">
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Ask me anything..."
              className="input-neo pr-12"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'var(--accent)' }}>
              <Send size={13} className="text-white" style={{ transform: 'rotate(45deg)' }} />
            </button>
          </div>

          <div className="space-y-2 mt-4">
            {['Make it sound more human','Make it shorter','Add better qualifying questions','Make it more aggressive'].map(s => (
              <button key={s} onClick={() => setQuery(s)}
                className="w-full text-left text-xs px-3 py-2 rounded-lg transition-colors"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border2)', color: 'var(--muted)' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(59,130,246,0.06)'; e.currentTarget.style.color='var(--text)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.color='var(--muted)'; }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <p className="text-sm font-semibold text-white mb-3">Prompt Stats</p>
          <div className="space-y-2.5">
            {[
              { label: 'Characters', value: prompt.length.toLocaleString() },
              { label: 'Words',      value: prompt.split(/\s+/).filter(Boolean).length },
              { label: 'Lines',      value: prompt.split('\n').length },
              { label: 'Version',   value: 'v4.0' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
                <span className="text-xs font-semibold text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
