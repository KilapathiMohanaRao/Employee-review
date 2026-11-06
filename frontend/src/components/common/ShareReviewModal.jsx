import React, { useState, useEffect } from 'react';
import { employeeApi } from '../../services/api';
import {
  Shield,
  Copy,
  Check,
  ExternalLink,
  Users,
  Send,
  Sparkles,
  LinkIcon,
  X,
} from './Icons';

export const ShareReviewModal = ({ isOpen, onClose }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [copiedType, setCopiedType] = useState(null); // 'general' | 'targeted' | 'email'

  useEffect(() => {
    if (isOpen) {
      employeeApi
        .getAll()
        .then((res) => {
          if (res.data) setEmployees(res.data);
        })
        .catch((e) => console.error(e));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const origin = window.location.origin;
  const generalUrl = `${origin}/review-form`;
  const targetedUrl = selectedEmpId ? `${origin}/review-form?evaluateeId=${selectedEmpId}` : generalUrl;

  const selectedEmp = employees.find((e) => e.id === Number(selectedEmpId));

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 3000);
  };

  const getEmailTemplate = () => {
    if (selectedEmp) {
      return `Hello,\n\nPlease take 2-3 minutes to provide your confidential 360-degree performance evaluation for ${selectedEmp.fullName} (${selectedEmp.designationTitle} - ${selectedEmp.departmentName}):\n\n👉 Review Link: ${targetedUrl}\n\n🔒 Note: No login or password is required. You can complete this review directly. Your feedback is securely encrypted and accessible strictly by the Administrator.\n\nThank you for your valuable feedback!`;
    }
    return `Hello Team,\n\nPlease take a few minutes to submit your confidential 360-degree performance feedback for your colleagues:\n\n👉 Review Link: ${generalUrl}\n\n🔒 Note: No login or password is required. You can choose the colleague you are reviewing directly on the page. All responses are securely encrypted and viewable strictly by the Administrator.\n\nThank you for your contribution!`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '1.25rem',
      }}
      onClick={onClose}
    >
      <div
        className="glastic-card"
        style={{
          maxWidth: '680px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '2rem',
          background: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1.5px solid var(--primary)',
          boxShadow: '0 25px 60px -15px rgba(37, 99, 235, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '20px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: '#059669',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                🔓 Candidates: NO LOGIN REQUIRED
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '20px',
                  background: 'rgba(37, 99, 235, 0.1)',
                  color: 'var(--primary)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                }}
              >
                🔒 Admin-Only Results Vault
              </span>
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Share Review Links with Candidates
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
              Anyone with this link can fill out and submit their feedback without logging in. You (Admin) can view all submitted reviews inside your Admin Dashboard.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-tertiary)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.4rem',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* SECTION 1: General Review Link */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              1. General Review Portal Link (Reviewer selects colleague)
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Public &amp; Universal
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              readOnly
              value={generalUrl}
              className="form-input"
              style={{
                flex: 1,
                fontSize: '0.825rem',
                fontFamily: 'monospace',
                background: 'var(--bg-tertiary)',
                fontWeight: 600,
              }}
            />
            <button
              onClick={() => copyToClipboard(generalUrl, 'general')}
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.825rem',
                padding: '0.55rem 1rem',
                whiteSpace: 'nowrap',
              }}
            >
              {copiedType === 'general' ? <Check size={16} /> : <Copy size={16} />}
              <span>{copiedType === 'general' ? 'Copied!' : 'Copy Link'}</span>
            </button>
            <a
              href={generalUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.825rem',
                padding: '0.55rem 0.85rem',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
              }}
              title="Test open link as Candidate in new tab"
            >
              <ExternalLink size={15} />
              <span>Test Portal</span>
            </a>
          </div>
          {copiedType === 'general' && (
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
              ✓ General Review Link copied to clipboard!
            </div>
          )}
        </div>

        {/* SECTION 2: Pre-Targeted Employee Link */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              2. Pre-Targeted Link (Direct review for a specific employee)
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Evaluatee Pre-Selected
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Choose Employee to Evaluate:
            </label>
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="form-select"
              style={{ width: '100%', fontSize: '0.825rem' }}
            >
              <option value="">-- Choose Employee (Optional) --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName} ({emp.departmentName} - {emp.designationTitle})
                </option>
              ))}
            </select>
          </div>

          {selectedEmpId && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
              <input
                type="text"
                readOnly
                value={targetedUrl}
                className="form-input"
                style={{
                  flex: 1,
                  fontSize: '0.825rem',
                  fontFamily: 'monospace',
                  background: 'var(--bg-tertiary)',
                  fontWeight: 600,
                }}
              />
              <button
                onClick={() => copyToClipboard(targetedUrl, 'targeted')}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.825rem',
                  padding: '0.55rem 1rem',
                  whiteSpace: 'nowrap',
                }}
              >
                {copiedType === 'targeted' ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedType === 'targeted' ? 'Copied!' : `Copy for ${selectedEmp?.fullName}`}</span>
              </button>
            </div>
          )}
          {copiedType === 'targeted' && (
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
              ✓ Direct review link for {selectedEmp?.fullName} copied!
            </div>
          )}
        </div>

        {/* SECTION 3: One-Click Ready Invitation Message */}
        <div
          style={{
            background: 'rgba(37, 99, 235, 0.04)',
            border: '1px dashed rgba(37, 99, 235, 0.35)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>
              3. Copy Ready-to-Send Invitation Message (Email / Slack / WhatsApp)
            </span>
            <button
              onClick={() => copyToClipboard(getEmailTemplate(), 'email')}
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.775rem',
                padding: '0.35rem 0.75rem',
              }}
            >
              {copiedType === 'email' ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedType === 'email' ? 'Copied Message!' : 'Copy Message'}</span>
            </button>
          </div>

          <pre
            style={{
              margin: 0,
              padding: '0.85rem',
              borderRadius: '8px',
              background: 'var(--bg-tertiary)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontFamily: 'inherit',
              lineHeight: 1.45,
            }}
          >
            {getEmailTemplate()}
          </pre>
          {copiedType === 'email' && (
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
              ✓ Ready invitation message copied to clipboard! Paste it directly into Slack, Email, WhatsApp, or Teams.
            </div>
          )}
        </div>

        {/* Security & Access Protection Guarantee Note */}
        <div
          style={{
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start',
            fontSize: '0.775rem',
            color: 'var(--text-secondary)',
          }}
        >
          <Shield size={20} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#059669', display: 'block', marginBottom: '0.2rem' }}>
              Zero-Friction Submission · Strict Privacy Architecture
            </strong>
            Reviewers and candidates can submit their ratings freely without requiring login credentials. Once submitted, they see only a confirmation screen. Neither employees nor reviewers can view scores or access the Admin Dashboard.
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onClose} className="btn btn-primary" style={{ padding: '0.55rem 1.5rem', fontSize: '0.85rem' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
