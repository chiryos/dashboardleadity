import { useState } from 'react';
import { Search, MessageSquare, Image, Video, Mic, X, MessageCircle, FileImage } from 'lucide-react';
import { usePeriod } from '../context/PeriodContext';
import { recentConversations } from '../data/mockData';

// ── Mock files per conversation ──────────────────────────────────────────────
type FileType = 'image' | 'video' | 'voice';
interface ConvFile { id: number; type: FileType; name: string; size: string; }

const mockFiles: Record<number, ConvFile[]> = {
  1: [
    { id: 1, type: 'image', name: 'screenshot.jpg', size: '284 KB' },
    { id: 2, type: 'image', name: 'proof.png',      size: '512 KB' },
    { id: 3, type: 'voice', name: 'voice_001.ogg',  size: '48 KB'  },
  ],
  2: [
    { id: 1, type: 'video', name: 'intro.mp4',      size: '3.2 MB' },
    { id: 2, type: 'image', name: 'results.jpg',    size: '198 KB' },
  ],
  3: [],
  4: [
    { id: 1, type: 'voice', name: 'voice_002.ogg',  size: '62 KB'  },
  ],
  5: [
    { id: 1, type: 'image', name: 'case_study.png', size: '740 KB' },
    { id: 2, type: 'image', name: 'metrics.png',    size: '320 KB' },
    { id: 3, type: 'video', name: 'demo.mp4',       size: '8.1 MB' },
    { id: 4, type: 'voice', name: 'voice_003.ogg',  size: '31 KB'  },
  ],
  6: [],
  7: [
    { id: 1, type: 'image', name: 'booking_conf.jpg', size: '145 KB' },
  ],
  8: [],
};

// ── Mock chat messages per conversation ──────────────────────────────────────
interface ConvMsg { id: number; role: 'lead' | 'bot'; text: string; time: string; }

