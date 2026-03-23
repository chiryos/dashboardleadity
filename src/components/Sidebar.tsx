import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, BarChart2, LineChart, MessageSquare,
  Tag, Bot,
} from 'lucide-react';

const navItems = [
  { to: '/',              icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/metrics',       icon: BarChart2,        label: 'Metrics'      },
  { to: '/statistics',    icon: LineChart,         label: 'Statistics'   },
  { to: '/conversations', icon: MessageSquare,     label: 'Conversations'},
  { to: '/offers',        icon: Tag,               label: 'Offers'       },
  { to: '/setter',        icon: Bot,               label: 'Setter'       },
];

export default function Sidebar() {
  return (
    <aside
      className="fixed left-0 top-0 h-screen z-30 flex flex-col items-center py-5"
      style={{
        width: 64,
        background: 'var(--surface)',
        borderRight: '1px solid rgba(99,102,241,0.12)',
      }}
    >
      {/* Logo */}
      <div className="mb-8 flex-shrink-0 flex items-center justify-center" style={{ width: 40, height: 40 }}>
        <img src="/logo.png" alt="Leadity" style={{ width: 38, height: 38, objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(79,70,229,0.5))' }} />
      </div>

      {/* Nav icons */}
      <nav className="flex-1 flex flex-col items-center gap-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            title={label}
            className={({ isActive }) =>
              `relative w-10 h-10 rounded-xl flex items-center justify-center transition-all group ${
                isActive ? '' : 'hover:bg-white/[0.05]'
              }`
            }
            style={({ isActive }) => isActive
              ? { background: 'rgba(99,102,241,0.14)' }
              : {}}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} style={{ color: isActive ? '#818cf8' : 'var(--muted)' }} />
                {isActive && (
                  <span
                    className="absolute -left-3 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                    style={{ background: 'linear-gradient(180deg,#6366f1,#3b82f6)' }}
                  />
                )}
                <span
                  className="absolute left-14 whitespace-nowrap text-xs font-medium px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
                  style={{
                    background: '#0b0d1f',
                    border: '1px solid rgba(99,102,241,0.25)',
                    color: 'var(--text)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  }}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
