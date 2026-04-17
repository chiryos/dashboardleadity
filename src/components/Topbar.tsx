import { Bell, Sun, Moon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import PeriodSelector from './PeriodSelector';
import { useThemeMode } from '../context/ThemeContext';

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
  const { mode, toggle } = useThemeMode();
  const title = pageTitles[pathname] ?? 'Dashboard';
  const showPeriod = PERIOD_PAGES.includes(pathname);
  const isLight = mode === 'light';

  return (
    <header
      className="fixed top-0 left-16 right-0 z-20 flex items-center justify-between px-7"
      style={{
        height: 60,
        background: isLight ? 'rgba(248,249,255,0.92)' : 'rgba(6,8,20,0.92)',
        backdropFilter: 'blur(24px)',
        borderBottom: isLight
          ? '1px solid rgba(99,102,241,0.12)'
          : '1px solid rgba(99,102,241,0.1)',
      }}
    >
      {/* Left: title + period selector */}
      <div className="flex items-center gap-5">
        <h1 className="font-semibold text-base tracking-tight" style={{ color: 'var(--text)' }}>{title}</h1>
        {showPeriod && <PeriodSelector />}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{
            border: '1px solid rgba(99,102,241,0.15)',
            background: isLight ? 'rgba(99,102,241,0.06)' : 'transparent',
          }}
          title={isLight ? 'Switch to dark' : 'Switch to light'}
        >
          {isLight
            ? <Moon size={15} style={{ color: '#6366f1' }} />
            : <Sun  size={15} style={{ color: '#f59e0b' }} />
          }
        </button>

        <button
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{ border: '1px solid rgba(99,102,241,0.15)' }}
        >
          <Bell size={15} style={{ color: 'var(--muted)' }} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ background: '#6366f1' }} />
        </button>

        <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />

        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#2563eb)' }}>
            L
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-none" style={{ color: 'var(--text)' }}>leadity.io</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
