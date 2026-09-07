import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  User,
  QrCode,
  FileText,
  Bot,
  Map,
  ScanLine,
  LogOut,
  Menu,
  Shield,
  Building2,
  Users,
  Clock,
  Building,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isHospital = user?.role === 'hospital';

  const patientNavItems = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/dashboard/profile', label: 'My Profile', icon: User },
    { path: '/dashboard/qr', label: 'My QR Code', icon: QrCode },
    { path: '/dashboard/records', label: 'Medical Records', icon: FileText },
    { path: '/dashboard/ai', label: 'AI Assistant', icon: Bot },
    { path: '/dashboard/map', label: 'Support Map', icon: Map },
    { path: '/dashboard/scanner', label: 'QR Scanner', icon: ScanLine },
  ];

  const hospitalNavItems = [
    { path: '/dashboard', label: 'Clinical Overview', icon: Home },
    { path: '/dashboard/scanner', label: 'QR Scanner', icon: ScanLine, highlight: true },
    { path: '/dashboard/patients', label: 'Patients Accessed', icon: Users },
    { path: '/dashboard/history', label: 'Scan History & Logs', icon: Clock },
    { path: '/dashboard/ai', label: 'Clinical AI Assistant', icon: Bot },
    { path: '/dashboard/profile', label: 'Facility Profile', icon: Building },
  ];

  const navItems = isHospital ? hospitalNavItems : patientNavItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Overlay on mobile */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 99,
            display: 'none',
          }}
          className="sidebar-overlay"
        />
      )}

      <aside
        style={{
          width: 'var(--sidebar-width)',
          background: 'var(--color-navy)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          overflow: 'hidden',
          flexShrink: 0,
          zIndex: 100,
        }}
        className={`sidebar ${open ? 'sidebar-open' : ''}`}
      >
        {/* Logo */}
        <div
          style={{
            padding: '20px 20px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 38,
                height: 38,
                background: isHospital ? 'var(--color-teal-dim)' : 'var(--color-teal)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: isHospital ? '1.5px solid var(--color-teal-light)' : 'none',
              }}
            >
              {isHospital ? <Building2 size={20} color="#fff" /> : <Shield size={20} color="#fff" />}
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '18px',
                  color: '#fff',
                  letterSpacing: '-0.02em',
                }}
              >
                MedQR<span style={{ color: 'var(--color-teal-light)' }}>+</span>
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: isHospital ? 'var(--color-teal-light)' : 'rgba(255,255,255,0.45)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                {isHospital ? 'Hospital Clinical Portal' : 'Secured Health'}
              </div>
            </div>
          </div>
        </div>

        {/* User / Hospital info strip */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: isHospital ? 'rgba(42, 157, 143, 0.08)' : 'transparent',
          }}
        >
          <Avatar name={user?.hospitalName || user?.name} size={40} />
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div
              style={{
                color: '#fff',
                fontWeight: 600,
                fontSize: '13px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {isHospital ? (user?.hospitalName || user?.name) : user?.name}
            </div>
            <div
              style={{
                color: isHospital ? 'var(--color-teal-light)' : 'rgba(255,255,255,0.45)',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {isHospital ? (
                <>
                  <span style={{ fontWeight: 600 }}>{user?.hospitalId || user?.id}</span>
                  <span>• {user?.department?.split(' ')[0] || 'Staff'}</span>
                </>
              ) : (
                user?.id
              )}
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 12px' }}>
          <div
            style={{
              marginBottom: '4px',
              padding: '0 8px 8px',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{isHospital ? 'Clinical Actions' : 'Navigation'}</span>
            {isHospital && (
              <span style={{ fontSize: '9px', background: 'var(--color-teal-dim)', color: '#fff', padding: '1px 6px', borderRadius: '4px' }}>
                Tier 2 Ready
              </span>
            )}
          </div>
          {navItems.map(({ path, label, icon: Icon, highlight }: any) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/dashboard'}
              onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '4px',
                color: isActive ? '#fff' : highlight ? 'var(--color-teal-light)' : 'rgba(255,255,255,0.65)',
                background: isActive
                  ? 'var(--color-navy-light)'
                  : highlight
                    ? 'rgba(42, 157, 143, 0.12)'
                    : 'transparent',
                borderLeft: isActive ? '3px solid var(--color-teal)' : '3px solid transparent',
                fontWeight: isActive || highlight ? 600 : 400,
                fontSize: '13.5px',
                transition: 'all var(--transition-fast)',
                textDecoration: 'none',
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} />
                <span>{label}</span>
              </div>
              {highlight && (
                <span
                  style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-teal)',
                    color: '#fff',
                    fontWeight: 700,
                  }}
                >
                  SCAN
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer with switch/sign out */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              color: 'rgba(255,255,255,0.55)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'var(--font-primary)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(192,57,43,0.15)';
              (e.currentTarget as HTMLElement).style.color = 'var(--color-brick-light)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = '';
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)';
            }}
          >
            <LogOut size={18} />
            Sign Out ({isHospital ? 'Hospital' : 'Patient'})
          </button>
        </div>
      </aside>
    </>
  );
};

// ============================================================
// TOP BAR
// ============================================================
interface TopBarProps {
  onMenuClick: () => void;
  title: string;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick, title }) => {
  const { user } = useAuth();
  const isHospital = user?.role === 'hospital';

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <button
        onClick={onMenuClick}
        className="menu-btn"
        style={{
          display: 'none',
          padding: '8px',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--color-navy)',
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
        }}
      >
        <Menu size={20} />
      </button>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '18px',
            color: 'var(--color-navy)',
          }}
        >
          {title}
        </h1>
        {isHospital && (
          <Badge variant="teal" size="sm" icon={<Building2 size={12} />}>
            Hospital Mode • {user?.hospitalName?.split(',')[0] || user?.name}
          </Badge>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar name={isHospital ? (user?.hospitalName || user?.name) : user?.name} size={32} />
          <div style={{ display: 'flex', flexDirection: 'column' }} className="topbar-name">
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-navy)' }}>
              {isHospital ? user?.name : user?.name}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
              {isHospital ? (user?.hospitalId || 'Hospital Authority') : (user?.id || 'Patient')}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

// ============================================================
// APP LAYOUT
// ============================================================
interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const isHospital = user?.role === 'hospital';

  const patientBottomItems = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/dashboard/profile', label: 'Profile', icon: User },
    { path: '/dashboard/qr', label: 'QR Pass', icon: QrCode },
    { path: '/dashboard/records', label: 'Records', icon: FileText },
    { path: '/dashboard/scanner', label: 'Scanner', icon: ScanLine },
  ];

  const hospitalBottomItems = [
    { path: '/dashboard', label: 'Overview', icon: Home },
    { path: '/dashboard/scanner', label: 'Scan QR', icon: ScanLine },
    { path: '/dashboard/patients', label: 'Patients', icon: Users },
    { path: '/dashboard/history', label: 'Logs', icon: Clock },
    { path: '/dashboard/ai', label: 'AI Clinician', icon: Bot },
  ];

  const bottomNavItems = isHospital ? hospitalBottomItems : patientBottomItems;

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .sidebar {
            position: fixed !important;
            left: ${sidebarOpen ? '0' : '-260px'} !important;
            transition: left var(--transition-base) !important;
          }
          .sidebar-overlay { display: block !important; }
          .menu-btn { display: flex !important; }
          .topbar-name { display: flex !important; }
          .app-main { margin-left: 0 !important; }
          .bottom-nav { display: flex !important; }
          .desktop-sidebar { display: none !important; }
        }
        .bottom-nav {
          display: none;
          position: fixed; bottom: 0; left: 0; right: 0;
          background: var(--color-navy);
          border-top: 1px solid rgba(255,255,255,0.1);
          padding: 8px 0 max(8px, env(safe-area-inset-bottom));
          z-index: 200;
        }
        .bottom-nav a {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; gap: 3px;
          color: rgba(255,255,255,0.5);
          font-size: 10px; font-weight: 500;
          text-decoration: none; padding: 4px 2px;
        }
        .bottom-nav a.active { color: var(--color-teal-light); font-weight: 700; }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <div className="desktop-sidebar">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Mobile sidebar */}
        <div style={{ display: 'none' }} className="mobile-sidebar">
          {sidebarOpen && <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minWidth: 0,
          }}
          className="app-main"
        >
          <TopBar onMenuClick={() => setSidebarOpen(v => !v)} title={title} />
          <main style={{ flex: 1, overflow: 'auto', paddingBottom: '80px' }}>{children}</main>
        </div>
      </div>

      {/* Bottom nav for mobile */}
      <nav className="bottom-nav">
        {bottomNavItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/dashboard'}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
};
