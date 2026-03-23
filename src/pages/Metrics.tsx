import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadialBarChart, RadialBar,
} from 'recharts';
import { TrendingUp, MessageSquare, Users, Zap, ArrowUpRight } from 'lucide-react';
import { responseRateData, weeklyActivity } from '../data/mockData';
import { usePeriod } from '../context/PeriodContext';

const Tip = ({ active, payload, label }: any) => {
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


const radialData = [
  { name: 'Response Rate', value: 87, fill: '#3b82f6' },
  { name: 'Conversion',    value: 64, fill: '#6366f1' },
  { name: 'Engagement',   value: 73, fill: '#8b5cf6'  },
];

export default function Metrics() {
  const { period } = usePeriod();
  const scale = period.days / 30;

  // Scale new-leads-per-day card; rates/averages stay constant
  const dynamicCards = [
    { label: 'Avg Response Time', value: '1.4 min', sub: 'from first message',                icon: Zap,          change: '-12%',  up: true  },
    { label: 'Engagement Rate',   value: `${Math.min(99, Math.round(73 * (1 + (scale - 1) * 0.05)))}%`, sub: 'of new leads replied', icon: MessageSquare, change: '+5.2%', up: true },
    { label: 'Lead Quality',      value: '8.4/10',  sub: 'avg qualification score',            icon: TrendingUp,   change: '+0.3',  up: true  },
    { label: 'New Leads / Day',   value: `${(4.3 * (period.days <= 1 ? 1 : period.days <= 7 ? 0.9 : 1)).toFixed(1)}`, sub: `daily avg · last ${period.label}`, icon: Users, change: '+18%', up: true },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        {dynamicCards.map(({ label, value, sub, icon: Icon, change, up }) => (
          <div key={label} className="card-stat p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(99,102,241,0.14)' }}>
                <Icon size={16} style={{ color: '#818cf8' }} />
              </div>
              <span className={`text-xs font-semibold flex items-center gap-0.5 ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                <ArrowUpRight size={11} />{change}
              </span>
            </div>
            <p className="text-xl font-bold text-white">{value}</p>
            <p className="text-xs font-medium mt-0.5 text-white/70">{label}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 280px' }}>
        <div className="card p-6">
          <div className="mb-5">
            <p className="text-sm font-semibold text-white">Response Rate by Hour</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Lead response likelihood throughout the day</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={responseRateData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.07)" />
              <XAxis dataKey="hour" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<Tip />} />
              <Line type="monotone" dataKey="rate" name="Response Rate" stroke="var(--accent)" strokeWidth={2}
                dot={{ fill: 'var(--accent)', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#fff', stroke: 'var(--accent)', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <p className="text-sm font-semibold text-white mb-1">Performance</p>
          <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>Key KPI scores</p>
          <ResponsiveContainer width="100%" height={160}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="25%" outerRadius="90%" data={radialData} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={4} background={{ fill: 'rgba(255,255,255,0.03)' }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="space-y-2.5 mt-2">
            {radialData.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.fill }} />
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>{item.name}</span>
                </div>
                <span className="text-sm font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="mb-5">
          <p className="text-sm font-semibold text-white">Weekly Performance Breakdown</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Conversations and messages per day this week</p>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyActivity} barSize={18} barCategoryGap="35%" margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.07)" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<Tip />} />
            <Bar dataKey="messages" name="Messages" fill="#3b82f6" radius={[5,5,0,0]} opacity={0.9} />
            <Bar dataKey="conversations" name="Conversations" fill="rgba(99,102,241,0.55)" radius={[5,5,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
