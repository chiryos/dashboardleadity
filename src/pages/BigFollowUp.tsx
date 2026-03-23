import { useState } from 'react';
import { Send, CheckCircle, Info } from 'lucide-react';

export default function BigFollowUp() {
  const [messages, setMessages] = useState<string[]>(Array(10).fill(''));
  const [sent, setSent] = useState(false);

  const change = (i: number, v: string) => { const n = [...messages]; n[i] = v; setMessages(n); };
  const filled = messages.filter(m => m.trim().length >= 30).length;

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Info */}
      <div className="rounded-xl p-4 flex gap-3"
        style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
        <Info size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }} />
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          Provide <strong className="text-white">10 unique messages</strong> (min 30 chars each) to send personalized follow-ups. Batches run every <strong className="text-white">72 hours</strong>. Min 30 / Max 250 characters.
        </p>
      </div>

      {/* Progress */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-sm font-semibold text-white">{filled}/10 messages ready</span>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>{messages.reduce((s,m) => s+m.length,0)} chars total</span>
        </div>
        <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <div className="h-1.5 rounded-full transition-all"
            style={{ width: `${(filled/10)*100}%`, background: filled===10 ? '#22c55e' : 'var(--accent)' }} />
        </div>
      </div>

      {/* Messages */}
      <div className="grid grid-cols-2 gap-4">
        {messages.map((msg, i) => {
          const len = msg.length;
          const valid = len >= 30 && len <= 250;
          const empty = len === 0;
          const over = len > 250;
          return (
            <div key={i} className="card p-4 transition-all"
              style={{ borderColor: !empty && !valid ? 'rgba(239,68,68,0.3)' : valid ? 'rgba(59,130,246,0.3)' : 'var(--border)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Message {i+1}</span>
                <div className="flex items-center gap-1.5">
                  {valid && <CheckCircle size={11} style={{ color: '#22c55e' }} />}
                  <span className="text-xs" style={{ color: over ? '#f87171' : 'var(--muted)' }}>{len}/250</span>
                </div>
              </div>
              <textarea value={msg} onChange={e => change(i, e.target.value)}
                placeholder={`Write message ${i+1}...`} rows={4}
                className="w-full bg-transparent text-sm outline-none resize-none"
                style={{ color: 'var(--text)', caretColor: 'var(--accent)' }} />
              {!empty && len < 30 && <p className="text-xs mt-1" style={{ color: '#f87171' }}>Need {30-len} more chars</p>}
            </div>
          );
        })}
      </div>

      {/* Send */}
      <div className="flex items-center gap-3">
        <button onClick={() => { setSent(true); setTimeout(() => setSent(false), 3000); }}
          disabled={filled < 10}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: filled===10 ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
            color: filled===10 ? '#fff' : 'var(--muted)',
            cursor: filled===10 ? 'pointer' : 'not-allowed',
          }}>
          <Send size={14} />
          {sent ? 'Sent!' : 'Send Follow Up'}
        </button>
        {sent && <p className="text-xs text-emerald-400">Batch sent successfully!</p>}
      </div>
    </div>
  );
}
