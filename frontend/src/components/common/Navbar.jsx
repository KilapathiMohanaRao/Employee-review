import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  LogOut,
  Send,
  ExternalLink,
  Sun,
  Moon,
  CheckCircle,
  User,
} from './Icons';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    () => localStorage.getItem('app-theme') || 'dark'
  );

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('app-theme', next);
    if (next === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      className="navbar no-print"
      style={{
        height: '68px',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Brand & Platform Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '11px',
              background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '1.15rem',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
            }}
          >
            360
          </div>
          <div>
            <div
              style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1.2,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              Admin 360° Feedback System
              <span
                style={{
                  fontSize: '0.62rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: '#10b981',
                  fontWeight: 800,
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                }}
              >
                ADMIN EXCLUSIVE
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Executive Feedback Collection &amp; Analytics
            </div>
          </div>
        </Link>
      </div>

      {/* Right Controls: Quick Actions + Admin Info + Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Quick Send Invitation */}
        <Link
          to="/admin/invitations"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#fff',
            fontSize: '0.8rem',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
          }}
        >
          <Send size={14} /> Send Invitation
        </Link>

        {/* Public Form Preview */}
        <a
          href="/feedback"
          target="_blank"
          rel="noopener noreferrer"
          title="Open Public Feedback Form in new tab (Candidate / Reviewer view)"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.8rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            fontSize: '0.78rem',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <ExternalLink size={13} /> Public Form
        </a>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Admin Profile Identity */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.35rem 0.75rem',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: '24px',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 800,
            }}
          >
            M
          </div>
          <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {user?.fullName || 'Mohan Kilaparthi'}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700 }}>
              Sole Admin
            </div>
          </div>
        </div>

        {/* Secure Logout */}
        <button
          onClick={handleLogout}
          style={{
            padding: '0.45rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            background: 'rgba(239, 68, 68, 0.08)',
            color: '#ef4444',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.15s ease',
          }}
          title="Sign out of Admin Dashboard"
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
