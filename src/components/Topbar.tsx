import { Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import PeriodSelector from './PeriodSelector';

const pageTitles: Record<string, string> = {
  '/':              'Dashboard',
  '/metrics':       'Metrics',
  '/statistics':    'Statistics',
  '/conversations': 'Conversations',
  '/offers':        'Offers',
  '/setter':        'Setter',
  '/login':         'Login',
};

const PERIOD_PAGES = ['/', '/metrics', '/statistics', '/conversations'];

export default function Topbar() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ?? 'Dashboard';
  const showPeriod = PERIOD_PAGES.includes(pathname);

  return (
    <header
      className="fixed top-0 left-16 right-0 z-20 flex items-center justify-between px-7"
      style={{
        height: 60,
        background: 'rgba(6,8,20,0.92)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(99,102,241,0.1)',
      }}
    >
      {/* Left: title + period selector */}
      <div className="flex items-center gap-5">
        <h1 className="text-white font-semibold text-base tracking-tight">{title}</h1>
        {showPeriod && <PeriodSelector />}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-white/[0.06]"
          style={{ border: '1px solid rgba(99,102,241,0.15)' }}
        >
          <Bell size={15} style={{ color: 'var(--muted)' }} />
          <span
            className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
            style={{ background: '#6366f1' }}
          />
        </button>
        <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#2563eb)' }}
          >
            L
          </div>
          <div className="hidden sm:block">
            <p className="text-white text-sm font-semibold leading-none">leadity.io</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
