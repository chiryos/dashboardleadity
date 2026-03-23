import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts';
import {
  TrendingUp, ArrowUpRight, RefreshCw, CheckSquare, Square, Zap,
} from 'lucide-react';
import { weeklyActivity, recentConversations } from '../data/mockData';
import { usePeriod } from '../context/PeriodContext';

// ── Pre-computed chart data ──────────────────────────────────────────────────
const DATA_1D = [
  { month: '8am',  botMessages: 4,  clientMessages: 2  },
  { month: '9am',  botMessages: 7,  clientMessages: 3  },
  { month: '11am', botMessages: 12, clientMessages: 5  },
  { month: '1pm',  botMessages: 18, clientMessages: 8  },
  { month: '3pm',  botMessages: 24, clientMessages: 10 },
  { month: '5pm',  botMessages: 16, clientMessages: 7  },
  { month: '7pm',  botMessages: 9,  clientMessages: 4  },
];
const DATA_7D = [
  { month: 'Mon', botMessages: 28, clientMessages: 11 },
  { month: 'Tue', botMessages: 35, clientMessages: 14 },
  { month: 'Wed', botMessages: 22, clientMessages: 9  },
  { month: 'Thu', botMessages: 41, clientMessages: 17 },
  { month: 'Fri', botMessages: 38, clientMessages: 15 },
  { month: 'Sat', botMessages: 18, clientMessages: 7  },
  { month: 'Sun', botMessages: 24, clientMessages: 10 },
];
const DATA_30D = [
  { month: 'Oct', botMessages: 62,  clientMessages: 28 },
  { month: 'Nov', botMessages: 75,  clientMessages: 33 },
  { month: 'Dec', botMessages: 68,  clientMessages: 29 },
  { month: 'Jan', botMessages: 91,  clientMessages: 40 },
  { month: 'Feb', botMessages: 110, clientMessages: 47 },
  { month: 'Mar', botMessages: 124, clientMessages: 54 },
];

const statusStyle: Record<string, { color: string; bg: string }> = {
  active:    { color: '#22c55e', bg: 'rgba(34,197,94,0.12)'   },
  pending:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  completed: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
};

const quickActions = [
  { label: 'Bot automation active',    done: true  },
  { label: 'Follow up messages ready', done: true  },
  { label: 'AI prompt configured',     done: true  },
  { label: 'Appointment link added',   done: false },
];

const ChartTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0b0d1f', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, padding: '8px 12px', fontSize: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
      <p style={{ color: 'var(--muted)', marginBottom: 4 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color || 'var(--accent)', fontWeight: 600 }}>
          {p.name}: <span style={{ color: '#fff' }}>{p.value}</span>
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { period } = usePeriod();

  const scale = period.days / 30;
  const totalMessages = Math.max(1, Math.round(218 * scale));
  const conversations  = Math.max(0, Math.round(13  * scale));
  const followUps      = Math.max(0, Math.round(26  * scale));
  const clientMsgs     = Math.max(0, Math.round(68  * scale));
  const pctChange      = period.days <= 1 ? 1.2 : period.days <= 7 ? 3.5 : period.days <= 30 ? 8.5 : 18.2;

  const periodLabel =
    period.label.includes('–') ? period.label :
    period.label === '1D'  ? `Today, ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` :
    period.label === '7D'  ? 'Last 7 days' :
    period.label === '30D' ? new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) :
    `Last ${period.days} days`;

  const chartData = period.days <= 1 ? DATA_1D : period.days <= 7 ? DATA_7D : DATA_30D;

  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 300px' }}>

      {/* ── LEFT ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5">

        {/* Chart card — header inside */}
        <div className="card p-5" style={{ paddingBottom: 16 }}>
          <div className="mb-1">
            <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>Total Messages</p>
            <div className="flex items-end gap-3">
              <p className="text-4xl font-extrabold text-white tracking-tight">{totalMessages}</p>
              <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1 mb-1">
                <TrendingUp size={14} />+{pctChange}%
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{periodLabel}</p>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gBot" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="gInd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.07)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} cursor={{ stroke: 'rgba(99,102,241,0.2)', strokeWidth: 1 }} />
              <Area type="monotone" dataKey="botMessages" name="Bot Messages"
                stroke="#3b82f6" strokeWidth={2} fill="url(#gBot)" dot={false}
                activeDot={{ r: 5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
              <Area type="monotone" dataKey="clientMessages" name="Client Messages"
                stroke="#6366f1" strokeWidth={1.5} fill="url(#gInd)" dot={false}
                activeDot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 mt-2 px-1">
            {[{ label: 'Bot Messages', color: '#3b82f6' }, { label: 'Client Messages', color: '#6366f1' }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-5 h-0.5 rounded-full" style={{ background: l.color }} />
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4-stat row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Conversations', value: String(conversations) },
            { label: 'Followers',     value: '602'                 },
            { label: 'Follow Ups',    value: String(followUps)     },
            { label: 'Client Msgs',   value: String(clientMsgs)    },
          ].map(({ label, value }) => (
            <div key={label} className="card-stat p-4">
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>{label}</p>
              <p className="text-xl font-extrabold text-white">{value}</p>
              <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-400 mt-1">
                <ArrowUpRight size={11} />+{pctChange}%
              </span>
            </div>
          ))}
        </div>

        {/* Bottom 2-col */}
        <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1.4fr' }}>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-white">System Status</p>
              <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#22c55e' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                Active
              </span>
            </div>
            <div className="space-y-3">
              {quickActions.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  {item.done
                    ? <CheckSquare size={14} style={{ color: '#6366f1', flexShrink: 0 }} />
                    : <Square size={14} style={{ color: 'var(--muted)', flexShrink: 0 }} />}
                  <span className="text-xs" style={{ color: item.done ? 'var(--text)' : 'var(--muted)' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <button className="btn-blue w-full mt-5 text-sm py-2.5 rounded-xl">Configure Bot</button>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-white">Recent Conversations</p>
              <select className="text-xs px-2 py-1 rounded-lg"
                style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', color: 'var(--muted)' }}>
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="space-y-3">
              {recentConversations.slice(0, 4).map(conv => {
                const s = statusStyle[conv.status];
                return (
                  <div key={conv.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(59,130,246,0.3))' }}>
                        {conv.username.charAt(1).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white leading-none">{conv.username}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{conv.timestamp}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{ background: s.bg, color: s.color }}>{conv.status}</span>
                  </div>
                );
              })}
            </div>
            <button className="w-full mt-4 text-xs font-medium py-2 rounded-lg"
              style={{ background: 'rgba(99,102,241,0.06)', color: 'var(--muted)', border: '1px solid rgba(99,102,241,0.12)' }}>
              See more →
            </button>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="card-blue p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>Total Followers</p>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
              <Zap size={13} className="text-white" />
            </div>
          </div>
          <div className="flex items-end justify-between mt-1">
            <p className="text-3xl font-extrabold text-white tracking-tight">602</p>
            <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
              <TrendingUp size={11} />+3.8%
            </span>
          </div>
          <div className="mt-4 pt-4 space-y-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {[
              { label: 'Bot Messages',    value: String(Math.round(124 * scale)) },
              { label: 'Client Messages', value: String(clientMsgs) },
              { label: 'Follow Ups',      value: String(followUps)  },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
                <span className="text-xs font-bold text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-white">Weekly Activity</p>
            <RefreshCw size={13} style={{ color: 'var(--muted)', cursor: 'pointer' }} />
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={weeklyActivity} barSize={10} barCategoryGap="35%">
              <defs>
                <linearGradient id="barG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#6366f1" stopOpacity={1}   />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
              <Bar dataKey="messages" name="Messages" fill="url(#barG)" radius={[4,4,0,0]}>
                {weeklyActivity.map((_: any, i: number) => (
                  <Cell key={i} fill={i === 4 ? '#3b82f6' : 'url(#barG)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge-core">Core</span>
            <p className="text-sm font-semibold text-white">AI Tips</p>
          </div>
          <div className="space-y-3">
            {[
              'Send follow-ups between 2–5 PM for highest response rates.',
              'Leads who reply within 5 min convert 3× more to calls.',
              'Keep your AI prompt under 500 words for best performance.',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--indigo)' }} />
                <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card-navy p-5">
          <p className="text-sm font-bold text-white mb-1">Pro Active</p>
          <p className="text-xs mb-4" style={{ color: 'rgba(180,185,230,0.55)' }}>
            Your bot is running and healthy. 73% capacity used.
          </p>
          <div className="w-full h-1 rounded-full mb-4" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-1 rounded-full" style={{ width: '73%', background: 'linear-gradient(90deg,#6366f1,#3b82f6)' }} />
          </div>
          <button className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
