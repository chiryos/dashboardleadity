import { useState } from 'react';
import { Save, CheckCircle, X, Plus } from 'lucide-react';

const automations = [
  'Comments Reply','Comments Reply Always','Polite Automation','Follow Ups',
  'Like Attachments','Typing & Message Seen','Like End Messages','Capital Notification','New Lead Notification',
];

const I = {
  background:'rgba(99,102,241,0.05)', border:'1px solid rgba(99,102,241,0.15)',
  borderRadius:10, color:'var(--text)', fontSize:14, outline:'none', padding:'10px 14px', width:'100%',
} as const;

const Tog = ({ on, toggle }: { on: boolean; toggle: () => void }) => (
  <button onClick={toggle} className="tog" style={{ background: on ? 'var(--accent)' : 'rgba(255,255,255,0.1)' }}>
    <span className="tog-knob" style={{ left: on ? 21 : 3 }} />
  </button>
);

const Slide = ({ label, value, min, max, unit, onChange }: any) => (
  <div>
    <div className="flex justify-between mb-1.5">
      <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
      <span className="text-xs font-semibold text-white">{value}{unit}</span>
    </div>
    <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))}
      className="w-full cursor-pointer" style={{ accentColor: 'var(--accent)', height: 3 }} />
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="card p-6">
    <p className="text-sm font-semibold text-white mb-5">{title}</p>
    <div className="space-y-4">{children}</div>
  </div>
);

const Label = ({ children }: { children: string }) => (
  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>{children}</label>
);

export default function Settings() {
  const [kws, setKws] = useState(['test','info','dm']);
  const [kwi, setKwi] = useState('');
  const [qa, setQa] = useState('1000');
  const [wt, setWt] = useState('30');
  const [at, setAt] = useState('Appointments');
  const [la, setLa] = useState(50);
  const [ll, setLl] = useState(50);
  const [ts, setTs] = useState(140);
  const [sw, setSw] = useState(2);
  const [ma, setMa] = useState(true);
  const [autos, setAutos] = useState(Object.fromEntries(automations.map(k => [k, true])));
  const [ca, setCa] = useState("Yes I'm Leadity. What are you currently selling?");
  const [pr, setPr] = useState(['You just texted you! 🎯','I sent you a DM brotha 💪',"Check your DM's FAST!"]);
  const [fus, setFus] = useState([{h:'',m:''},{h:'',m:''},{h:'',m:''}]);
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-4 max-w-2xl">
      <Section title="General">
        <div>
          <Label>Keywords</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {kws.map((k,i) => (
              <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium"
                style={{ background:'rgba(59,130,246,0.1)', color:'var(--accent)', border:'1px solid rgba(59,130,246,0.2)' }}>
                {k}<button onClick={() => setKws(kws.filter((_,j) => j!==i))}><X size={10}/></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={kwi} onChange={e=>setKwi(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter'&&kwi.trim()){setKws([...kws,kwi.trim()]);setKwi(''); }}}
              placeholder="Type and press Enter..." style={{...I,flex:1}} />
            <button onClick={()=>{ if(kwi.trim()){setKws([...kws,kwi.trim()]);setKwi(''); }}}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background:'rgba(59,130,246,0.12)', color:'var(--accent)' }}>
              <Plus size={14}/>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div><Label>Qualify Amount ($)</Label><input type="number" value={qa} onChange={e=>setQa(e.target.value)} style={I}/></div>
          <div>
            <Label>Wait Time (seconds)</Label>
            <input type="number" value={wt} onChange={e=>setWt(e.target.value)} style={I}/>
            <p className="text-xs mt-1" style={{color:'var(--dim)'}}>10 – 300 seconds</p>
          </div>
        </div>

        <div>
          <Label>Account Type</Label>
          <select value={at} onChange={e=>setAt(e.target.value)} style={{...I,background:'rgba(99,102,241,0.05)'}}>
            {['Appointments','E-commerce','Agency'].map(o=><option key={o} value={o} style={{background:'#111220'}}>{o}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Slide label="Like Attachment %" value={la} min={0} max={100} unit="%" onChange={setLa}/>
          <Slide label="Like Last Message %" value={ll} min={0} max={100} unit="%" onChange={setLl}/>
        </div>
        <Slide label="Bot Typing Speed" value={ts} min={50} max={300} unit=" wpm" onChange={setTs}/>
        <Slide label="Seen Wait Time" value={sw} min={1} max={10} unit="s" onChange={setSw}/>
      </Section>

      <Section title="Automations">
        <div className="flex items-center justify-between pb-3" style={{ borderBottom:'1px solid rgba(99,102,241,0.1)' }}>
          <span className="text-xs" style={{color:'var(--muted)'}}>Messages Automation</span>
          <Tog on={ma} toggle={()=>setMa(!ma)}/>
        </div>
        <div className="space-y-1">
          {automations.map(label => (
            <div key={label} className="flex items-center justify-between px-3 py-2.5 rounded-lg"
              style={{background:'rgba(99,102,241,0.04)', border:'1px solid rgba(99,102,241,0.1)'}}>
              <span className="text-xs" style={{color:'var(--text)' }}>{label}</span>
              <Tog on={autos[label]} toggle={()=>setAutos(p=>({...p,[label]:!p[label]}))}/>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Comments">
        <div>
          <Label>Keywords</Label>
          <div className="flex flex-wrap gap-2">
            {kws.map((k,i)=>(<span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{background:'rgba(59,130,246,0.1)',color:'var(--accent)',border:'1px solid rgba(59,130,246,0.2)'}}>{k}</span>))}
          </div>
        </div>
        <div>
          <Label>Comment Answer (DM)</Label>
          <textarea value={ca} onChange={e=>setCa(e.target.value)} rows={3} className="w-full outline-none resize-none" style={{...I,padding:'10px 14px'}}/>
        </div>
        <div>
          <Label>Public Replies</Label>
          <div className="flex flex-wrap gap-2">
            {pr.map((r,i)=>(
              <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium"
                style={{background:'rgba(59,130,246,0.1)',color:'var(--accent)',border:'1px solid rgba(59,130,246,0.2)'}}>
                {r}<button onClick={()=>setPr(pr.filter((_,j)=>j!==i))}><X size={10}/></button>
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Follow Ups">
        {fus.map((fu,i)=>(
          <div key={i} className="rounded-xl p-4" style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(99,102,241,0.1)'}}>
            <p className="text-xs font-medium mb-3" style={{color:'var(--muted)'}}>Follow Up {i+1}</p>
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-1">
                <Label>Hours</Label>
                <input type="number" value={fu.h} onChange={e=>{const n=[...fus];n[i].h=e.target.value;setFus(n);}} placeholder="24" style={I}/>
              </div>
              <div className="col-span-3">
                <Label>Message</Label>
                <input value={fu.m} onChange={e=>{const n=[...fus];n[i].m=e.target.value;setFus(n);}} placeholder="Follow-up message..." style={I}/>
              </div>
            </div>
          </div>
        ))}
      </Section>

      <div className="flex items-center gap-3 pb-6">
        <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2500);}}
          className="btn-blue flex items-center gap-2 text-sm py-2.5 px-6">
          {saved?<CheckCircle size={14}/>:<Save size={14}/>}
          {saved?'Saved!':'Save Settings'}
        </button>
        <button className="btn-ghost text-sm py-2.5 px-5">Change Password</button>
      </div>
    </div>
  );
}
