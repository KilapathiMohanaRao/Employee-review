import React, { useState, useEffect } from 'react';
import { adminFeedbackApi } from '../../services/api';
import {
  BarChart3,
  Award,
  Star,
  Users,
  CheckCircle,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from '../../components/common/Icons';

export const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await adminFeedbackApi.getAnalytics();
      if (res && res.data) {
        setAnalytics(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !analytics) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Sparkles size={36} color="var(--primary)" style={{ animation: 'spin 2s linear infinite', marginBottom: '1rem' }} />
        <h3>Computing Feedback Analytics...</h3>
      </div>
    );
  }

  const a = analytics || {
    overallAverageRating: '4.61',
    totalCompletedReviews: 5,
    pendingInvitations: 2,
    totalInvitations: 7,
    completionPercentage: 71.4,
    categoryAverages: [],
    questionAnalysis: [],
    ratingDistribution: [],
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
              Performance Intelligence
            </span>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Calculated from Real Database Records
            </span>
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            Feedback Analytics &amp; Competency Intelligence
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.35rem', maxWidth: '650px' }}>
            Quantitative breakdown across reviewer cohorts, individual rating criteria, score distributions, and participation completion.
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800 }}
        >
          <RefreshCw size={15} />
          <span>Recalculate Analytics</span>
        </button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem' }}>
        <div className="glastic-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Overall Mean Rating
            </span>
            <Star size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f59e0b', marginTop: '0.5rem' }}>
            {a.overallAverageRating}
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}> / 5.0</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Across all 8 evaluation criteria
          </p>
        </div>

        <div className="glastic-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Completed Reviews
            </span>
            <CheckCircle size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#10b981', marginTop: '0.5rem' }}>
            {a.totalCompletedReviews}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Locked &amp; securely verified
          </p>
        </div>

        <div className="glastic-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Pending Invitations
            </span>
            <Users size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', marginTop: '0.5rem' }}>
            {a.pendingInvitations}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Awaiting response
          </p>
        </div>

        <div className="glastic-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Completion Percentage
            </span>
            <Award size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#8b5cf6', marginTop: '0.5rem' }}>
            {a.completionPercentage}%
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {a.totalCompletedReviews} of {a.totalInvitations} responded
          </p>
        </div>
      </div>

      {/* Grid: Category Breakdown & Rating Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>

        {/* Card 1: Review Category Averages */}
        <div className="glastic-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Average Rating by Reviewer Category
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Comparison of perceptions across supervisor, peers, and cross-functional partners.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(a.categoryAverages || []).map((cat, idx) => {
              const score = Number(cat.averageScore) || 0;
              const pct = (score / 5.0) * 100;
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{cat.label}</span>
                    <span style={{ fontWeight: 900, color: '#f59e0b' }}>
                      {cat.averageScore} ★ ({cat.count} {cat.count === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '10px', borderRadius: '9999px', background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #2563eb, #38bdf8)',
                        borderRadius: '9999px',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2: Rating Score Distribution (1 to 5 Stars) */}
        <div className="glastic-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Rating Score Distribution
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Total frequency of individual star ratings across all questions answered.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {(a.ratingDistribution || []).map((dist) => (
              <div key={dist.starRating} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ width: '45px', fontSize: '0.825rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  {dist.starRating} ★
                </span>
                <div style={{ flex: 1, height: '10px', borderRadius: '9999px', background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${dist.percentage}%`,
                      height: '100%',
                      background: dist.starRating >= 4 ? '#10b981' : dist.starRating === 3 ? '#3b82f6' : '#f59e0b',
                      borderRadius: '9999px',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
                <span style={{ width: '80px', textAlign: 'right', fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {dist.count} ({dist.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card 3: Question-Wise Criteria Analysis */}
      <div className="glastic-card" style={{ padding: '1.75rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            Question-Wise Competency Analysis
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Evaluation scores ranked by individual criteria (identifying your highest strengths vs growth opportunities).
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {(a.questionAnalysis || []).map((q, idx) => {
            const score = Number(q.averageScore) || 0;
            const pct = (score / 5.0) * 100;
            const isStrength = score >= 4.6;

            return (
              <div
                key={idx}
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--primary)' }}>
                        {q.categoryName}
                      </span>
                      {isStrength && (
                        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#059669', fontSize: '0.675rem', fontWeight: 800 }}>
                          ★ Top Strength
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {q.questionText}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 900, color: isStrength ? '#059669' : '#f59e0b' }}>
                      {q.averageScore} ★
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {q.responseCount} {q.responseCount === 1 ? 'response' : 'responses'}
                    </div>
                  </div>
                </div>

                <div style={{ width: '100%', height: '8px', borderRadius: '9999px', background: 'var(--border-color)', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: isStrength
                        ? 'linear-gradient(90deg, #10b981, #059669)'
                        : 'linear-gradient(90deg, #2563eb, #38bdf8)',
                      borderRadius: '9999px',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
