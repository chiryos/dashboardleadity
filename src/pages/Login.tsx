import { useState } from 'react';
import { Eye, EyeOff, Zap } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--bg)' }}>

      {/* Ambient glows */}
      <div style={{
        position: 'absolute', top: '15%', left: '20%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '15%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '55%', left: '55%',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        width: 400,
        background: 'linear-gradient(rgba(15,16,25,0.85), rgba(13,14,24,0.9)) padding-box, linear-gradient(135deg, rgba(99,102,241,0.6), rgba(59,130,246,0.4), rgba(34,211,238,0.5), rgba(52,211,153,0.3), rgba(99,102,241,0.5)) border-box',
        border: '1px solid transparent',
        borderRadius: 24,
        padding: '40px 36px',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg, #6366f1, #3b82f6)', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}>
            <Zap size={22} className="text-white" fill="white" />
          </div>
          <p className="text-xl font-bold text-white tracking-tight">Welcome back</p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Sign in to your Leadity account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Email address
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full outline-none text-sm"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: '11px 14px',
                color: 'var(--text)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)';
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Password</label>
              <button type="button" className="text-xs transition-colors"
                style={{ color: 'var(--accent)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#60a5fa'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--accent)'}>
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full outline-none text-sm pr-10"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  padding: '11px 14px',
                  color: 'var(--text)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--muted)' }}>
                {show ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button type="submit"
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all mt-2"
            style={{
              background: loading
                ? 'rgba(99,102,241,0.5)'
                : 'linear-gradient(135deg, #6366f1, #3b82f6)',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.3)',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 6px 28px rgba(99,102,241,0.45)'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.3)'; }}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <span className="text-xs" style={{ color: 'var(--dim)' }}>or</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* Social */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'Google', icon: (
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )},
            { name: 'Instagram', icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f09433"/>
                    <stop offset="25%" stopColor="#e6683c"/>
                    <stop offset="50%" stopColor="#dc2743"/>
                    <stop offset="75%" stopColor="#cc2366"/>
                    <stop offset="100%" stopColor="#bc1888"/>
                  </linearGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#ig)" strokeWidth="2"/>
                <circle cx="12" cy="12" r="4" stroke="url(#ig)" strokeWidth="2"/>
                <circle cx="17.5" cy="6.5" r="1" fill="url(#ig)"/>
              </svg>
            )},
          ].map(({ name, icon }) => (
            <button key={name}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: 'var(--text)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
              {icon} {name}
            </button>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-6" style={{ color: 'var(--dim)' }}>
          Don't have an account?{' '}
          <span className="cursor-pointer transition-colors" style={{ color: 'var(--accent)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#60a5fa'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--accent)'}>
            Contact us
          </span>
        </p>
      </div>
    </div>
  );
}
