import React from 'react';
import { LayoutDashboard, ArrowLeftRight, Lightbulb } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Role } from '../../types';

type Page = 'dashboard' | 'transactions' | 'insights';

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight  },
  { id: 'insights',     label: 'Insights',     icon: Lightbulb       },
];

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const { role, setRole, toggleTheme } = useStore();

  return (
    <aside style={{
      width: 220,
      flexShrink: 0,
      height: '100vh',
      position: 'sticky',
      top: 0,
      background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
    }}
    className="hidden md:flex"
    >

      {/* ── LOGO ── */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          fontFamily: 'var(--mono)',
          fontSize: 18,
          fontWeight: 500,
          letterSpacing: '-0.5px',
          color: 'var(--text)',
        }}>
          fin<span style={{ color: 'var(--accent)' }}>track</span>
        </div>
        <div style={{
          fontSize: 11,
          color: 'var(--muted)',
          marginTop: 3,
        }}>
          Personal Finance
        </div>
      </div>

      {/* ── NAV ── */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activePage === id;
          return (
            <div
              key={id}
              onClick={() => onNavigate(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 10px',
                borderRadius: 8,
                marginBottom: 2,
                fontSize: 13.5,
                fontWeight: 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
                color: isActive ? 'var(--text)' : 'var(--muted)',
                background: isActive ? 'var(--bg3)' : 'transparent',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLDivElement).style.background = 'var(--bg3)';
                  (e.currentTarget as HTMLDivElement).style.color = 'var(--text)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                  (e.currentTarget as HTMLDivElement).style.color = 'var(--muted)';
                }
              }}
            >
              <Icon size={16} strokeWidth={1.8} />
              {label}
            </div>
          );
        })}
      </nav>

      {/* ── BOTTOM ── */}
      <div style={{
        padding: '16px 12px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        {/* Role switcher */}
        <div>
          <div style={{
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: 'var(--muted)',
            marginBottom: 6,
          }}>
            Role
          </div>
          <select
            value={role}
            onChange={e => setRole(e.target.value as Role)}
            style={{
              width: '100%',
              background: 'var(--bg3)',
              border: '1px solid var(--border2)',
              color: 'var(--text)',
              fontFamily: 'var(--font)',
              fontSize: 13,
              padding: '7px 10px',
              borderRadius: 8,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            width: '100%',
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            color: 'var(--muted)',
            fontFamily: 'var(--font)',
            fontSize: 12,
            padding: '8px',
            borderRadius: 8,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
        >
          Toggle light / dark
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;