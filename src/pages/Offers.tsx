import { useState } from 'react';
import { Plus, Trash2, ExternalLink, Calendar } from 'lucide-react';

interface Appt { id: number; name: string; link: string; description: string; }

const init: Appt[] = [
  { id: 1, name: 'Strategy Call', link: 'https://booking.leadity.io/strategy', description: 'Free 30-min strategy session' },
  { id: 2, name: 'Demo Call',     link: 'https://booking.leadity.io/demo',     description: 'Product demo walkthrough'   },
];

const I = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
  borderRadius: 10, color: 'var(--text)', fontSize: 14, outline: 'none', padding: '10px 14px', width: '100%',
} as const;

export default function Offers() {
  const [appts, setAppts] = useState<Appt[]>(init);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name:'', link:'', description:'' });
  const [editId, setEditId] = useState<number|null>(null);

  const save = () => {
    if (!form.name || !form.link) return;
    if (editId!==null) { setAppts(prev => prev.map(a => a.id===editId ? {...a,...form} : a)); setEditId(null); }
    else setAppts(prev => [...prev, { id: Date.now(), ...form }]);
    setForm({ name:'',link:'',description:'' }); setOpen(false);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold text-white">Appointments</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Booking links sent by the AI setter</p>
          </div>
          <button onClick={() => { setOpen(!open); setEditId(null); setForm({name:'',link:'',description:''}); }}
            className="btn-blue flex items-center gap-2 text-sm py-2 px-4">
            <Plus size={14} />Add Appointment
          </button>
        </div>

        {open && (
          <div className="rounded-xl p-5 mb-5 space-y-4"
            style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <p className="text-sm font-semibold text-white">{editId!==null ? 'Edit' : 'New'} Appointment</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--muted)' }}>Name</label>
                <input value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="Strategy Call" style={I} />
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--muted)' }}>Link</label>
                <input value={form.link} onChange={e => setForm({...form,link:e.target.value})} placeholder="https://booking..." style={I} />
              </div>
            </div>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--muted)' }}>Description</label>
              <input value={form.description} onChange={e => setForm({...form,description:e.target.value})} placeholder="Short description..." style={I} />
            </div>
            <div className="flex gap-2">
              <button onClick={save} className="btn-blue text-sm py-2 px-5">{editId!==null ? 'Save' : 'Add'}</button>
              <button onClick={() => { setOpen(false); setEditId(null); }} className="btn-ghost text-sm py-2 px-5">Cancel</button>
            </div>
          </div>
        )}

        {appts.length === 0 ? (
          <div className="text-center py-14">
            <Calendar size={32} className="mx-auto mb-3" style={{ color: 'var(--dim)' }} />
            <p className="text-sm" style={{ color: 'var(--muted)' }}>No appointments yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {appts.map(a => (
              <div key={a.id} className="card2 p-4 group hover:border-blue-500/20 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(59,130,246,0.12)' }}>
                      <Calendar size={13} style={{ color: 'var(--accent)' }} />
                    </div>
                    <p className="text-white font-semibold text-sm">{a.name}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setForm({name:a.name,link:a.link,description:a.description}); setEditId(a.id); setOpen(true); }}
                      className="px-2 py-1 rounded text-xs hover:bg-white/10 transition-colors" style={{ color: 'var(--muted)' }}>Edit</button>
                    <button onClick={() => setAppts(p => p.filter(x => x.id!==a.id))}
                      className="p-1 rounded hover:bg-red-500/10 transition-colors">
                      <Trash2 size={12} style={{ color: '#f87171' }} />
                    </button>
                  </div>
                </div>
                <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>{a.description}</p>
                <a href={a.link} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1 text-xs hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--accent)' }}>
                  <ExternalLink size={10} /><span className="truncate">{a.link}</span>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
