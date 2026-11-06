import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminFeedbackApi } from '../../services/api';
import {
  Users,
  Award,
  Star,
  Clock,
  CheckCircle,
  Plus,
  Send,
  Eye,
  RefreshCw,
  Sparkles,
  Shield,
  Copy,
  Check,
  ExternalLink,
} from '../../components/common/Icons';

export const AdminOverviewPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inspectedReview, setInspectedReview] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await adminFeedbackApi.getDashboard();
      if (res && res.data) {
        setDashboard(res.data);
      }
    } catch (e) {
      console.error('Failed to load admin dashboard overview:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleInspectReview = async (id) => {
    try {
      const res = await adminFeedbackApi.getSubmissionById(id);
      if (res && res.data) {
        setInspectedReview(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading && !dashboard) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Sparkles size={36} color="var(--primary)" style={{ animation: 'spin 2s linear infinite', marginBottom: '1rem' }} />
        <h3>Loading Admin 360 Dashboard Overview...</h3>
      </div>
    );
  }

  const d = dashboard || {
    totalInvitationsSent: 7,
    totalSubmissions: 5,
    pendingSubmissions: 2,
    completedSubmissions: 5,
    overallAverageRating: '4.61',
    completionPercentage: 71.4,
    adminName: 'Arthur Pendelton',
    adminTitle: 'VP of Engineering & Lead Administrator',
    campaignTitle: '2026 Admin 360° Comprehensive Leadership Review',
    categoryMetrics: [],
    recentSubmissions: [],
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Admin Executive Header */}
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
              Exclusive Admin Hub
            </span>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Evaluating Admin: <strong>{d.adminName}</strong>
            </span>
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            {d.campaignTitle}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.35rem', maxWidth: '650px' }}>
            Centralized hub collecting confidential 360-degree feedback regarding your leadership, technical direction, and collaboration across candidates, managers, and peers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link
            to="/admin/invitations"
            className="btn btn-primary"
            style={{
              padding: '0.65rem 1.25rem',
              fontWeight: 800,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(37,99,235,0.35)',
            }}
          >
            <Send size={16} />
            <span>Send New Invitation</span>
          </Link>

          <button
            onClick={loadDashboard}
            className="btn btn-secondary"
            style={{ padding: '0.65rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            title="Refresh metrics"
          >
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 6 Key Performance Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div className="glastic-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Invitations Sent
            </span>
            <Send size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
            {d.totalInvitationsSent}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Reviewers invited by email
          </p>
        </div>

        <div className="glastic-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Feedback Submissions
            </span>
            <CheckCircle size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#10b981', marginTop: '0.5rem' }}>
            {d.totalSubmissions}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Completed reviews locked to Admin
          </p>
        </div>

        <div className="glastic-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Pending Submissions
            </span>
            <Clock size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#f59e0b', marginTop: '0.5rem' }}>
            {d.pendingSubmissions}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Awaiting reviewer response
          </p>
        </div>

        <div className="glastic-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Overall Mean Rating
            </span>
            <Star size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#f59e0b', marginTop: '0.5rem' }}>
            {d.overallAverageRating}
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}> / 5.0</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Consolidated score across all categories
          </p>
        </div>

        <div className="glastic-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Completion Rate
            </span>
            <Award size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#8b5cf6', marginTop: '0.5rem' }}>
            {d.completionPercentage}%
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {d.completedSubmissions} of {d.totalInvitationsSent} completed
          </p>
        </div>

        <div className="glastic-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Security &amp; Privacy
            </span>
            <Shield size={18} color="#059669" />
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#059669', marginTop: '0.75rem' }}>
            Admin-Only
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Single-use links &amp; zero reviewer access
          </p>
        </div>
      </div>

      {/* Category Performance Breakdown Grid */}
      <div className="glastic-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Feedback Category Breakdown for {d.adminName}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Comparative ratings across Manager, Peers, Team Lead, HR, and General reviewer cohorts.
            </p>
          </div>
          <Link to="/admin/analytics" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', textDecoration: 'none' }}>
            Full Analytics Charts →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {(d.categoryMetrics || []).map((cat, idx) => (
            <div
              key={idx}
              style={{
                padding: '1rem',
                borderRadius: '12px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {cat.label}
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#f59e0b' }}>
                  {cat.averageRating || '—'} ★
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Submissions: <strong>{cat.completed} / {cat.totalSent}</strong></span>
                <span>{cat.totalSent > 0 ? Math.round((cat.completed / cat.totalSent) * 100) : 0}% response</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Submitted Reviews Table */}
      <div className="glastic-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Latest Submitted Reviews (Admin Vault)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Only you have permission to view submitted ratings and written comments.
            </p>
          </div>
          <Link to="/admin/reviews" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
            View All ({d.totalSubmissions}) Submissions →
          </Link>
        </div>

        <div className="table-container">
          <table className="custom-table" style={{ fontSize: '0.825rem' }}>
            <thead>
              <tr>
                <th>Reviewer</th>
                <th>Category</th>
                <th style={{ textAlign: 'center' }}>Overall Score</th>
                <th>Submission Date</th>
                <th>Comments Preview</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(d.recentSubmissions || []).length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No feedback reviews submitted yet. Send invitations to begin collecting reviews!
                  </td>
                </tr>
              ) : (
                (d.recentSubmissions || []).map((sub) => (
                  <tr key={sub.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{sub.reviewerName}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{sub.reviewerEmail}</div>
                    </td>
                    <td>
                      <span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontWeight: 700 }}>
                        {sub.reviewCategory?.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          background: 'rgba(245, 158, 11, 0.12)',
                          color: '#f59e0b',
                          fontWeight: 900,
                          fontSize: '0.85rem',
                        }}
                      >
                        {sub.overallRating} ★
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.775rem' }}>
                      {sub.submittedAt}
                    </td>
                    <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-secondary)' }}>
                      {sub.summaryFeedback || '—'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => handleInspectReview(sub.id)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <Eye size={13} />
                        <span>Inspect Review</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Inspection Modal */}
      {inspectedReview && (
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
          onClick={() => setInspectedReview(null)}
        >
          <div
            className="glastic-card"
            style={{
              maxWidth: '780px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              background: 'var(--bg-card)',
              borderRadius: '16px',
              border: '1.5px solid var(--primary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '0.4rem' }}>
                  Admin Review Inspection · {inspectedReview.reviewCategory?.replace('_', ' ')}
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                  Feedback Submitted by {inspectedReview.reviewerName}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {inspectedReview.reviewerEmail} · Submitted: {inspectedReview.submittedAt}
                </p>
              </div>

              <button
                onClick={() => setInspectedReview(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                &times;
              </button>
            </div>

            {/* Overall Score Banner */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '10px' }}>
              <div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 700 }}>Overall Evaluation Rating</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f59e0b', marginTop: '0.2rem' }}>
                  {inspectedReview.overallRating} / 5.0 ★
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 700 }}>Evaluated Subject</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  {d.adminName}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.adminTitle}</div>
              </div>
            </div>

            {/* Criteria Scores */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                Question-Wise Criteria Scores:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {inspectedReview.questionRatings?.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.65rem 0.85rem',
                      background: 'var(--bg-tertiary)',
                      borderRadius: '8px',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        {item.categoryName}
                      </strong>
                      <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                        {item.questionText}
                      </div>
                      {item.comment && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontStyle: 'italic', marginTop: '2px' }}>
                          &ldquo;{item.comment}&rdquo;
                        </div>
                      )}
                    </div>
                    <span
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        background: item.score >= 4 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: item.score >= 4 ? '#059669' : '#d97706',
                        fontWeight: 900,
                        fontSize: '0.9rem',
                        flexShrink: 0,
                      }}
                    >
                      {item.score}★
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Qualitative Feedback */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                Written Comments &amp; Feedback:
              </h4>

              {inspectedReview.strengthsComment && (
                <div style={{ padding: '0.85rem', background: 'rgba(16, 185, 129, 0.08)', borderLeft: '4px solid #10b981', borderRadius: '8px', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#059669', marginBottom: '0.2rem' }}>
                    Key Strengths Observed:
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    {inspectedReview.strengthsComment}
                  </div>
                </div>
              )}

              {inspectedReview.improvementsComment && (
                <div style={{ padding: '0.85rem', background: 'rgba(245, 158, 11, 0.08)', borderLeft: '4px solid #f59e0b', borderRadius: '8px', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#d97706', marginBottom: '0.2rem' }}>
                    Growth / Development Priorities:
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    {inspectedReview.improvementsComment}
                  </div>
                </div>
              )}

              {inspectedReview.summaryFeedback && (
                <div style={{ padding: '0.85rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.2rem' }}>
                    Overall Summary Comments:
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    {inspectedReview.summaryFeedback}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setInspectedReview(null)}
              className="btn btn-secondary"
              style={{ alignSelf: 'flex-end', fontSize: '0.825rem' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