const mockChats: Record<number, ConvMsg[]> = {
  1: [
    { id: 1, role: 'bot',  text: 'Hey! I saw you liked my post — are you looking to scale your agency right now? 👀', time: '10:02 AM' },
    { id: 2, role: 'lead', text: 'Yeah kind of. Depends on what you offer', time: '10:05 AM' },
    { id: 3, role: 'bot',  text: 'We help agencies add 3–5 qualified calls a week using AI DM automation. No cold outreach, just warm inbound. What\'s your current volume?', time: '10:06 AM' },
    { id: 4, role: 'lead', text: 'About 10-15k/month revenue right now', time: '10:09 AM' },
    { id: 5, role: 'bot',  text: 'Perfect. You\'re in the range where this works best. Are you free for a quick 20-min call this week?', time: '10:10 AM' },
    { id: 6, role: 'lead', text: 'Sure I can do Thursday afternoon', time: '10:12 AM' },
    { id: 7, role: 'bot',  text: 'Great! Here\'s the link to book: https://booking.leadity.io/ — pick whatever slot works best 🔥', time: '10:12 AM' },
  ],
  2: [
    { id: 1, role: 'bot',  text: 'Hey Sarah! Noticed you\'ve been posting a lot about growth lately — what\'s your biggest bottleneck right now?', time: '9:30 AM' },
    { id: 2, role: 'lead', text: 'Honestly lead gen. We get traffic but can\'t convert', time: '9:45 AM' },
    { id: 3, role: 'bot',  text: 'That\'s exactly what we fix. Our AI handles DM follow-ups automatically — clients see 3x more booked calls in 30 days. Want to see how it works?', time: '9:46 AM' },
    { id: 4, role: 'lead', text: 'That sounds interesting. What\'s the investment?', time: '9:55 AM' },
    { id: 5, role: 'bot',  text: 'It depends on your setup — best to go over it on a call. Are you free this week?', time: '9:56 AM' },
  ],
  3: [
    { id: 1, role: 'bot',  text: 'Hey Mike! Quick question — are you still looking to grow your consulting client base?', time: '2:10 PM' },
    { id: 2, role: 'lead', text: 'Maybe, what do you have in mind?', time: '2:34 PM' },
    { id: 3, role: 'bot',  text: 'We automate the entire DM-to-booking process with AI. Our clients typically book 15-20 extra calls per month. Is that something useful for you?', time: '2:35 PM' },
    { id: 4, role: 'lead', text: 'Sounds good but I\'m a bit busy right now', time: '2:50 PM' },
  ],
  4: [
    { id: 1, role: 'bot',  text: 'Hey! You commented on the post — want me to send you the full breakdown?', time: '11:00 AM' },
    { id: 2, role: 'lead', text: 'Yes please!', time: '11:02 AM' },
    { id: 3, role: 'bot',  text: 'Awesome! So basically we handle all your DM follow-ups using AI — you just show up to the calls. What does your current sales process look like?', time: '11:03 AM' },
    { id: 4, role: 'lead', text: 'I do it all manually right now, takes forever', time: '11:10 AM' },
    { id: 5, role: 'bot',  text: 'Exactly why clients love this. It saves 3–5 hours a day. What\'s your monthly revenue target?', time: '11:11 AM' },
    { id: 6, role: 'lead', text: 'I want to get to 30k/month', time: '11:15 AM' },
    { id: 7, role: 'bot',  text: 'That\'s very doable. Let\'s get on a call and I\'ll show you exactly how. Here\'s the booking link: https://booking.leadity.io/', time: '11:15 AM' },
    { id: 8, role: 'lead', text: 'I\'ll check my calendar and get back to you', time: '11:22 AM' },
  ],
  5: [
    { id: 1, role: 'bot',  text: 'Hey Jessica! Saw your reel — great content. Are you monetizing your audience yet?', time: '3:00 PM' },
    { id: 2, role: 'lead', text: 'Not really, I\'m still figuring out the business side', time: '3:15 PM' },
    { id: 3, role: 'bot',  text: 'Perfect timing then. We help creators turn their DMs into a booked calendar using AI. You just focus on content. Want to see?', time: '3:16 PM' },
    { id: 4, role: 'lead', text: 'How much does it cost?', time: '3:20 PM' },
    { id: 5, role: 'bot',  text: 'Depends on your goals — easier to go over on a call. It\'s free to chat. Are you free tomorrow?', time: '3:21 PM' },
    { id: 6, role: 'lead', text: 'Ok sure I can do tomorrow at 2pm', time: '3:25 PM' },
    { id: 7, role: 'bot',  text: 'Perfect! Book it here so it\'s official: https://booking.leadity.io/ 🎯', time: '3:25 PM' },
  ],
  6: [
    { id: 1, role: 'bot',  text: 'Hey Daniel! Quick one — what\'s the minimum you\'d need to see to consider a new tool for your team?', time: '8:00 AM' },
    { id: 2, role: 'lead', text: 'What is the minimum commitment?', time: '8:30 AM' },
    { id: 3, role: 'bot',  text: 'No long-term lock-in. Most clients start month-to-month and stay because of results. Want the details on a quick call?', time: '8:31 AM' },
  ],
  7: [
    { id: 1, role: 'bot',  text: 'Hey Emily! You came in from the comment — here\'s the quick breakdown as promised 👇', time: '7:00 AM' },
    { id: 2, role: 'lead', text: 'Thanks! This looks interesting', time: '7:05 AM' },
    { id: 3, role: 'bot',  text: 'Glad it resonates! Want to hop on a 20-min call to see if it fits your ops setup?', time: '7:06 AM' },
    { id: 4, role: 'lead', text: 'Sure! I\'m free tomorrow', time: '7:10 AM' },
    { id: 5, role: 'bot',  text: 'Awesome, grab a slot here: https://booking.leadity.io/', time: '7:10 AM' },
    { id: 6, role: 'lead', text: 'Booked! See you tomorrow.', time: '7:12 AM' },
  ],
  8: [
    { id: 1, role: 'bot',  text: 'Hey Ryan! We help SMBs automate lead follow-up with AI — saves 4+ hours a day. Worth a quick look?', time: '1:00 PM' },
    { id: 2, role: 'lead', text: 'Maybe later.', time: '2:30 PM' },
  ],
};

// ── Conversation data ─────────────────────────────────────────────────────────
const all = [
  ...recentConversations,
  { id: 6, username: '@daniel_cto', lastMessage: 'What is the minimum commitment?', timestamp: '5 hr ago', status: 'pending'   },
  { id: 7, username: '@emily_ops',  lastMessage: 'Booked! See you tomorrow.',        timestamp: '8 hr ago', status: 'completed' },
  { id: 8, username: '@ryan_smb',   lastMessage: 'Maybe later.',                     timestamp: '1 day ago',status: 'completed' },
];

const sStyle: Record<string, { color: string; bg: string }> = {
  active:    { color: '#22c55e', bg: 'rgba(34,197,94,0.1)'  },
  pending:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  completed: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
};

// Avatar color palette per lead
const avatarColors = ['#3b82f6','#8b5cf6','#06b6d4','#f59e0b','#ec4899','#10b981','#f97316','#6366f1'];
const getAvatarColor = (id: number) => avatarColors[(id - 1) % avatarColors.length];

