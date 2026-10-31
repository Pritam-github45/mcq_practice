import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, BookOpen, FileQuestion, ClipboardList, BarChart3,
  Bookmark, AlertCircle, User, Settings, ChevronLeft, ChevronRight,
  X, Zap, GraduationCap, Shield,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/subjects', icon: BookOpen, label: 'Subjects' },
  { to: '/pyq', icon: FileQuestion, label: 'Previous Year QP' },
  { to: '/mock-tests', icon: ClipboardList, label: 'Mock Tests' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { to: '/wrong-answers', icon: AlertCircle, label: 'Wrong Answers' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen, user } = useApp();
  const location = useLocation();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <GraduationCap size={20} color="white" />
            </div>
            {!sidebarCollapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                  GATE Prep
                </div>
                <div style={{ fontSize: '11px', color: 'var(--purple-light)', fontWeight: '600' }}>PRO</div>
              </div>
            )}
          </div>
          {/* Mobile close */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
            className="md:hidden"
          >
            <X size={20} />
          </button>
          {/* Desktop toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              background: 'var(--glass)', border: '1px solid var(--border)',
              borderRadius: '8px', padding: '5px', color: 'var(--text-secondary)',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
            }}
            className="hidden md:flex"
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`sidebar-link ${isActive(to) ? 'active' : ''}`}
              onClick={() => setMobileSidebarOpen(false)}
              title={sidebarCollapsed ? label : ''}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!sidebarCollapsed && <span>{label}</span>}
            </Link>
          ))}

          <div style={{ margin: '12px 20px', borderTop: '1px solid var(--border)' }} />

          <Link
            to="/admin"
            className={`sidebar-link ${isActive('/admin') ? 'active' : ''}`}
            onClick={() => setMobileSidebarOpen(false)}
            title={sidebarCollapsed ? 'Admin' : ''}
          >
            <Shield size={18} style={{ flexShrink: 0 }} />
            {!sidebarCollapsed && <span>Admin Panel</span>}
          </Link>
        </nav>

        {/* User Info */}
        {!sidebarCollapsed && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: '700', color: 'white', flexShrink: 0,
              }}>
                {user?.avatar || 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name || 'Student'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  <Zap size={10} style={{ display: 'inline', marginRight: '3px', color: '#f59e0b' }} />
                  {user?.streak} day streak
                </div>
              </div>
            </div>
          </div>
        )}
        {sidebarCollapsed && (
          <div style={{ padding: '16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: '700', color: 'white',
            }}>
              {user?.avatar || 'U'}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
