import React, { useState, useEffect } from 'react';
import { adminFeedbackApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  Save,
  CheckCircle,
  AlertTriangle,
  User,
  Mail,
  Lock,
  Layers,
  Clock,
  RefreshCw,
  Sliders,
  ExternalLink,
  Download,
  Key,
  Trash2,
} from '../../components/common/Icons';

export const AdminSettingsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [campaign, setCampaign] = useState({
    title: '2026 Admin 360° Comprehensive Leadership Review',
    description: 'Gathering feedback from peers, team members, and leaders on executive effectiveness, strategy, and collaboration.',
    adminName: 'Mohan Kilaparthi',
    adminEmail: 'kilaparthimohan27@gmail.com',
    adminTitle: 'Administrator & Executive Leader',
    publicBaseUrl: '',
    active: true,
  });

  useEffect(() => {
    fetchCampaign();
  }, []);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const res = await adminFeedbackApi.getCampaign();
      const data = res?.data || res;
      if (data) {
        setCampaign({
          id: data.id,
          title: data.title || data.name || '2026 Admin 360° Comprehensive Leadership Review',
          description: data.description || '',
          adminName: data.adminName || data.adminTargetName || 'Mohan Kilaparthi',
          adminEmail: data.adminEmail || data.adminTargetEmail || 'kilaparthimohan27@gmail.com',
          adminTitle: data.adminTitle || data.adminTargetTitle || 'Administrator & Executive Leader',
          publicBaseUrl: data.publicBaseUrl || (window.location.origin.includes('localhost') ? 'http://localhost:5173' : window.location.origin),
          active: data.active !== undefined ? data.active : true,
        });
      }
    } catch (e) {
      console.error('Failed to load campaign settings:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCampaign = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const payload = {
        ...campaign,
        adminName: campaign.adminName,
        adminEmail: campaign.adminEmail,
        adminTitle: campaign.adminTitle,
        title: campaign.title,
        publicBaseUrl: campaign.publicBaseUrl ? campaign.publicBaseUrl.trim() : '',
      };
      const res = await adminFeedbackApi.updateCampaign(payload);
      if (res?.success || res?.data) {
        setSuccessMsg('Admin campaign and Public Base URL settings updated successfully.');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(res?.message || 'Failed to update campaign settings');
      }
    } catch (e) {
      setErrorMsg(e.response?.data?.message || e.message || 'Error updating campaign settings');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDemoData = async () => {
    if (!window.confirm('Are you sure you want to clear all demo/test submissions and invitations? Your dashboard will be completely clean for real reviewers.')) {
      return;
    }
    setResetting(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await adminFeedbackApi.resetDemoData();
      setSuccessMsg(res?.message || 'All demo and test feedback data cleared successfully. Dashboard is clean.');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (e) {
      setErrorMsg(e?.message || 'Failed to clear demo data.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0.65rem',
                borderRadius: '20px',
                background: 'rgba(59, 130, 246, 0.1)',
                color: 'var(--primary)',
                fontSize: '0.72rem',
                fontWeight: 700,
                border: '1px solid rgba(59, 130, 246, 0.25)',
              }}
            >
              <Sliders size={12} /> Section 7 · System Settings
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Admin &amp; Security Settings
          </h1>
          <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Configure target Admin details, campaign parameters, single-use token policies, and backend privacy enforcement.
          </p>
        </div>

        <button
          onClick={fetchCampaign}
          disabled={loading}
          style={{
            padding: '0.6rem 1rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Reload Settings
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          <CheckCircle size={18} />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          <AlertTriangle size={18} />
          {errorMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Target Admin Profile & Campaign Details */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <User size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Target Admin Information
              </h2>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                This is the single individual all reviewers provide feedback about.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveCampaign} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Admin Full Name *
              </label>
              <input
                type="text"
                value={campaign.adminName || ''}
                onChange={(e) => setCampaign({ ...campaign, adminName: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                Displayed on the public feedback form (e.g. "Reviewing: Mohan Kilaparthi").
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Admin Email Address *
              </label>
              <input
                type="email"
                value={campaign.adminEmail || ''}
                onChange={(e) => setCampaign({ ...campaign, adminEmail: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Admin Job Title / Designation
              </label>
              <input
                type="text"
                value={campaign.adminTitle || ''}
                onChange={(e) => setCampaign({ ...campaign, adminTitle: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Public Application Base URL for Cross-Device Links */}
            <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  🌐 Public Application Base URL (APP_BASE_URL)
                </label>
                {campaign.publicBaseUrl && !campaign.publicBaseUrl.includes('localhost') && !campaign.publicBaseUrl.includes('127.0.0.1') ? (
                  <span style={{ fontSize: '0.7rem', color: '#059669', background: 'rgba(16,185,129,0.15)', padding: '0.15rem 0.5rem', borderRadius: '12px', fontWeight: 800 }}>
                    Global Access Active
                  </span>
                ) : (
                  <span style={{ fontSize: '0.7rem', color: '#d97706', background: 'rgba(245,158,11,0.15)', padding: '0.15rem 0.5rem', borderRadius: '12px', fontWeight: 800 }}>
                    Local Only (localhost)
                  </span>
                )}
              </div>
              <input
                type="url"
                value={campaign.publicBaseUrl || ''}
                onChange={(e) => setCampaign({ ...campaign, publicBaseUrl: e.target.value })}
                placeholder="https://yourdomain.com or https://tunnel.loca.lt"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem', display: 'block', lineHeight: 1.4 }}>
                {campaign.publicBaseUrl && !campaign.publicBaseUrl.includes('localhost') && !campaign.publicBaseUrl.includes('127.0.0.1') ? (
                  <span style={{ color: '#059669', fontWeight: 600 }}>
                    ✓ Cross-Device Enabled: All invitation emails and copied links will use this public HTTPS URL so Android phones, iPhones, and external computers can open and submit reviews directly.
                  </span>
                ) : (
                  <span style={{ color: '#d97706', fontWeight: 600 }}>
                    ⚠️ External devices (Android, iPhone, other PCs) cannot access "localhost". Set your production domain or live HTTPS tunnel URL here for cross-device access.
                  </span>
                )}
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Active Campaign Title *
              </label>
              <input
                type="text"
                value={campaign.title || ''}
                onChange={(e) => setCampaign({ ...campaign, title: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Campaign Instructions &amp; Description
              </label>
              <textarea
                rows={3}
                value={campaign.description || ''}
                onChange={(e) => setCampaign({ ...campaign, description: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                alignSelf: 'flex-start',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#fff',
                fontSize: '0.88rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
              }}
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>

        {/* Security & Access Architecture */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Security Architecture Card */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <Shield size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Enforced Security &amp; Access Architecture
                </h2>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Backend verification rules preventing unauthorized data exposure.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.85rem',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <CheckCircle size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Single Admin Authentication Only
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Zero candidate or reviewer logins. Reviewers access forms strictly via secure single-use token links.
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.85rem',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <CheckCircle size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Atomic Single-Use Token Invalidation
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    When a reviewer clicks submit, backend atomically sets status to <code>SUBMITTED</code> and permanently locks the token.
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.85rem',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <CheckCircle size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Zero Client-Side Result Exposure
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    No reviews, ratings, or comments are ever stored in browser localStorage or returned to non-admin endpoints.
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.85rem',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <CheckCircle size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Backend Protected Admin APIs
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Every dashboard, invitation, and review retrieval requires a validated JWT with Super Admin / HR Admin credentials.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick System Actions */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 1rem', color: 'var(--text-primary)' }}>
              Quick System Management
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <a
                href={adminFeedbackApi.getExportCsvUrl()}
                download
                style={{
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  color: 'var(--primary)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'center',
                }}
              >
                <Download size={14} /> Export CSV Data
              </a>

              <a
                href="/admin/email"
                style={{
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(139, 92, 246, 0.08)',
                  border: '1px solid rgba(139, 92, 246, 0.25)',
                  color: '#8b5cf6',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'center',
                }}
              >
                <Mail size={14} /> SMTP &amp; Logs
              </a>
            </div>

            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={handleResetDemoData}
                disabled={resetting}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
                title="Wipes all demo reviews and invitations so only real reviewer submissions are shown"
              >
                <Trash2 size={14} />
                <span>{resetting ? 'Clearing Data...' : 'Clear All Demo/Test Reviews & Invitations'}</span>
              </button>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem', textAlign: 'center' }}>
                Use this to start 100% fresh for real feedback collection.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
