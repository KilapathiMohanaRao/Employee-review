import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { feedbackApi } from '../services/api';
import {
  Shield,
  Star,
  CheckCircle,
  AlertTriangle,
  Lock,
  Sparkles,
  Info,
  Check,
} from '../components/common/Icons';

export const PublicFeedbackPage = () => {
  const { token: pathToken } = useParams();
  const [searchParams] = useSearchParams();
  const token = pathToken || searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] = useState(false);

  // Form input states
  const [ratings, setRatings] = useState({}); // questionId -> score (1-5)
  const [questionComments, setQuestionComments] = useState({}); // questionId -> comment
  const [summaryFeedback, setSummaryFeedback] = useState('');
  const [strengthsComment, setStrengthsComment] = useState('');
  const [improvementsComment, setImprovementsComment] = useState('');

  const ratingLabels = {
    1: { label: 'Poor / Rarely', desc: 'Rarely demonstrates competence or requires direct oversight', color: '#ef4444' },
    2: { label: 'Fair / Inconsistent', desc: 'Demonstrates behaviour inconsistently or with varying quality', color: '#f97316' },
    3: { label: 'Good / Effective', desc: 'Consistently meets high performance standards', color: '#3b82f6' },
    4: { label: 'Very Good / Strong', desc: 'Frequently exceeds expectations and models proactive leadership', color: '#10b981' },
    5: { label: 'Excellent / Role Model', desc: 'Exceptional benchmark exemplar who elevates everyone around them', color: '#8b5cf6' },
  };

  useEffect(() => {
    loadForm();
  }, [token]);

  const loadForm = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await feedbackApi.getForm(token || 'preview');
      if (res && res.data) {
        if (res.data.status === 'SUBMITTED') {
          setIsAlreadySubmitted(true);
        } else if (res.data.status === 'EXPIRED') {
          setIsExpired(true);
        } else {
          setFormData(res.data);
          // Initialize default rating score (4 - Strong)
          const initRatings = {};
          (res.data.questions || []).forEach((q) => {
            initRatings[q.id] = 4;
          });
          setRatings(initRatings);
        }
      } else {
        setErrorMessage('Failed to load feedback form. Please check your invitation link.');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Invalid or expired feedback link.';
      if (msg.includes('already been submitted')) {
        setIsAlreadySubmitted(true);
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (qId, score) => {
    setRatings((prev) => ({
      ...prev,
      [qId]: score,
    }));
  };

  const handleCommentChange = (qId, text) => {
    setQuestionComments((prev) => ({
      ...prev,
      [qId]: text,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    const items = (formData.questions || []).map((q) => ({
      questionId: q.id,
      ratingScore: ratings[q.id] || 4,
      comment: questionComments[q.id] || '',
    }));

    const payload = {
      token: token || 'preview',
      items: items,
      summaryFeedback: summaryFeedback,
      strengthsComment: strengthsComment,
      improvementsComment: improvementsComment,
    };

    try {
      const res = await feedbackApi.submit(payload);
      if (res && res.success) {
        // Wipe local form memory immediately
        setRatings({});
        setQuestionComments({});
        setSummaryFeedback('');
        setStrengthsComment('');
        setImprovementsComment('');
        setIsSuccessfullySubmitted(true);
      } else {
        setErrorMessage(res.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Submission error.';
      if (msg.includes('already been submitted')) {
        setIsAlreadySubmitted(true);
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // --- STATE 1: ALREADY SUBMITTED (STRICT PRIVACY ENFORCEMENT) ---
  if (isAlreadySubmitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backgroundColor: 'var(--bg-primary)' }}>
        <div
          className="glastic-card"
          style={{
            maxWidth: '560px',
            width: '100%',
            padding: '3rem 2.5rem',
            textAlign: 'center',
            borderRadius: '16px',
            border: '2px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
          }}
        >
          <div
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 10px 25px rgba(37, 99, 235, 0.35)',
            }}
          >
            <Lock size={36} />
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            This feedback form has already been submitted.
          </h2>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Thank you for your response. In accordance with strict privacy and security protocols, each invitation link is single-use and can only be submitted once.
          </p>

          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              fontSize: '0.775rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Shield size={16} color="var(--primary)" />
            <span>Submitted ratings and comments are securely encrypted and accessible exclusively by the Administrator.</span>
          </div>
        </div>
      </div>
    );
  }

  // --- STATE 2: EXPIRED LINK ---
  if (isExpired) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backgroundColor: 'var(--bg-primary)' }}>
        <div className="glastic-card" style={{ maxWidth: '520px', width: '100%', padding: '2.5rem', textAlign: 'center' }}>
          <AlertTriangle size={48} color="#f59e0b" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>This Invitation Link Has Expired</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            The deadline for submitting feedback for this review cycle has passed. Please contact the Administrator if you require a new link.
          </p>
        </div>
      </div>
    );
  }

  // --- STATE 3: JUST SUBMITTED SUCCESSFULLY ---
  if (isSuccessfullySubmitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backgroundColor: 'var(--bg-primary)' }}>
        <div
          className="glastic-card"
          style={{
            maxWidth: '580px',
            width: '100%',
            padding: '3.5rem 2.5rem',
            textAlign: 'center',
            borderRadius: '16px',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            boxShadow: '0 25px 60px -15px rgba(16, 185, 129, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
            }}
          >
            <Check size={42} />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            Your feedback has been submitted successfully.
          </h2>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Thank you for your valuable feedback. Your responses have been securely delivered directly into the Admin Review Repository.
          </p>

          <div
            style={{
              marginTop: '0.5rem',
              padding: '0.85rem 1.25rem',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#059669',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <Shield size={18} />
            <span>Single-Use Token Invalidated · Response Locked Exclusively to Admin</span>
          </div>
        </div>
      </div>
    );
  }

  // --- STATE 4: LOADING / ERROR ---
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <Sparkles size={36} color="var(--primary)" style={{ animation: 'spin 2s linear infinite', marginBottom: '1rem' }} />
          <h3>Validating Feedback Link...</h3>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backgroundColor: 'var(--bg-primary)' }}>
        <div className="glastic-card" style={{ maxWidth: '520px', width: '100%', padding: '2.5rem', textAlign: 'center', border: '1px solid var(--danger)' }}>
          <AlertTriangle size={44} color="var(--danger)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>Access Restricted</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.4 }}>
            {errorMessage}
          </p>
        </div>
      </div>
    );
  }

  // --- STATE 5: ACTIVE FEEDBACK FORM (NO LOGIN REQUIRED) ---
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: '880px', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Public Form Header Banner */}
        <div
          className="glastic-header-banner"
          style={{
            padding: '2.25rem',
            borderRadius: '16px',
            border: '1.5px solid rgba(37, 99, 235, 0.35)',
            boxShadow: '0 20px 45px -10px rgba(37, 99, 235, 0.15)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    background: 'linear-gradient(135deg, #2563eb, #8b5cf6)',
                    color: '#ffffff',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                  }}
                >
                  360° Review Portal
                </span>
                <span style={{ fontSize: '0.75rem', color: '#059669', background: 'rgba(16, 185, 129, 0.12)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 800 }}>
                  🔒 No Login Required · Confidential
                </span>
              </div>

              <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                360° Review &amp; Feedback on {formData.adminName}
              </h1>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.4rem', maxWidth: '620px', lineHeight: 1.45 }}>
                {formData.adminTitle || 'Lead Administrator'} · {formData.campaignTitle}
              </p>
            </div>

            <div style={{ textAlign: 'right', background: 'var(--bg-card)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Review Category
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--primary)', marginTop: '2px' }}>
                {formData.reviewCategory?.replace('_', ' ') || 'Colleague Feedback'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                Reviewer: <strong>{formData.reviewerName}</strong>
              </div>
            </div>
          </div>

          {formData.instructions && (
            <div
              style={{
                marginTop: '1.25rem',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                background: 'rgba(37, 99, 235, 0.06)',
                borderLeft: '4px solid var(--primary)',
                fontSize: '0.825rem',
                color: 'var(--text-primary)',
              }}
            >
              <strong>Instructions from Admin:</strong> {formData.instructions}
            </div>
          )}
        </div>

        {/* The Review Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

          {/* Section 1: Question Rating Criteria Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                1. Performance &amp; Competency Rating Criteria
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Scale: 1 (Rarely) to 5 (Role Model)
              </span>
            </div>

            {(formData.questions || []).map((q, idx) => {
              const currentScore = ratings[q.id] || 4;
              const currentInfo = ratingLabels[currentScore] || ratingLabels[4];

              return (
                <div
                  key={q.id}
                  className="glastic-card"
                  style={{
                    padding: '1.5rem',
                    borderRadius: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--primary)', background: 'var(--primary-light)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                          Criterion #{idx + 1}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                          {q.categoryName}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        {q.questionText}
                      </h3>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.3rem 0.75rem',
                          borderRadius: '20px',
                          background: `${currentInfo.color}15`,
                          color: currentInfo.color,
                          fontWeight: 900,
                          fontSize: '0.9rem',
                          border: `1px solid ${currentInfo.color}40`,
                        }}
                      >
                        {currentScore} ★ · {currentInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* 1-5 Star Selection Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                    {[1, 2, 3, 4, 5].map((score) => {
                      const isSelected = currentScore === score;
                      const info = ratingLabels[score];
                      return (
                        <button
                          key={score}
                          type="button"
                          onClick={() => handleRatingChange(q.id, score)}
                          style={{
                            padding: '0.65rem 0.5rem',
                            borderRadius: '10px',
                            border: isSelected ? `2px solid ${info.color}` : '1px solid var(--border-color)',
                            background: isSelected ? `${info.color}15` : 'var(--bg-tertiary)',
                            color: isSelected ? info.color : 'var(--text-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.25rem',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ fontSize: '1.15rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <span>{score}</span>
                            <Star size={16} fill={isSelected ? info.color : 'none'} color={isSelected ? info.color : 'var(--text-muted)'} />
                          </div>
                          <span style={{ fontSize: '0.675rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                            {info.label.split('/')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Optional Comment for this Criterion */}
                  <div>
                    <input
                      type="text"
                      placeholder={`Optional specific feedback or examples for ${q.categoryName}...`}
                      value={questionComments[q.id] || ''}
                      onChange={(e) => handleCommentChange(q.id, e.target.value)}
                      className="form-input"
                      style={{ width: '100%', fontSize: '0.8rem', background: 'var(--bg-tertiary)' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 2: Qualitative Feedback & Comments */}
          <div
            className="glastic-card"
            style={{
              padding: '1.75rem',
              borderRadius: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              2. Descriptive Comments &amp; Detailed Feedback
            </h2>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Key Strengths &amp; Benchmark Contributions:
              </label>
              <textarea
                rows={3}
                placeholder={`What does ${formData?.adminName || 'the leader'} do exceptionally well? What should they continue doing?`}
                value={strengthsComment}
                onChange={(e) => setStrengthsComment(e.target.value)}
                className="form-input"
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Development &amp; Growth Priorities:
              </label>
              <textarea
                rows={3}
                placeholder={`What could ${formData?.adminName || 'the leader'} improve, delegate, or do differently to increase effectiveness?`}
                value={improvementsComment}
                onChange={(e) => setImprovementsComment(e.target.value)}
                className="form-input"
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Overall Summary &amp; General Comments:
              </label>
              <textarea
                rows={3}
                placeholder={`Any additional feedback or constructive observations regarding ${formData?.adminName || 'the leader'}'s overall performance...`}
                value={summaryFeedback}
                onChange={(e) => setSummaryFeedback(e.target.value)}
                className="form-input"
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Security & One-Time Submission Notice */}
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
            }}
          >
            <Shield size={20} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#059669', display: 'block', marginBottom: '0.2rem' }}>
                Strict Confidentiality Notice:
              </strong>
              Once you click &ldquo;Submit Confidential Feedback&rdquo;, your response is securely locked and stored directly in the Admin's private repository.
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{
              padding: '1rem',
              fontSize: '1rem',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              borderRadius: '12px',
              boxShadow: '0 8px 25px rgba(37, 99, 235, 0.4)',
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >
            <Lock size={18} />
            <span>{submitting ? 'Encrypting & Submitting...' : `Submit Confidential Feedback for ${formData?.adminName || 'Mohan Kilaparthi'}`}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
