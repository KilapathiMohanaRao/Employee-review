import React, { useState, useEffect, useMemo } from 'react';
import { adminFeedbackApi } from '../../services/api';
import {
  Award,
  Star,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Sparkles,
  Download,
  CheckCircle,
  Clock,
  Shield,
  X,
} from '../../components/common/Icons';

export const AdminSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [ratingFilter, setRatingFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('NEWEST');

  // Modal inspection
  const [inspectedReview, setInspectedReview] = useState(null);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const res = await adminFeedbackApi.getSubmissions();
      if (res && res.data) {
        setSubmissions(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    window.open(adminFeedbackApi.exportCsvUrl, '_blank');
  };

  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      const matchCat = categoryFilter === 'ALL' || s.reviewCategory === categoryFilter;
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !searchQuery ||
        s.reviewerName.toLowerCase().includes(q) ||
        s.reviewerEmail.toLowerCase().includes(q) ||
        (s.summaryFeedback && s.summaryFeedback.toLowerCase().includes(q));

      const score = Number(s.overallRating) || 0;
      let matchRating = true;
      if (ratingFilter === 'HIGH') matchRating = score >= 4.5;
      else if (ratingFilter === 'SOLID') matchRating = score >= 4.0 && score < 4.5;
      else if (ratingFilter === 'MED') matchRating = score < 4.0;

      return matchCat && matchQuery && matchRating;
    }).sort((a, b) => {
      if (sortBy === 'NEWEST') return new Date(b.submittedAt) - new Date(a.submittedAt);
      if (sortBy === 'HIGHEST') return (b.overallRating || 0) - (a.overallRating || 0);
      if (sortBy === 'LOWEST') return (a.overallRating || 0) - (b.overallRating || 0);
      return 0;
    });
  }, [submissions, categoryFilter, ratingFilter, searchQuery, sortBy]);

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
              Confidential Review Vault
            </span>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Submitted Feedback on <strong>Arthur Pendelton (Admin)</strong>
            </span>
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            Submitted Reviews &amp; Ratings Repository
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.35rem', maxWidth: '650px' }}>
            View, filter, and inspect detailed category scorecards, question-wise ratings, and qualitative feedback comments submitted exclusively for you.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportCsv}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
            title="Download CSV workbook for Excel"
          >
            <Download size={15} />
            <span>Export to Excel / CSV</span>
          </button>

          <button
            onClick={loadSubmissions}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800 }}
          >
            <RefreshCw size={15} />
            <span>Refresh Submissions</span>
          </button>
        </div>
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
              placeholder="Search reviewer or comment keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.2rem', width: '280px', fontSize: '0.825rem' }}
            />
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-select"
            style={{ fontSize: '0.825rem', width: '180px' }}
          >
            <option value="ALL">All Categories</option>
            <option value="MANAGER">Manager Review</option>
            <option value="PEER_1">Peer Review 1 (PR1)</option>
            <option value="PEER_2">Peer Review 2 (PR2)</option>
            <option value="PEER_3">Peer Review 3 (PR3)</option>
            <option value="TEAM_LEAD">Team Lead Review</option>
            <option value="HR">HR Review</option>
            <option value="GENERAL">General Feedback</option>
          </select>

          {/* Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="form-select"
            style={{ fontSize: '0.825rem', width: '160px' }}
          >
            <option value="ALL">All Ratings</option>
            <option value="HIGH">Top Tier (4.5★ - 5.0★)</option>
            <option value="SOLID">Solid (4.0★ - 4.49★)</option>
            <option value="MED">Below 4.0★</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select"
            style={{ fontSize: '0.825rem', width: '150px' }}
          >
            <option value="NEWEST">Newest First</option>
            <option value="HIGHEST">Highest Rating</option>
            <option value="LOWEST">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Submissions List Table */}
      <div className="glastic-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Completed 360 Reviews ({filtered.length})
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Every submitted review is stored with full question ratings, timestamps, and qualitative observations.
            </p>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table" style={{ fontSize: '0.825rem' }}>
            <thead>
              <tr>
                <th>Reviewer</th>
                <th>Category</th>
                <th style={{ textAlign: 'center' }}>Overall Score</th>
                <th>Submission Date</th>
                <th>Feedback Summary</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading submitted reviews...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No reviews match the selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
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
                          padding: '0.25rem 0.65rem',
                          borderRadius: '8px',
                          background: Number(sub.overallRating) >= 4.5 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: Number(sub.overallRating) >= 4.5 ? '#059669' : '#d97706',
                          fontWeight: 900,
                          fontSize: '0.9rem',
                        }}
                      >
                        {sub.overallRating} ★
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.775rem' }}>
                      {sub.submittedAt}
                    </td>
                    <td style={{ maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-secondary)' }}>
                      {sub.summaryFeedback || sub.strengthsComment || '—'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => setInspectedReview(sub)}
                        className="btn btn-primary"
                        style={{ fontSize: '0.775rem', padding: '0.4rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <Eye size={14} />
                        <span>Inspect Scorecard</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Full Review Scorecard Inspection */}
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
              maxWidth: '820px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '2rem',
              borderRadius: '16px',
              border: '1.5px solid var(--primary)',
              background: 'var(--bg-card)',
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

            {/* Score & Meta */}
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
                  Arthur Pendelton (Admin)
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>VP of Engineering &amp; Lead Administrator</div>
              </div>
            </div>

            {/* Question Ratings */}
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

            {/* Qualitative Written Comments */}
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <button
                onClick={() => window.print()}
                className="btn btn-outline"
                style={{ fontSize: '0.8rem' }}
              >
                Print / Save PDF
              </button>
              <button
                onClick={() => setInspectedReview(null)}
                className="btn btn-secondary"
                style={{ fontSize: '0.825rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
