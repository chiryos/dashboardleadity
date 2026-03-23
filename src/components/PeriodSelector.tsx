import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePeriod } from '../context/PeriodContext';

const REG_DATE = new Date('2025-09-01');

// ── Date Range Picker ─────────────────────────────────────────────────────────
const DateRangePicker = ({
  regDate,
  onSelect,
}: {
  regDate: Date;
  onSelect: (label: string, days: number) => void;
}) => {
  const today = new Date();
  const daysSinceReg = Math.floor((today.getTime() - regDate.getTime()) / 86400000);
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // Presets — 360D removed
  const PRESETS = [
    { label: '1D',  days: 1  },
    { label: '7D',  days: 7  },
    { label: '30D', days: 30 },
    { label: '90D', days: 90 },
  ];

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const effectiveEnd = endDate ?? hoverDate;
  const getRangeFrom = () => {
    if (!startDate || !effectiveEnd) return null;
    return startDate <= effectiveEnd ? startDate : effectiveEnd;
  };
  const getRangeTo = () => {
    if (!startDate || !effectiveEnd) return null;
    return startDate <= effectiveEnd ? effectiveEnd : startDate;
  };
  const isRangeFrom = (d: Date) => getRangeFrom()?.toDateString() === d.toDateString();
  const isRangeTo   = (d: Date) => getRangeTo()?.toDateString()   === d.toDateString();
  const isInRange   = (d: Date) => {
    const from = getRangeFrom(); const to = getRangeTo();
    return !!from && !!to && d > from && d < to;
  };
  const isDisabled    = (d: Date) => d < regDate || d > today;
  const isTodayDate   = (d: Date) => d.toDateString() === today.toDateString();

  const handleClick = (d: Date) => {
    if (isDisabled(d)) return;
    if (!startDate || (startDate && endDate)) { setStartDate(d); setEndDate(null); }
    else { if (d < startDate) { setEndDate(startDate); setStartDate(d); } else setEndDate(d); }
  };

  const applyCustom = () => {
    if (!startDate || !endDate) return;
    const from = startDate <= endDate ? startDate : endDate;
    const to   = startDate <= endDate ? endDate : startDate;
    const days = Math.max(1, Math.round((to.getTime() - from.getTime()) / 86400000) + 1);
    const fmt  = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    onSelect(`${fmt(from)} – ${fmt(to)}`, days);
  };

  return (
    <div
      className="absolute top-full right-0 z-50 mt-2 rounded-2xl p-4"
      style={{
        background: '#080a1d',
        border: '1px solid rgba(99,102,241,0.25)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
        width: 280,
        backdropFilter: 'blur(16px)',
      }}
      onClick={e => e.stopPropagation()}
    >
      {/* Presets */}
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {PRESETS.map(({ label, days }) => {
          const avail = days <= daysSinceReg;
          return (
            <button key={label} onClick={() => avail && onSelect(label, days)}
              title={!avail ? `Available after ${days} days` : undefined}
              className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
              style={{
                background: avail ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.04)',
                color: avail ? '#818cf8' : 'rgba(130,140,200,0.25)',
                border: `1px solid ${avail ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.08)'}`,
                cursor: avail ? 'pointer' : 'not-allowed',
              }}>
              {label}
            </button>
          );
        })}
      </div>

      <div className="mb-3" style={{ borderBottom: '1px solid rgba(99,102,241,0.1)' }} />

      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
          style={{ color: 'var(--muted)' }}>
          <ChevronLeft size={14} />
        </button>
        <span className="text-xs font-bold text-white">
          {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <button onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
          style={{ color: 'var(--muted)' }}>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <div key={d} className="text-center py-0.5"
            style={{ fontSize: 10, color: 'var(--dim)', fontWeight: 600 }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {cells.map((date, i) => {
          if (!date) return <div key={i} style={{ height: 30 }} />;
          const from = isRangeFrom(date);
          const to   = isRangeTo(date);
          const inR  = isInRange(date);
          const dis  = isDisabled(date);
          const tod  = isTodayDate(date);
          const hl   = from || to;
          const showBar = (inR || from || to) && !!effectiveEnd;
          return (
            <div key={i} className="relative flex items-center justify-center"
              style={{ height: 30, cursor: dis ? 'not-allowed' : 'pointer' }}
              onClick={() => handleClick(date)}
              onMouseEnter={() => !dis && setHoverDate(date)}
              onMouseLeave={() => setHoverDate(null)}>
              {showBar && (
                <div style={{
                  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                  height: 22, pointerEvents: 'none',
                  left: from ? '50%' : 0, right: to ? '50%' : 0,
                  background: 'rgba(59,130,246,0.18)',
                  transition: 'left 0.1s, right 0.1s',
                }} />
              )}
              <div style={{
                position: 'relative',
                width: 24, height: 24, borderRadius: '50%',
                fontSize: 11, fontWeight: hl ? 700 : 400,
                background: hl ? '#3b82f6' : 'transparent',
                color: dis ? 'rgba(255,255,255,0.12)' :
                       hl ? '#fff' : inR ? '#93c5fd' :
                       tod ? '#60a5fa' : 'rgba(255,255,255,0.6)',
                border: tod && !hl ? '1px solid rgba(59,130,246,0.35)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.1s',
              }}>
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {startDate && endDate ? (
        <button onClick={applyCustom}
          className="w-full mt-3 py-2 rounded-xl text-xs font-bold text-white"
          style={{ background: 'linear-gradient(135deg,#4f46e5,#2563eb)', boxShadow: '0 4px 14px rgba(79,70,229,0.35)' }}>
          Apply {Math.round(Math.abs(endDate.getTime() - startDate.getTime()) / 86400000) + 1}-day range
        </button>
      ) : (
        <p className="text-center mt-2 text-xs" style={{ color: 'var(--dim)' }}>
          {startDate ? 'Now click an end date' : 'Click to select start date'}
        </p>
      )}
    </div>
  );
};

// ── Period Selector (main export) ─────────────────────────────────────────────
const QUICK_BTNS = [
  { label: '1D',  days: 1  },
  { label: '7D',  days: 7  },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

export default function PeriodSelector() {
  const { period, setPeriod } = usePeriod();
  const [showCal, setShowCal] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowCal(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isCustom = !QUICK_BTNS.some(b => b.label === period.label);

  return (
    <div className="flex items-center gap-1 relative" ref={ref}>
      {QUICK_BTNS.map(({ label, days }) => (
        <button key={label}
          onClick={() => { setPeriod({ label, days }); setShowCal(false); }}
          className="px-2.5 h-7 rounded-lg text-xs font-semibold transition-all"
          style={period.label === label
            ? { background: 'linear-gradient(135deg,#4f46e5,#2563eb)', color: '#fff', boxShadow: '0 3px 10px rgba(79,70,229,0.35)' }
            : { background: 'rgba(99,102,241,0.07)', color: 'var(--muted)', border: '1px solid rgba(99,102,241,0.15)' }}>
          {label}
        </button>
      ))}
      <button
        onClick={() => setShowCal(v => !v)}
        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
        style={showCal || isCustom
          ? { background: 'linear-gradient(135deg,#4f46e5,#2563eb)', color: '#fff', boxShadow: '0 3px 10px rgba(79,70,229,0.35)' }
          : { background: 'rgba(99,102,241,0.07)', color: 'var(--muted)', border: '1px solid rgba(99,102,241,0.15)' }}>
        <Calendar size={12} />
      </button>
      {isCustom && (
        <span className="ml-1 px-2 py-0.5 rounded-md text-xs font-semibold"
          style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
          {period.label}
        </span>
      )}
      {showCal && (
        <DateRangePicker
          regDate={REG_DATE}
          onSelect={(label, days) => { setPeriod({ label, days }); setShowCal(false); }}
        />
      )}
    </div>
  );
}