// ── Files Modal ───────────────────────────────────────────────────────────────
const fileIcon = (type: FileType) => {
  if (type === 'image') return <Image size={18} style={{ color: '#60a5fa' }} />;
  if (type === 'video') return <Video size={18} style={{ color: '#a78bfa' }} />;
  return <Mic size={18} style={{ color: '#34d399' }} />;
};
const fileBg = (type: FileType) => {
  if (type === 'image') return 'rgba(59,130,246,0.12)';
  if (type === 'video') return 'rgba(139,92,246,0.12)';
  return 'rgba(52,211,153,0.12)';
};

function FilesModal({ conv, onClose }: { conv: typeof all[0]; onClose: () => void }) {
  const files = mockFiles[conv.id] ?? [];
  const avatarColor = getAvatarColor(conv.id);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="w-full max-w-sm mx-4 rounded-2xl overflow-hidden"
        style={{ background: '#0b0d1f', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 24px 64px rgba(0,0,0,0.7)' }}
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: avatarColor }}>
              {conv.username.charAt(1).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{conv.username}</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>{files.length} file{files.length !== 1 ? 's' : ''} shared</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: 'var(--muted)', background: 'rgba(255,255,255,0.05)' }}>
            <X size={13} />
          </button>
        </div>
        {/* Files list */}
        <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
          {files.length === 0 ? (
            <div className="py-10 flex flex-col items-center gap-2">
              <FileImage size={28} style={{ color: 'var(--dim)' }} />
              <p className="text-xs" style={{ color: 'var(--muted)' }}>No files in this conversation</p>
            </div>
          ) : files.map(f => (
            <div key={f.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
              style={{ background: fileBg(f.type), border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(0,0,0,0.2)' }}>
                {fileIcon(f.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{f.name}</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>{f.type} · {f.size}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Chat Modal ────────────────────────────────────────────────────────────────
function ChatModal({ conv, onClose }: { conv: typeof all[0]; onClose: () => void }) {
  const msgs = mockChats[conv.id] ?? [];
  const avatarColor = getAvatarColor(conv.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="w-full max-w-sm mx-4 rounded-2xl overflow-hidden flex flex-col"
        style={{ background: '#0b0d1f', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 24px 64px rgba(0,0,0,0.7)', maxHeight: '80vh' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(99,102,241,0.1)', background: 'rgba(99,102,241,0.04)' }}>
          <div className="flex items-center gap-3">
            {/* PFP */}
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                style={{ background: avatarColor, boxShadow: `0 2px 10px ${avatarColor}55` }}>
                {conv.username.charAt(1).toUpperCase()}
              </div>
              {conv.status === 'active' && (
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                  style={{ background: '#22c55e', borderColor: '#0b0d1f' }} />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{conv.username}</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>Conversation · read only</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ color: 'var(--muted)', background: 'rgba(255,255,255,0.05)' }}>
            <X size={13} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {msgs.length === 0 ? (
            <div className="py-10 flex flex-col items-center gap-2">
              <MessageCircle size={28} style={{ color: 'var(--dim)' }} />
              <p className="text-xs" style={{ color: 'var(--muted)' }}>No messages yet</p>
            </div>
          ) : msgs.map(m => (
            <div key={m.id} className={`flex items-end gap-2 ${m.role === 'lead' ? 'justify-start' : 'justify-end'}`}>
              {m.role === 'lead' && (
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mb-0.5"
                  style={{ background: avatarColor }}>
                  {conv.username.charAt(1).toUpperCase()}
                </div>
              )}
              <div className="max-w-[75%]">
                <div className="px-3 py-2 text-xs leading-relaxed"
                  style={{
                    background: m.role === 'lead' ? 'rgba(99,102,241,0.12)' : 'linear-gradient(135deg,#3b82f6,#6366f1)',
                    color: '#e2e5f7',
                    borderRadius: m.role === 'lead' ? '3px 12px 12px 12px' : '12px 3px 12px 12px',
                    boxShadow: m.role === 'bot' ? '0 2px 8px rgba(99,102,241,0.3)' : 'none',
                  }}>
                  {m.text}
                </div>
                <p className="text-xs mt-1 px-1" style={{ color: 'var(--dim)', textAlign: m.role === 'lead' ? 'left' : 'right' }}>{m.time}</p>
              </div>
              {m.role === 'bot' && (
                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mb-0.5"
                  style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Read-only footer */}
        <div className="px-4 py-3 flex-shrink-0 flex items-center justify-center gap-1.5"
          style={{ borderTop: '1px solid rgba(99,102,241,0.08)', background: 'rgba(0,0,0,0.2)' }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--dim)' }} />
          <p className="text-xs" style={{ color: 'var(--dim)' }}>Read-only — messages sent by automation</p>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Conversations() {
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');
  const [filesFor, setFilesFor] = useState<typeof all[0] | null>(null);
  const [chatFor,  setChatFor]  = useState<typeof all[0] | null>(null);
  const { period } = usePeriod();
  const scale = period.days / 30;

  const scaledTotal   = Math.max(1, Math.round(all.length * scale));
  const scaledActive  = Math.max(0, Math.round(all.filter(c => c.status === 'active').length  * scale));
  const scaledPending = Math.max(0, Math.round(all.filter(c => c.status === 'pending').length * scale));

  const filtered = all.filter(c => {
    const m = c.username.toLowerCase().includes(search.toLowerCase()) || c.lastMessage.toLowerCase().includes(search.toLowerCase());
    return m && (filter === 'all' || c.status === filter);
  });

  return (
    <div className="space-y-5">
      {filesFor && <FilesModal conv={filesFor} onClose={() => setFilesFor(null)} />}
      {chatFor  && <ChatModal  conv={chatFor}  onClose={() => setChatFor(null)}  />}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total',   value: scaledTotal,   color: 'var(--accent)', isTotal: true  },
          { label: 'Active',  value: scaledActive,  color: '#22c55e',       isTotal: false },
          { label: 'Pending', value: scaledPending, color: '#f59e0b',       isTotal: false },
        ].map(({ label, value, color, isTotal }) => (
          isTotal ? (
            <div key={label} className="card-blue p-4 flex items-center gap-3">
              <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: 'rgba(255,255,255,0.5)' }} />
              <div>
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{label} conversations</p>
              </div>
            </div>
          ) : (
            <div key={label} className="card p-4 flex items-center gap-3">
              <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: color }} />
              <div>
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>{label} conversations</p>
              </div>
            </div>
          )
        ))}
      </div>

      <div className="card p-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl"
            style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.13)' }}>
            <Search size={13} style={{ color: 'var(--muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: 'var(--text)' }} />
          </div>
          <div className="flex items-center gap-1.5">
            {['all','active','pending','completed'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                style={filter === f
                  ? { background: 'var(--accent)', color: '#fff' }
                  : { background: 'rgba(99,102,241,0.07)', color: 'var(--muted)', border: '1px solid rgba(99,102,241,0.15)' }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(99,102,241,0.1)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(99,102,241,0.05)' }}>
                {['Username','Last Message','Timestamp','Status','Files','Chat'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map(conv => {
                const s = sStyle[conv.status];
                const fileCount = (mockFiles[conv.id] ?? []).length;
                const avatarColor = getAvatarColor(conv.id);
                return (
                  <tr key={conv.id} className="transition-colors"
                    style={{ borderTop: '1px solid rgba(99,102,241,0.1)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: avatarColor }}>
                          {conv.username.charAt(1).toUpperCase()}
                        </div>
                        <span className="text-white font-medium text-sm">{conv.username}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3 max-w-xs">
                      <p className="truncate text-xs" style={{ color: 'var(--muted)' }}>{conv.lastMessage}</p>
                    </td>

                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted)' }}>{conv.timestamp}</td>

                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: s.bg, color: s.color }}>{conv.status}</span>
                    </td>

                    {/* Files */}
                    <td className="px-4 py-3">
                      <button onClick={() => setFilesFor(conv)}
                        className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                        style={{ background: fileCount > 0 ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,102,241,0.15)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = fileCount > 0 ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.04)'}>
                        <Image size={13} style={{ color: fileCount > 0 ? '#60a5fa' : 'var(--dim)' }} />
                        {fileCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center"
                            style={{ fontSize: 9, fontWeight: 700, background: '#3b82f6' }}>
                            {fileCount}
                          </span>
                        )}
                      </button>
                    </td>

                    {/* Chat */}
                    <td className="px-4 py-3">
                      <button onClick={() => setChatFor(conv)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)', color: '#fff', boxShadow: '0 2px 8px rgba(79,70,229,0.3)' }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(79,70,229,0.5)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(79,70,229,0.3)'}>
                        <MessageCircle size={11} />
                        Chat
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={6} className="px-4 py-12 text-center">
                  <MessageSquare size={28} className="mx-auto mb-2" style={{ color: 'var(--dim)' }} />
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>No conversations found</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
