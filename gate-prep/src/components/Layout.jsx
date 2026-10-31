import { useApp } from '../context/AppContext';
import { Sun, Moon, Menu, Bell, Search } from 'lucide-react';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const { darkMode, setDarkMode, sidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen } = useApp();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
      <Sidebar />

      <div className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Top Bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              style={{
                background: 'var(--glass)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '8px', color: 'var(--text-secondary)',
                cursor: 'pointer', display: 'flex',
              }}
              className="md:hidden"
            >
              <Menu size={18} />
            </button>
            {/* Search */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input
                placeholder="Search topics, questions..."
                style={{
                  background: 'var(--glass)', border: '1px solid var(--border)',
                  borderRadius: '10px', padding: '8px 12px 8px 36px',
                  color: 'var(--text-primary)', fontSize: '13px',
                  fontFamily: 'Inter, sans-serif', outline: 'none',
                  width: '240px',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              style={{
                background: 'var(--glass)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '8px', color: 'var(--text-secondary)',
                cursor: 'pointer', display: 'flex', position: 'relative',
              }}
            >
              <Bell size={18} />
              <span style={{
                position: 'absolute', top: '6px', right: '6px',
                width: '7px', height: '7px', borderRadius: '50%',
                background: '#ef4444',
              }} />
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                background: 'var(--glass)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '8px', color: 'var(--text-secondary)',
                cursor: 'pointer', display: 'flex',
              }}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
}
