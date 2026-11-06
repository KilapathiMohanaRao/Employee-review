import React, { useState, useEffect } from 'react';
import { adminFeedbackApi } from '../../services/api';
import {
  Mail,
  Send,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Lock,
  Settings,
  Shield,
  Eye,
} from '../../components/common/Icons';

export const AdminEmailManagementPage = () => {
  const [smtpConfig, setSmtpConfig] = useState({
    host: 'smtp.gmail.com',
    port: 587,
    username: '',
    password: '',
    fromEmail: 'kilaparthimohan27@gmail.com',
    fromName: 'Mohan Kilaparthi',
    authEnabled: true,
    startTlsEnabled: true,
    active: true,
    providerType: 'SMTP',
    apiKey: '',
  });

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testEmail, setTestEmail] = useState('');
  const [testSending, setTestSending] = useState(false);
  const [testMessage, setTestMessage] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cfgRes, logsRes] = await Promise.all([
        adminFeedbackApi.getSmtpConfig().catch(() => ({ data: null })),
        adminFeedbackApi.getEmailLogs().catch(() => ({ data: [] })),
      ]);
      if (cfgRes?.data) setSmtpConfig(cfgRes.data);
      if (logsRes?.data) setLogs(logsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSmtp = async (e) => {
    e.preventDefault();
    try {
      await adminFeedbackApi.saveSmtpConfig(smtpConfig);
      setSaveMessage('SMTP configuration saved successfully!');
      setTimeout(() => setSaveMessage(''), 3500);
    } catch (err) {
      console.error(err);
      alert('Failed to save SMTP configuration.');
    }
  };

  const handleSendTestEmail = async (e) => {
    e.preventDefault();
    if (!testEmail.trim()) return;

    setTestSending(true);
    setTestMessage(null);
    try {
      const res = await adminFeedbackApi.sendTestEmail(testEmail.trim());
      if (res && res.success) {
        setTestMessage({ type: 'success', text: `Test email dispatched to ${testEmail}! Check your inbox or the delivery log below.` });
      } else {
        setTestMessage({ type: 'error', text: res.message || 'Failed to dispatch test email. Check SMTP settings.' });
      }
      loadData();
    } catch (err) {
      setTestMessage({ type: 'error', text: err.message || 'Test delivery failed.' });
    } finally {
      setTestSending(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div
        className="glastic-header-banner"
        style={{
          padding: '2rem',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span
              style={{
                background: 'linear-gradient(135deg, #2563eb, #8b5cf6)',
                color: '#ffffff',
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.725rem',
                fontWeight: 800,
                textTransform: 'uppercase',
              }}
            >
              Email Pipeline
            </span>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Real SMTP Delivery &amp; Sent Logs
            </span>
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            Email Management &amp; Delivery Engine
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.35rem', maxWidth: '650px' }}>
            Configure your SMTP server credentials (Gmail, Outlook, SendGrid, custom SMTP), send test emails, and monitor outgoing 360 review invitation logs.
          </p>
        </div>

        <button
          onClick={loadData}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RefreshCw size={14} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {saveMessage && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#059669',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle size={18} />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Grid: SMTP Config Form & Test Sender */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>

        {/* Card 1: SMTP Settings */}
        <div className="glastic-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                SMTP Server Configuration
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Connect your real mail server for automated invitation delivery to real inboxes.
              </p>
            </div>
            <Settings size={20} color="var(--primary)" />
          </div>

          {/* Quick Provider Presets */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setSmtpConfig((prev) => ({ ...prev, host: 'smtp.gmail.com', port: 587, startTlsEnabled: true, authEnabled: true, active: true }))}
              className="btn btn-secondary"
              style={{ fontSize: '0.725rem', padding: '0.35rem 0.65rem', fontWeight: 700 }}
            >
              ⚡ Gmail Preset (Port 587)
            </button>
            <button
              type="button"
              onClick={() => setSmtpConfig((prev) => ({ ...prev, host: 'smtp.office365.com', port: 587, startTlsEnabled: true, authEnabled: true, active: true }))}
              className="btn btn-secondary"
              style={{ fontSize: '0.725rem', padding: '0.35rem 0.65rem', fontWeight: 700 }}
            >
              ⚡ Outlook / Office 365
            </button>
            <button
              type="button"
              onClick={() => setSmtpConfig((prev) => ({ ...prev, host: 'smtp.gmail.com', port: 465, startTlsEnabled: false, authEnabled: true, active: true }))}
              className="btn btn-secondary"
              style={{ fontSize: '0.725rem', padding: '0.35rem 0.65rem', fontWeight: 700 }}
            >
              ⚡ SSL (Port 465)
            </button>
          </div>

          <form onSubmit={handleSaveSmtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                  SMTP Host *
                </label>
                <input
                  type="text"
                  required
                  placeholder="smtp.gmail.com"
                  value={smtpConfig.host}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                  className="form-input"
                  style={{ width: '100%', fontSize: '0.825rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                  Port *
                </label>
                <input
                  type="number"
                  required
                  placeholder="587"
                  value={smtpConfig.port}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, port: Number(e.target.value) })}
                  className="form-input"
                  style={{ width: '100%', fontSize: '0.825rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                Username / Email Address
              </label>
              <input
                type="text"
                placeholder="your.email@gmail.com"
                value={smtpConfig.username || ''}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, username: e.target.value })}
                className="form-input"
                style={{ width: '100%', fontSize: '0.825rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                Password / App Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••••••"
                value={smtpConfig.password || ''}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, password: e.target.value })}
                className="form-input"
                style={{ width: '100%', fontSize: '0.825rem' }}
              />
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block', lineHeight: 1.4 }}>
                💡 <strong>Gmail Note:</strong> Google requires a 16-character <em>App Password</em> (not your normal account password). Enable 2-Step Verification and generate one at <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 700 }}>Google App Passwords</a>.
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                  From Email
                </label>
                <input
                  type="email"
                  placeholder="admin.reviews@enterprise.com"
                  value={smtpConfig.fromEmail || ''}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, fromEmail: e.target.value })}
                  className="form-input"
                  style={{ width: '100%', fontSize: '0.825rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                  Sender Display Name
                </label>
                <input
                  type="text"
                  placeholder="Admin 360 Review System"
                  value={smtpConfig.fromName || ''}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, fromName: e.target.value })}
                  className="form-input"
                  style={{ width: '100%', fontSize: '0.825rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                <input
                  type="checkbox"
                  checked={smtpConfig.active}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, active: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                />
                <span>Enable Live SMTP Dispatch</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={smtpConfig.startTlsEnabled}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, startTlsEnabled: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                />
                <span>Use STARTTLS</span>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: '0.5rem', padding: '0.65rem', fontWeight: 800, fontSize: '0.85rem' }}
            >
              Save SMTP Configuration
            </button>
          </form>
        </div>

        {/* Card 2: Test Email Sender & Template Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Test Sender */}
          <div className="glastic-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
              Test Email Delivery
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Send an instant verification message to test your email delivery configuration.
            </p>

            {testMessage && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  background: testMessage.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'var(--danger-light)',
                  border: `1px solid ${testMessage.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'var(--danger)'}`,
                  color: testMessage.type === 'success' ? '#059669' : 'var(--danger)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                }}
              >
                {testMessage.text}
              </div>
            )}

            <form onSubmit={handleSendTestEmail} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                required
                placeholder="Enter recipient email address..."
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="form-input"
                style={{ flex: 1, fontSize: '0.825rem' }}
              />
              <button
                type="submit"
                disabled={testSending}
                className="btn btn-primary"
                style={{ padding: '0.55rem 1.25rem', fontWeight: 800, fontSize: '0.825rem', whiteSpace: 'nowrap' }}
              >
                {testSending ? 'Sending...' : 'Send Test'}
              </button>
            </form>
          </div>

          {/* Invitation Email Template Preview */}
          <div className="glastic-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                Standard Email Invitation Template
              </h4>
              <span className="badge" style={{ fontSize: '0.65rem' }}>
                HTML &amp; Plain Text
              </span>
            </div>

            <div style={{ padding: '0.85rem', background: 'var(--bg-tertiary)', borderRadius: '10px', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              <div><strong>Subject:</strong> Request for Feedback and Review - Arthur Pendelton</div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />
              <div>Hello [Reviewer Name],</div>
              <div style={{ marginTop: '0.35rem' }}>You are invited to provide your feedback and review about <strong>Arthur Pendelton</strong>.</div>
              <div style={{ marginTop: '0.35rem' }}>Please click the link below to complete the feedback form:</div>
              <div style={{ color: 'var(--primary)', fontWeight: 700, marginTop: '0.25rem' }}>[Open Feedback Form]</div>
              <div style={{ marginTop: '0.35rem' }}>Your feedback is important and will be securely collected.</div>
              <div style={{ marginTop: '0.35rem' }}>Thank you.<br /><strong>Admin Team</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Sent Email Delivery Logs */}
      <div className="glastic-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Sent Email Delivery Logs ({logs.length})
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Complete history of all invitation and test emails dispatched by the system.
            </p>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table" style={{ fontSize: '0.825rem' }}>
            <thead>
              <tr>
                <th>Recipient</th>
                <th>Subject</th>
                <th style={{ textAlign: 'center' }}>Delivery Status</th>
                <th>Sent Timestamp</th>
                <th>Notes / Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No emails logged yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{log.recipientName || 'Reviewer'}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{log.recipientEmail}</div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {log.subject}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        className="badge"
                        style={{
                          background: log.status === 'SENT' ? 'rgba(16, 185, 129, 0.15)' : log.status === 'SIMULATED' ? 'rgba(37, 99, 235, 0.15)' : 'var(--danger-light)',
                          color: log.status === 'SENT' ? '#059669' : log.status === 'SIMULATED' ? 'var(--primary)' : 'var(--danger)',
                          fontWeight: 800,
                          fontSize: '0.725rem',
                        }}
                      >
                        {log.status === 'SENT' ? '✓ Sent (SMTP)' : log.status === 'SIMULATED' ? '✓ Logged / Ready' : 'Failed'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.775rem' }}>
                      {log.sentAt ? new Date(log.sentAt).toLocaleString() : 'N/A'}
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {log.errorMessage || 'Delivered successfully.'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
