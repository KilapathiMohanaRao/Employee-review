import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Send,
  CheckCircle,
  BarChart3,
  Mail,
  Settings,
  ChevronRight,
  Shield,
  ExternalLink,
  User,
} from './Icons';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  const navItems = [
    {
      to: '/',
      label: '1. Dashboard Overview',
      shortLabel: 'Overview',
      icon: <LayoutDashboard size={19} />,
      exact: true,
    },
    {
      to: '/admin/form-builder',
      label: '2. Create Feedback Form',
      shortLabel: 'Form Builder',
      icon: <FileText size={19} />,
    },
    {
      to: '/admin/invitations',
      label: '3. Manage Invitations',
      shortLabel: 'Invitations',
      icon: <Send size={19} />,
      badge: 'Email',
    },
    {
      to: '/admin/reviews',
      label: '4. Submitted Reviews',
      shortLabel: 'Reviews',
      icon: <CheckCircle size={19} />,
    },
    {
      to: '/admin/analytics',
      label: '5. Feedback Analytics',
      shortLabel: 'Analytics',
      icon: <BarChart3 size={19} />,
    },
    {
      to: '/admin/email',
      label: '6. Email Management',
      shortLabel: 'SMTP / Logs',
      icon: <Mail size={19} />,
    },
    {
      to: '/admin/settings',
      label: '7. Admin Settings',
      shortLabel: 'Settings',
      icon: <Settings size={19} />,
    },
  ];

  return (
    <aside
      className="sidebar no-print"
      style={{
        width: collapsed ? '76px' : '270px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        minHeight: 'calc(100vh - 68px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: '1.25rem 0.75rem',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {/* Section title */}
        {!collapsed ? (
          <div
            style={{
              padding: '0 0.75rem 0.6rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Admin 360 Navigation
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                padding: '0.15rem 0.45rem',
                borderRadius: '10px',
                background: 'rgba(37,99,235,0.1)',
                color: 'var(--primary)',
                fontWeight: 700,
              }}
            >
              7 Sections
            </span>
          </div>
        ) : (
          <div style={{ height: '0.5rem' }} />
        )}

        {/* 7 Nav Links */}
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              color: isActive ? '#ffffff' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'var(--primary)' : 'transparent',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.84rem',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              boxShadow: isActive ? '0 4px 12px rgba(37,99,235,0.25)' : 'none',
              justifyContent: collapsed ? 'center' : 'flex-start',
            })}
            title={collapsed ? item.label : undefined}
          >
            <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{item.icon}</span>
            {!collapsed && (
              <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.label}
              </span>
            )}
            {!collapsed && item.badge && (
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.4rem',
                  borderRadius: '4px',
                  background: 'rgba(255,255,255,0.22)',
                  color: 'inherit',
                  textTransform: 'uppercase',
                }}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}

        {/* Admin Target Profile Box in Sidebar */}
        {!collapsed && (
          <div
            style={{
              marginTop: '1.5rem',
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '7px',
                  background: 'linear-gradient(135deg, #2563eb, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                }}
              >
                MK
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  Mohan Kilaparthi
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Evaluated Admin
                </div>
              </div>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
              Every submitted review evaluates this single Admin profile.
            </div>
          </div>
        )}
      </div>

      {/* Footer controls: Collapse Toggle */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: '0.55rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          title={collapsed ? 'Expand menu' : 'Collapse menu'}
        >
          {!collapsed && <span>Collapse Sidebar</span>}
          <ChevronRight
            size={16}
            style={{
              transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
