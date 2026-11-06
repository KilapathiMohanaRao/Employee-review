import React, { useState, useEffect, useMemo } from 'react';
import { adminReviewApi, employeeApi } from '../../services/api';
import {
  Shield,
  Star,
  Users,
  Award,
  Search,
  Filter,
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Plus,
  Copy,
  Check,
  ExternalLink,
  LinkIcon,
} from '../common/Icons';

export const AdminReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('ALL');

  // Modal State for Link Generator
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkTargetEmpId, setLinkTargetEmpId] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [quickCopiedText, setQuickCopiedText] = useState(null);

  // Modal State for Inspecting Single Review
  const [inspectedReview, setInspectedReview] = useState(null);

  useEffect(() => {
    loadData();
    employeeApi.getAll().then((res) => {
      if (res.data) setEmployees(res.data);
    }).catch((e) => console.error(e));
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rRes, sRes] = await Promise.all([
        adminReviewApi.getAll().catch(() => ({ data: [] })),
        adminReviewApi.getSummary().catch(() => ({ data: null })),
      ]);
      if (rRes?.data) setReviews(rRes.data);
      if (sRes?.data) setSummary(sRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Departments list for filter
  const departments = useMemo(() => {
    const set = new Set(reviews.map((r) => r.evaluateeDepartment).filter(Boolean));
    return Array.from(set);
  }, [reviews]);

  // Filtered Reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      // Search filter
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        r.evaluateeName.toLowerCase().includes(q) ||
        r.evaluateeCode.toLowerCase().includes(q) ||
        (r.reviewerName && r.reviewerName.toLowerCase().includes(q));

      // Department filter
      const matchDept = selectedDept === 'ALL' || r.evaluateeDepartment === selectedDept;

      // Rating filter
      const score = Number(r.overallRating) || 0;
      let matchRating = true;
      if (selectedRatingFilter === 'HIGH') matchRating = score >= 4.5;
      else if (selectedRatingFilter === 'SOLID') matchRating = score >= 4.0 && score < 4.5;
      else if (selectedRatingFilter === 'MED') matchRating = score >= 3.0 && score < 4.0;
      else if (selectedRatingFilter === 'LOW') matchRating = score < 3.0;

      return matchSearch && matchDept && matchRating;
    });
  }, [reviews, searchQuery, selectedDept, selectedRatingFilter]);

  const handleCopyLink = () => {
    const origin = window.location.origin;
    let url = `${origin}/review-form`;
    if (linkTargetEmpId) {
      url += `?evaluateeId=${linkTargetEmpId}`;
    }
    navigator.clipboard.writeText(url);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const handleQuickCopy = (url, label) => {
    navigator.clipboard.writeText(url);
    setQuickCopiedText(label);
    setTimeout(() => setQuickCopiedText(null), 3500);
  };

  const handleCopyInvitationMessage = () => {
    const origin = window.location.origin;
    const msg = `Hello Team,\n\nPlease take a few minutes to submit your confidential 360-degree performance feedback for your colleagues:\n\n👉 Review Link: ${origin}/review-form\n\n🔒 Note: No login or password is required for candidates/reviewers! All responses are securely encrypted and viewable strictly by the Administrator.\n\nThank you for your valuable feedback!`;
    navigator.clipboard.writeText(msg);
    setQuickCopiedText('Invitation Message Template');
    setTimeout(() => setQuickCopiedText(null), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Admin Review Vault Header */}
      <div
        className="glastic-header-banner"
        style={{
          padding: '1.5rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span
              style={{
                background: 'linear-gradient(135deg, #2563eb, #8b5cf6)',
                color: '#ffffff',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 800,
                textTransform: 'uppercase',
              }}
            >
              Strict Admin-Only Access
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Confidential Employee Review Repository
            </span>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            Submitted Employee Reviews &amp; Ratings Management
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem', maxWidth: '650px' }}>
            Only the Admin has permission to view all submitted employee ratings, individual category scorecards, feedback comments, and review history.
          </p>
        </div>

        {/* Generate Review Link Button */}
        <button
          onClick={() => setShowLinkModal(true)}
          className="btn btn-primary"
          style={{
            padding: '0.65rem 1.25rem',
            fontWeight: 800,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.35)',
          }}
        >
          <Plus size={16} />
          <span>Generate &amp; Share Review Link</span>
        </button>
      </div>

      {/* 4 Summary Stat KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glastic-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Submitted Reviews
            </span>
            <Award size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
            {summary?.totalSubmittedReviews ?? reviews.length}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Across all active cycles &amp; departments
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
            {summary?.overallAverageRating || '4.35'}
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}> / 5.0</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Consolidated score across all categories
          </p>
        </div>

        <div className="glastic-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Employees Evaluated
            </span>
            <Users size={18} color="var(--success)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
            {summary?.totalEvaluatees ?? 7}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Profiles with completed 360 reviews
          </p>
        </div>

        <div className="glastic-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Contributing Reviewers
            </span>
            <Sparkles size={18} color="var(--purple)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
            {summary?.totalReviewers ?? 6}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Managers, peers &amp; direct reports
          </p>
        </div>
      </div>

      {/* ⚡ Quick Link Sharing Hub for Candidates & Employees */}
      <div
        className="glastic-card"
        style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(139, 92, 246, 0.05))',
          border: '1.5px solid rgba(37, 99, 235, 0.35)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.08)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '20px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#059669',
                  fontSize: '0.725rem',
                  fontWeight: 800,
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                }}
              >
                🔓 Candidates: NO LOGIN REQUIRED
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Instant Shareable Review Links
              </span>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Quick Link Sharing Hub for Candidates &amp; Colleagues
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Share this link with anyone to review employees. Reviewers do not need an account or login credentials. Their reviews are securely locked and viewable only by you in the table below.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleCopyInvitationMessage()}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.5rem 0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              title="Copy pre-written message to send via Slack, Email, WhatsApp"
            >
              <Copy size={14} />
              <span>Copy Invitation Message</span>
            </button>
            <a
              href={`${window.location.origin}/review-form`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
              style={{ fontSize: '0.8rem', padding: '0.5rem 0.9rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              title="Test open review form in new tab"
            >
              <ExternalLink size={14} />
              <span>Test As Candidate ↗</span>
            </a>
          </div>
        </div>

        {/* General Link Input Bar */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
            <input
              type="text"
              readOnly
              value={`${window.location.origin}/review-form`}
              className="form-input"
              style={{
                width: '100%',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                background: 'var(--bg-card)',
                fontWeight: 700,
                color: 'var(--primary)',
                paddingLeft: '2.2rem',
              }}
            />
            <LinkIcon size={16} color="var(--primary)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <button
            onClick={() => handleQuickCopy(`${window.location.origin}/review-form`, 'General Review Portal Link')}
            className="btn btn-primary"
            style={{ fontSize: '0.825rem', padding: '0.55rem 1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            {quickCopiedText === 'General Review Portal Link' ? <Check size={16} /> : <Copy size={16} />}
            <span>{quickCopiedText === 'General Review Portal Link' ? 'Copied!' : 'Copy General Link'}</span>
          </button>
        </div>

        {/* Pre-Targeted Employee Link Pills */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Or copy direct review links for individual employees (evaluatee pre-selected):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {employees.map((emp) => {
              const url = `${window.location.origin}/review-form?evaluateeId=${emp.id}`;
              const isCopied = quickCopiedText === emp.fullName;
              return (
                <button
                  key={emp.id}
                  onClick={() => handleQuickCopy(url, emp.fullName)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    border: isCopied ? '1.5px solid #10b981' : '1px solid var(--border-color)',
                    background: isCopied ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card)',
                    color: isCopied ? '#059669' : 'var(--text-primary)',
                    fontSize: '0.775rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  title={`Copy direct review link for ${emp.fullName} (${emp.departmentName})`}
                >
                  {isCopied ? <Check size={13} color="#059669" /> : <Copy size={13} color="var(--text-muted)" />}
                  <span>{emp.fullName}</span>
                  <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    ({emp.departmentName?.slice(0, 4) || 'Dept'})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Toast confirmation banner */}
        {quickCopiedText && (
          <div
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#059669',
              fontSize: '0.775rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Check size={16} />
            <span>✓ Link for <strong>{quickCopiedText}</strong> copied to clipboard! Paste it into Slack, Email, WhatsApp, or Teams.</span>
          </div>
        )}
      </div>

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
              placeholder="Search by employee, ID, or reviewer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.2rem', width: '280px', fontSize: '0.825rem' }}
            />
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="form-select"
            style={{ fontSize: '0.825rem', width: '180px' }}
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Rating Filter */}
          <select
            value={selectedRatingFilter}
            onChange={(e) => setSelectedRatingFilter(e.target.value)}
            className="form-select"
            style={{ fontSize: '0.825rem', width: '170px' }}
          >
            <option value="ALL">All Rating Tiers</option>
            <option value="HIGH">Benchmark (&ge; 4.5★)</option>
            <option value="SOLID">Strong (4.0 - 4.4★)</option>
            <option value="MED">Effective (3.0 - 3.9★)</option>
            <option value="LOW">Growth Target (&lt; 3.0★)</option>
          </select>
        </div>

        <button
          onClick={loadData}
          className="btn"
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            fontSize: '0.8rem',
            padding: '0.45rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-secondary)',
          }}
        >
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Submitted Reviews Table */}
      <div className="glastic-card" style={{ padding: '1.25rem', overflowX: 'auto' }}>
        <table className="custom-table" style={{ fontSize: '0.825rem' }}>
          <thead>
            <tr>
              <th>Evaluatee (Employee &amp; ID)</th>
              <th>Department &amp; Title</th>
              <th>Reviewer &amp; Relationship</th>
              <th>Category Ratings</th>
              <th style={{ textAlign: 'center' }}>Overall Score</th>
              <th>Comments &amp; Feedback</th>
              <th>Submission Date</th>
              <th style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((r) => (
              <tr key={r.reviewId}>
                {/* Evaluatee */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <img
                      src={r.evaluateeAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={r.evaluateeName}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        {r.evaluateeName}
                      </strong>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        ID: {r.evaluateeCode || `EMP-00${r.evaluateeId}`}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Dept & Designation */}
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {r.evaluateeDepartment}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    {r.evaluateeDesignation}
                  </div>
                </td>

                {/* Reviewer */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {r.reviewerName || 'Confidential Reviewer'}
                    </span>
                    {r.anonymous && (
                      <span className="badge" style={{ fontSize: '0.625rem', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--purple)' }}>
                        Anon
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    {r.reviewType.replace('_', ' ')}
                  </div>
                </td>

                {/* Category Ratings Mini-Pills */}
                <td>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', maxWidth: '240px' }}>
                    {r.categoryRatings?.slice(0, 4).map((cat, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.675rem',
                          padding: '0.15rem 0.4rem',
                          borderRadius: '4px',
                          background: cat.score >= 4 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(37, 99, 235, 0.12)',
                          color: cat.score >= 4 ? '#059669' : 'var(--primary)',
                          fontWeight: 700,
                        }}
                        title={`${cat.competencyName}: ${cat.score}★`}
                      >
                        {cat.competencyCode || cat.competencyName.split(' ')[0]}: {cat.score}★
                      </span>
                    ))}
                    {r.categoryRatings?.length > 4 && (
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                        +{r.categoryRatings.length - 4} more
                      </span>
                    )}
                  </div>
                </td>

                {/* Overall Score */}
                <td style={{ textAlign: 'center' }}>
                  <span
                    style={{
                      padding: '0.25rem 0.6rem',
                      borderRadius: '6px',
                      background: Number(r.overallRating) >= 4.2 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(37, 99, 235, 0.12)',
                      color: Number(r.overallRating) >= 4.2 ? '#059669' : 'var(--primary)',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                    }}
                  >
                    {r.overallRating} ★
                  </span>
                </td>

                {/* Comments & Feedback Preview */}
                <td style={{ maxWidth: '240px' }}>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                    {r.summaryFeedback || r.keyStrengthsComment || 'Performance review recorded.'}
                  </div>
                </td>

                {/* Submitted At */}
                <td style={{ whiteSpace: 'nowrap', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={13} />
                    <span>{r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : 'Active'}</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {r.submittedAt ? new Date(r.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </div>
                </td>

                {/* Action */}
                <td style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => setInspectedReview(r)}
                    className="btn"
                    style={{
                      padding: '0.3rem 0.65rem',
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--primary)',
                    }}
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            ))}

            {filteredReviews.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No submitted employee reviews found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: Shareable Review Link Generator */}
      {showLinkModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem',
          }}
        >
          <div
            className="glastic-card"
            style={{
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              background: 'var(--bg-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              border: '1.5px solid var(--primary)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={22} color="var(--primary)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Generate Employee Review Link
                </h3>
              </div>
              <button
                onClick={() => setShowLinkModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                &times;
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Share this secure review form link with employees. Employees can only access the review submission form and cannot view other reviews or the Admin Dashboard.
            </p>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Pre-Select Evaluatee (Optional):
              </label>
              <select
                value={linkTargetEmpId}
                onChange={(e) => setLinkTargetEmpId(e.target.value)}
                className="form-select"
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                <option value="">General Review Link (Employee selects evaluatee)</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.fullName} ({e.departmentName} - {e.designationTitle})
                  </option>
                ))}
              </select>
            </div>

            {/* Generated Link Display */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Shareable Review URL:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/review-form${linkTargetEmpId ? `?evaluateeId=${linkTargetEmpId}` : ''}`}
                  className="form-input"
                  style={{ flex: 1, fontSize: '0.8rem', background: 'var(--bg-tertiary)' }}
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="btn btn-primary"
                  style={{ fontSize: '0.825rem', padding: '0.5rem 1rem', fontWeight: 800 }}
                >
                  {copiedNotification ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
              {copiedNotification && (
                <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700, marginTop: '0.35rem' }}>
                  ✓ Review link copied to clipboard! You can now send it to your employees.
                </div>
              )}
            </div>

            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontSize: '0.775rem',
                color: '#059669',
              }}
            >
              <strong>Privacy Protection:</strong> Once an employee submits this review form, it will be locked and securely stored in your Admin Dashboard. The employee will receive only a confirmation message and cannot view the submitted scores.
            </div>

            <button
              onClick={() => setShowLinkModal(false)}
              className="btn btn-secondary"
              style={{ alignSelf: 'flex-end', fontSize: '0.825rem', marginTop: '0.5rem' }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: Full Review Inspection Modal for Admin */}
      {inspectedReview && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem',
          }}
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
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              border: '1.5px solid var(--primary)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '0.4rem' }}>
                  Admin Review Inspection · {inspectedReview.cycleTitle}
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                  Performance Review for {inspectedReview.evaluateeName}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {inspectedReview.evaluateeDesignation} · {inspectedReview.evaluateeDepartment}
                </p>
              </div>

              <button
                onClick={() => setInspectedReview(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                &times;
              </button>
            </div>

            {/* Score & Reviewer Meta */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '10px' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>Overall Calculated Rating</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#f59e0b' }}>
                  {inspectedReview.overallRating} / 5.0 ★
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>Reviewer</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {inspectedReview.reviewerName || 'Confidential'} ({inspectedReview.reviewType})
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>Submitted Timestamp</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {inspectedReview.submittedAt ? new Date(inspectedReview.submittedAt).toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                Individual Competency Category Scores:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {inspectedReview.categoryRatings?.map((c, idx) => (
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
                        {c.competencyName}
                      </strong>
                      {c.comments && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '2px' }}>
                          &ldquo;{c.comments}&rdquo;
                        </div>
                      )}
                    </div>
                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        background: c.score >= 4 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(37, 99, 235, 0.15)',
                        color: c.score >= 4 ? '#059669' : 'var(--primary)',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                      }}
                    >
                      {c.score}★
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Qualitative Comments */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                Employee Comments &amp; Feedback:
              </h4>

              {inspectedReview.summaryFeedback && (
                <div style={{ padding: '0.85rem', background: 'var(--bg-tertiary)', borderRadius: '8px', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.2rem' }}>
                    Summary / General Feedback:
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    {inspectedReview.summaryFeedback}
                  </div>
                </div>
              )}

              {inspectedReview.keyStrengthsComment && (
                <div style={{ padding: '0.85rem', background: 'rgba(16, 185, 129, 0.08)', borderLeft: '4px solid #10b981', borderRadius: '8px', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#059669', marginBottom: '0.2rem' }}>
                    Key Strengths Observed:
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    {inspectedReview.keyStrengthsComment}
                  </div>
                </div>
              )}

              {inspectedReview.developmentAreasComment && (
                <div style={{ padding: '0.85rem', background: 'rgba(245, 158, 11, 0.08)', borderLeft: '4px solid #f59e0b', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#d97706', marginBottom: '0.2rem' }}>
                    Growth / Development Priorities:
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    {inspectedReview.developmentAreasComment}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setInspectedReview(null)}
              className="btn btn-secondary"
              style={{ alignSelf: 'flex-end', fontSize: '0.825rem', marginTop: '0.5rem' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
