import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, ArrowRight, CheckCircle2 } from '../components/common/Icons';

export const LoginPage = () => {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState('kilaparthimohan27@gmail.com');
  const [password, setPassword] = useState('Naidu 1234');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(username, password);
    if (res.success) {
      navigate('/');
    } else {
      // Fallback try with admin@enterprise.com
      if (username === 'admin' || username === 'admin@enterprise.com') {
        const fallback = await login('kilaparthimohan27@gmail.com', password);
        if (fallback.success) {
          navigate('/');
          return;
        }
      }
      setError(res.message || 'Invalid administrator credentials');
    }
  };

  const handleQuickAdminLogin = async () => {
    setError('');
    let res = await login('kilaparthimohan27@gmail.com', 'Naidu 1234');
    if (!res.success) {
      res = await login('admin@enterprise.com', 'Naidu 1234');
    }
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'Login failed');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: 'var(--bg-primary)',
        background: 'radial-gradient(circle at 10% 20%, rgba(37,99,235,0.06) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(139,92,246,0.06) 0%, transparent 40%), var(--bg-primary)',
      }}
    >
      <div
        className="glastic-card"
        style={{
          maxWidth: '460px',
          width: '100%',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1.5px solid var(--border-color)',
          padding: '2.5rem',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.15)',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              margin: '0 auto 1rem',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #2563eb, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 900,
              fontSize: '1.35rem',
              boxShadow: '0 8px 20px rgba(37,99,235,0.35)',
            }}
          >
            360°
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.2rem 0.65rem',
              borderRadius: '20px',
              background: 'rgba(37,99,235,0.1)',
              color: 'var(--primary)',
              fontSize: '0.725rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem',
            }}
          >
            <Shield size={14} /> Only One Admin Login System
          </div>

          <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            Admin 360-Degree Review &amp; Feedback System
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.4 }}>
            Sign in to manage feedback campaigns, send email invitations, and view all submitted reviews evaluating the Admin.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'var(--danger-light)',
              color: 'var(--danger)',
              fontSize: '0.825rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
              border: '1px solid var(--danger)',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleManualLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Admin Email Address
            </label>
            <input
              type="email"
              required
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin@enterprise.com"
              style={{ width: '100%', fontSize: '0.875rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Admin Password
            </label>
            <input
              type="password"
              required
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', fontSize: '0.875rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 15px rgba(37,99,235,0.35)' }}
          >
            <Lock size={16} />
            <span>{loading ? 'Verifying Admin Credentials...' : 'Sign In to Admin Dashboard'}</span>
          </button>

          <button
            type="button"
            onClick={handleQuickAdminLogin}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '0.65rem', fontSize: '0.8rem', fontWeight: 700 }}
          >
            ⚡ Quick 1-Click Admin Access (Demo)
          </button>
        </form>

        {/* Notice to Reviewers / Candidates */}
        <div
          style={{
            marginTop: '1.75rem',
            padding: '1rem',
            borderRadius: '10px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            fontSize: '0.775rem',
            color: 'var(--text-muted)',
            lineHeight: 1.45,
          }}
        >
          <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={15} color="#10b981" /> Are you a Candidate or Reviewer?
          </div>
          You do <strong>not</strong> need to register or log in. Click the link in your feedback invitation email to open your single-use review form directly.
        </div>
      </div>
    </div>
  );
};
