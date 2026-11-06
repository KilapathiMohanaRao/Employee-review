import React, { useState, useEffect, useMemo } from 'react';
import { adminFeedbackApi } from '../../services/api';
import {
  Send,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Sparkles,
  Users,
  CheckCircle,
  Clock,
  Shield,
  X,
  AlertTriangle,
} from '../../components/common/Icons';

export const AdminInvitationsPage = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showSendModal, setShowSendModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [copiedToken, setCopiedToken] = useState(null);
  const [notification, setNotification] = useState('');
  const [formError, setFormError] = useState('');
  const [bulkError, setBulkError] = useState('');

  // Single invitation inputs
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [reviewCategory, setReviewCategory] = useState('PEER_1');
  const [instructions, setInstructions] = useState('');
  const [sending, setSending] = useState(false);

  // Bulk invitation inputs
  const [bulkText, setBulkText] = useState('');

  const categoryOptions = [
    { value: 'MANAGER', label: 'Manager Review (Direct Supervisor)' },
    { value: 'PEER_1', label: 'Peer Review 1 (PR1)' },
    { value: 'PEER_2', label: 'Peer Review 2 (PR2)' },
    { value: 'PEER_3', label: 'Peer Review 3 (PR3)' },
    { value: 'TEAM_LEAD', label: 'Team Lead Review' },
    { value: 'HR', label: 'People Operations / HR Review' },
    { value: 'GENERAL', label: 'General / Colleague Feedback' },
    { value: 'SELF', label: 'Self Evaluation' },
  ];

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    setLoading(true);
    try {
      const res = await adminFeedbackApi.getInvitations();
      if (res && res.data) {
        setInvitations(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendSingle = async (e) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerEmail.trim()) return;

    setSending(true);
    setFormError('');
    try {
      const payload = {
        reviewerName: reviewerName.trim(),
        reviewerEmail: reviewerEmail.trim().toLowerCase(),
        reviewCategory,
        instructions: instructions.trim() || null,
        expiryDays: 14,
      };

      const res = await adminFeedbackApi.sendInvitation(payload);
      if (res && (res.success || res.data)) {
        setNotification(`Invitation successfully sent to ${reviewerEmail.trim()}!`);
        setShowSendModal(false);
        setReviewerName('');
        setReviewerEmail('');
        setInstructions('');
        setFormError('');
        loadInvitations();
        setTimeout(() => setNotification(''), 4000);
      } else {
        setFormError(res?.message || 'Failed to dispatch invitation. Please verify reviewer details.');
      }
    } catch (err) {
      console.error(err);
      const msg = err.message || err.error || 'Failed to send invitation. Please check your network or email configuration.';
      setFormError(msg);
    } finally {
      setSending(false);
    }
  };

  const handleSendBulk = async (e) => {
    e.preventDefault();
    if (!bulkText.trim()) return;

    setSending(true);
    setBulkError('');
    try {
      // Parse line-by-line: Name, Email, Category (optional)
      const lines = bulkText.split('\n').filter((l) => l.trim().length > 0);
      const list = [];

      for (const line of lines) {
        const parts = line.split(',').map((p) => p.trim());
        if (parts.length >= 2) {
          const name = parts[0];
          const email = parts[1].toLowerCase();
          const cat = parts[2] ? parts[2].toUpperCase().replace(/\s+/g, '_') : 'PEER_1';
          list.push({
            reviewerName: name,
            reviewerEmail: email,
            reviewCategory: cat,
            expiryDays: 14,
          });
        }
      }

      if (list.length === 0) {
        setBulkError('Could not parse any valid invitations. Format: Name, email@domain.com, Category');
        setSending(false);
        return;
      }

      const res = await adminFeedbackApi.sendBulkInvitations({ invitations: list });
      setNotification(`Dispatched ${list.length} invitations successfully!`);
      setShowBulkModal(false);
      setBulkText('');
      setBulkError('');
      loadInvitations();
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error(err);
      const msg = err.message || err.error || 'Failed to process bulk invitations.';
      setBulkError(msg);
    } finally {
      setSending(false);
    }
  };

  const handleResend = async (id, email) => {
    try {
      await adminFeedbackApi.resendInvitation(id);
      setNotification(`Invitation email resent to ${email}!`);
      loadInvitations();
      setTimeout(() => setNotification(''), 3500);
    } catch (err) {
      console.error(err);
      setNotification(err.message || 'Failed to resend invitation email.');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleRetry = async (id, email) => {
    try {
      setNotification(`Retrying email delivery to ${email}...`);
      const res = await adminFeedbackApi.retryInvitation(id);
      if (res?.success) {
        setNotification(res.message || `Email delivery retry completed for ${email}!`);
      } else {
        setNotification(res?.message || 'Retry finished.');
      }
      loadInvitations();
      setTimeout(() => setNotification(''), 5000);
    } catch (err) {
      console.error(err);
      setNotification(err.message || 'Failed to retry email delivery.');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel and delete this invitation?')) return;
    try {
      await adminFeedbackApi.deleteInvitation(id);
      setNotification('Invitation removed.');
      loadInvitations();
      setTimeout(() => setNotification(''), 3500);
    } catch (err) {
      console.error(err);
      setNotification(err.message || 'Failed to delete invitation.');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleCopyLink = (inv) => {
    const url = inv.publicFeedbackUrl || `${window.location.origin}/feedback/${inv.token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(inv.token);
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      setNotification('Copied local review link. Note: For mobile phones or external devices, configure APP_BASE_URL in Admin Settings.');
    } else {
      setNotification('Copied global cross-device review link! Share this with your employee directly.');
    }
    setTimeout(() => {
      setCopiedToken(null);
      setNotification('');
    }, 4500);
  };

  const filtered = useMemo(() => {
    return invitations.filter((inv) => {
      const matchStatus = statusFilter === 'ALL' || inv.status === statusFilter;
      const matchCat = categoryFilter === 'ALL' || inv.reviewCategory === categoryFilter;
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !searchQuery ||
        inv.reviewerName.toLowerCase().includes(q) ||
        inv.reviewerEmail.toLowerCase().includes(q);
      return matchStatus && matchCat && matchQuery;
    });
  }, [invitations, statusFilter, categoryFilter, searchQuery]);

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
              Email Invitations
            </span>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Single-Use Review Tokens (No Login Required)
            </span>
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            Manage Feedback Invitations
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.35rem', maxWidth: '650px' }}>
            Send personalized review invitations via email. Each reviewer receives a unique, single-use token link allowing them to evaluate you directly without creating an account.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setBulkError(''); setShowBulkModal(true); }}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
          >
            <Users size={16} />
            <span>Bulk Send</span>
          </button>

          <button
            onClick={() => { setFormError(''); setShowSendModal(true); }}
            className="btn btn-primary"
            style={{
              padding: '0.65rem 1.25rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(37,99,235,0.35)',
            }}
          >
            <Send size={16} />
            <span>Send New Invitation</span>
          </button>
        </div>
      </div>

      {notification && (
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
          <span>{notification}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        className="glastic-card"
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by reviewer name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.2rem', width: '280px', fontSize: '0.825rem' }}
            />
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ fontSize: '0.825rem', width: '160px' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Submissions</option>
            <option value="SUBMITTED">Completed / Submitted</option>
            <option value="EXPIRED">Expired Tokens</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-select"
            style={{ fontSize: '0.825rem', width: '180px' }}
          >
            <option value="ALL">All Review Categories</option>
            <option value="MANAGER">Manager Review</option>
            <option value="PEER_1">Peer Review 1 (PR1)</option>
            <option value="PEER_2">Peer Review 2 (PR2)</option>
            <option value="PEER_3">Peer Review 3 (PR3)</option>
            <option value="TEAM_LEAD">Team Lead Review</option>
            <option value="HR">HR Review</option>
            <option value="GENERAL">General Feedback</option>
          </select>
        </div>

        <button
          onClick={loadInvitations}
          className="btn btn-secondary"
          style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Invitations Table */}
      <div className="glastic-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Tracked Invitations ({filtered.length})
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Every link is single-use and evaluates Mohan Kilaparthi exclusively.
            </p>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table" style={{ fontSize: '0.825rem' }}>
            <thead>
              <tr>
                <th>Reviewer Name &amp; Email</th>
                <th>Category</th>
                <th style={{ textAlign: 'center' }}>Email Delivery</th>
                <th style={{ textAlign: 'center' }}>Review Status</th>
                <th>Sent Timestamp</th>
                <th>Completed Date</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading invitations...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No invitations match your search or filter.
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => {
                  const isSubmitted = inv.status === 'SUBMITTED';
                  const isCopied = copiedToken === inv.token;
                  const emailStatus = inv.emailDeliveryStatus || 'PENDING';

                  return (
                    <tr key={inv.id}>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{inv.reviewerName}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{inv.reviewerEmail}</div>
                      </td>
                      <td>
                        <span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontWeight: 700 }}>
                          {inv.reviewCategory?.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {emailStatus === 'SENT' ? (
                          <span
                            title="Accepted and delivered to recipient mail server"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '20px',
                              background: 'rgba(37, 99, 235, 0.12)',
                              color: '#2563eb',
                              fontSize: '0.725rem',
                              fontWeight: 800,
                              border: '1px solid rgba(37, 99, 235, 0.3)',
                            }}
                          >
                            <Send size={11} /> Sent (Accepted)
                          </span>
                        ) : emailStatus === 'DELIVERED' ? (
                          <span
                            title="Confirmed delivered to reviewer inbox"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '20px',
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: '#059669',
                              fontSize: '0.725rem',
                              fontWeight: 800,
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                            }}
                          >
                            <CheckCircle size={11} /> Delivered
                          </span>
                        ) : emailStatus === 'OPENED' ? (
                          <span
                            title="Reviewer opened the feedback form"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '20px',
                              background: 'rgba(139, 92, 246, 0.15)',
                              color: '#7c3aed',
                              fontSize: '0.725rem',
                              fontWeight: 800,
                              border: '1px solid rgba(139, 92, 246, 0.3)',
                            }}
                          >
                            <Sparkles size={11} /> Opened
                          </span>
                        ) : emailStatus === 'BOUNCED' ? (
                          <span
                            title={inv.emailDeliveryError || 'Mailbox address rejected'}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '20px',
                              background: 'rgba(239, 68, 68, 0.15)',
                              color: '#dc2626',
                              fontSize: '0.725rem',
                              fontWeight: 800,
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                            }}
                          >
                            <AlertTriangle size={11} /> Bounced
                          </span>
                        ) : emailStatus === 'FAILED' ? (
                          <span
                            title={inv.emailDeliveryError || 'SMTP Delivery Failed'}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '20px',
                              background: 'rgba(239, 68, 68, 0.15)',
                              color: '#dc2626',
                              fontSize: '0.725rem',
                              fontWeight: 800,
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              cursor: 'help',
                            }}
                          >
                            <AlertTriangle size={11} /> Delivery Failed
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '20px',
                              background: 'rgba(148, 163, 184, 0.15)',
                              color: 'var(--text-muted)',
                              fontSize: '0.725rem',
                              fontWeight: 700,
                            }}
                          >
                            <Clock size={11} /> {emailStatus}
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {isSubmitted ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '20px',
                              background: 'rgba(16, 185, 129, 0.12)',
                              color: '#059669',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                            }}
                          >
                            <CheckCircle size={13} /> Completed
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '20px',
                              background: 'rgba(245, 158, 11, 0.12)',
                              color: '#d97706',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                            }}
                          >
                            <Clock size={13} /> Pending
                          </span>
                        )}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.775rem' }}>
                        {inv.sentAt ? new Date(inv.sentAt).toLocaleString() : 'N/A'}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.775rem' }}>
                        {inv.submittedAt ? new Date(inv.submittedAt).toLocaleString() : '—'}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                          {/* Copy Link Button */}
                          <button
                            onClick={() => handleCopyLink(inv)}
                            className="btn btn-secondary"
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                            title="Copy reviewer's cross-device direct feedback link"
                          >
                            {isCopied ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                            <span>{isCopied ? 'Copied' : 'Copy Link'}</span>
                          </button>

                          {/* Retry Button (if FAILED or BOUNCED) */}
                          {(emailStatus === 'FAILED' || emailStatus === 'BOUNCED') && !isSubmitted && (
                            <button
                              onClick={() => handleRetry(inv.id, inv.reviewerEmail)}
                              className="btn btn-primary"
                              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#dc2626' }}
                              title="Retry sending real email to reviewer"
                            >
                              <RefreshCw size={12} />
                              <span>Retry Email</span>
                            </button>
                          )}

                          {/* Resend Email Button (if pending and not failed) */}
                          {!isSubmitted && emailStatus !== 'FAILED' && emailStatus !== 'BOUNCED' && (
                            <button
                              onClick={() => handleResend(inv.id, inv.reviewerEmail)}
                              className="btn btn-outline"
                              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                              title="Resend invitation email"
                            >
                              <Send size={12} />
                              <span>Resend</span>
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(inv.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--danger)',
                              padding: '0.35rem',
                              opacity: 0.7,
                            }}
                            title="Delete invitation"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Send Individual Invitation */}
      {showSendModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1.25rem',
          }}
          onClick={() => setShowSendModal(false)}
        >
          <div
            className="glastic-card"
            style={{
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              borderRadius: '16px',
              border: '1.5px solid var(--primary)',
              background: 'var(--bg-card)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '0.2rem' }}>
                  Send Email Invitation
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                  Invite Reviewer to Evaluate Mohan Kilaparthi
                </h3>
              </div>
              <button onClick={() => setShowSendModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendSingle} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {formError && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <AlertTriangle size={16} />
                  <span>{formError}</span>
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  Reviewer Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Kim"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  Reviewer Email Address (for email delivery) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="david.peer@enterprise.com"
                  value={reviewerEmail}
                  onChange={(e) => setReviewerEmail(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  Review Category *
                </label>
                <select
                  value={reviewCategory}
                  onChange={(e) => setReviewCategory(e.target.value)}
                  className="form-select"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                >
                  {categoryOptions.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  Optional Custom Instructions to Reviewer:
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Please focus on cross-team collaboration and technical foresight."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', fontSize: '0.825rem' }}
                />
              </div>

              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  fontSize: '0.775rem',
                  color: '#059669',
                }}
              >
                🔒 The reviewer will receive a unique, single-use token link. No login or registration is required for them to submit.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowSendModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="btn btn-primary"
                  style={{ padding: '0.55rem 1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Send size={15} />
                  <span>{sending ? 'Sending Invitation...' : 'Send Invitation Email'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Bulk Send Invitations */}
      {showBulkModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1.25rem',
          }}
          onClick={() => setShowBulkModal(false)}
        >
          <div
            className="glastic-card"
            style={{
              maxWidth: '620px',
              width: '100%',
              padding: '2rem',
              borderRadius: '16px',
              border: '1.5px solid var(--primary)',
              background: 'var(--bg-card)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '0.2rem' }}>
                  Bulk Email Invitations
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                  Send Multiple 360 Review Invitations
                </h3>
              </div>
              <button onClick={() => setShowBulkModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Enter one reviewer per line in CSV format: <code>Full Name, Email, Category</code>.<br />
              Supported categories: <code>MANAGER</code>, <code>PEER_1</code>, <code>PEER_2</code>, <code>PEER_3</code>, <code>TEAM_LEAD</code>, <code>HR</code>, <code>GENERAL</code>
            </p>

            <form onSubmit={handleSendBulk} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {bulkError && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <AlertTriangle size={16} />
                  <span>{bulkError}</span>
                </div>
              )}
              <textarea
                rows={6}
                required
                placeholder="David Kim, david.peer@enterprise.com, PEER_1&#10;Emma Watson, emma.directreport@enterprise.com, PEER_2&#10;Marcus Vance, marcus.crossfunctional@enterprise.com, TEAM_LEAD&#10;Elena Rostova, hr.admin@enterprise.com, HR"
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                className="form-input"
                style={{ width: '100%', fontSize: '0.825rem', fontFamily: 'monospace' }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowBulkModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="btn btn-primary"
                  style={{ padding: '0.55rem 1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Send size={15} />
                  <span>{sending ? 'Dispatching Invitations...' : 'Send All Invitations'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
