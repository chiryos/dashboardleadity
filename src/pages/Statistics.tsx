import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { appointmentsData } from '../data/mockData';
import { usePeriod } from '../context/PeriodContext';

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0b0d1f', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, padding: '8px 12px', fontSize: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
      <p style={{ color: 'var(--muted)', marginBottom: 4 }}>{label}</p>
      {payload.map((p: any) => <p key={p.dataKey} style={{ color: p.color || 'var(--accent)', fontWeight: 600 }}>{p.name}: <span style={{ color: '#fff' }}>{p.value}</span></p>)}
    </div>
  );
};

const daily = [
  { day: 'Mon', booked: 2, noShow: 1 }, { day: 'Tue', booked: 4, noShow: 0 },
  { day: 'Wed', booked: 1, noShow: 2 }, { day: 'Thu', booked: 5, noShow: 1 },
  { day: 'Fri', booked: 3, noShow: 0 }, { day: 'Sat', booked: 0, noShow: 0 },
  { day: 'Sun', booked: 1, noShow: 0 },
];

export default function Statistics() {
  const { period } = usePeriod();
  const scale = period.days / 30;

  const stats = [
    { label: 'Total Appointments', value: String(Math.max(0, Math.round(16 * scale))), icon: Calendar    },
    { label: 'Conversion Rate',    value: '0%',                                          icon: TrendingUp  },
    { label: 'Completed Calls',    value: String(Math.max(0, Math.round(11 * scale))),   icon: CheckCircle },
    { label: 'Avg Time to Book',   value: '—',                                           icon: Clock       },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card-stat p-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(99,102,241,0.14)' }}>
              <Icon size={16} style={{ color: '#818cf8' }} />
            </div>
            <p className="text-xl font-bold text-white">{value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <div className="mb-5">
          <p className="text-sm font-semibold text-white">Appointments This Week</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Booked vs no-show</p>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={daily} barSize={18} barCategoryGap="35%" margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.07)" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<Tip />} />
            <Bar dataKey="booked"  name="Booked"  fill="#3b82f6"                  radius={[5,5,0,0]} opacity={0.9} />
            <Bar dataKey="noShow"  name="No Show" fill="rgba(239,68,68,0.5)"      radius={[5,5,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card p-6">
        <p className="text-sm font-semibold text-white mb-5">Recent Appointments</p>
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(99,102,241,0.1)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(99,102,241,0.05)' }}>
                {['Appointment Name','Link','Description','Date'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appointmentsData.map((a, i) => (
                <tr key={a.id} style={{ borderTop: '1px solid rgba(99,102,241,0.07)', background: i%2===0 ? 'transparent' : 'rgba(99,102,241,0.03)' }}>
                  <td className="px-4 py-3 text-white font-medium text-sm">{a.name}</td>
                  <td className="px-4 py-3"><a href={a.link} className="text-blue-400 text-xs hover:text-blue-300 truncate block max-w-48">{a.link}</a></td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted)' }}>{a.description}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted)' }}>{a.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
