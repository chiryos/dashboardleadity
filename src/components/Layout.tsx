import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout() {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
      <Sidebar />
      <div className="flex-1" style={{ marginLeft: 64 }}>
        <Topbar />
        <main style={{ paddingTop: 60, padding: '60px 28px 28px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
