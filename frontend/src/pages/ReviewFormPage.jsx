import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { reviewApi, employeeApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Star,
  CheckCircle,
  AlertTriangle,
  Send,
  Users,
  Award,
  Sparkles,
  Info,
  Lock,
} from '../components/common/Icons';

export const ReviewFormPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const paramEvaluateeId = searchParams.get('evaluateeId');
  const paramCycleId = searchParams.get('cycleId');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Metadata
  const [evaluatees, setEvaluatees] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [activeCycle, setActiveCycle] = useState(null);

  // Form State
  const [selectedEvaluateeId, setSelectedEvaluateeId] = useState(paramEvaluateeId ? Number(paramEvaluateeId) : '');
  const [reviewerName, setReviewerName] = useState(user?.fullName || '');
  const [reviewerEmail, setReviewerEmail] = useState(user?.email || '');
  const [reviewType, setReviewType] = useState('PEER');
  const [isAnonymous, setIsAnonymous] = useState(true);

  // Ratings map: competencyId -> score (1 to 5)
  const [ratings, setRatings] = useState({});
  const [categoryComments, setCategoryComments] = useState({});

  // Qualitative Feedback
  const [summaryFeedback, setSummaryFeedback] = useState('');
  const [keyStrengths, setKeyStrengths] = useState('');
  const [developmentAreas, setDevelopmentAreas] = useState('');

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await reviewApi.getFormData(paramEvaluateeId);
      if (res.data) {
        setEvaluatees(res.data.evaluatees || []);
        setCompetencies(res.data.ratingCategories || []);
        setActiveCycle(res.data.activeCycle || null);

        // Pre-select evaluatee if provided in query or default to first
        if (paramEvaluateeId) {
          setSelectedEvaluateeId(Number(paramEvaluateeId));
        } else if (res.data.evaluatees && res.data.evaluatees.length > 0) {
          setSelectedEvaluateeId(res.data.evaluatees[0].id);
        }

        // Initialize default rating score (4) for each competency
        const initRatings = {};
        (res.data.ratingCategories || []).forEach((c) => {
          initRatings[c.id] = 4;
        });
        setRatings(initRatings);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to load review form. Please check your network or review link.');
    } finally {
      setLoading(false);
    }
  };

  const selectedEmployeeObj = evaluatees.find((e) => e.id === Number(selectedEvaluateeId));

  const handleScoreChange = (compId, score) => {
    setRatings((prev) => ({
      ...prev,
      [compId]: score,
    }));
  };

  const handleCategoryCommentChange = (compId, comment) => {
    setCategoryComments((prev) => ({
      ...prev,
      [compId]: comment,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvaluateeId) {
      setErrorMessage('Please select the employee you are evaluating.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    // Format category ratings payload
    const categoryRatingsList = competencies.map((comp) => ({
      competencyId: comp.id,
      competencyName: comp.name,
      competencyCode: comp.code,
      category: comp.category,
      score: ratings[comp.id] || 4,
      comments: categoryComments[comp.id] || '',
    }));

    const payload = {
      evaluateeEmployeeId: Number(selectedEvaluateeId),
      reviewerEmployeeId: user?.employeeId || null,
      reviewerEmail: reviewerEmail || (user ? user.email : 'employee@enterprise.com'),
      reviewerName: reviewerName || (user ? user.fullName : 'Confidential Colleague'),
      cycleId: activeCycle?.id || (paramCycleId ? Number(paramCycleId) : null),
      reviewType: reviewType,
      anonymous: isAnonymous,
      categoryRatings: categoryRatingsList,
      summaryFeedback: summaryFeedback,
      keyStrengthsComment: keyStrengths,
      developmentAreasComment: developmentAreas,
    };

    try {
      const res = await reviewApi.submit(payload);
      if (res.success) {
        // Clear sensitive form memory
        setRatings({});
        setCategoryComments({});
        setSummaryFeedback('');
        setKeyStrengths('');
        setDevelopmentAreas('');
        // Transition permanently to secure confirmation state
        setSubmittedSuccessfully(true);
      } else {
        setErrorMessage(res.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Submission error.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // --- CONFIRMATION SCREEN (STRICT PRIVACY ENFORCEMENT) ---
  if (submittedSuccessfully) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div
          className="glastic-card"
          style={{
            maxWidth: '620px',
            width: '100%',
            padding: '3rem 2.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            boxShadow: '0 25px 60px -15px rgba(16, 185, 129, 0.25)',
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
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.45)',
              marginBottom: '0.5rem',
            }}
          >
            <CheckCircle size={44} />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            Your review has been submitted successfully.
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '480px' }}>
            Thank you for providing your constructive assessment. Your feedback has been securely encrypted and stored for Admin review.
          </p>

          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(37, 99, 235, 0.2)',
              fontSize: '0.825rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textAlign: 'left',
              margin: '0.75rem 0',
            }}
          >
            <Lock size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span>
              <strong>Privacy Guaranteed:</strong> In accordance with strict privacy guidelines, submitted ratings and comments cannot be viewed, retrieved, or modified. Only authorized Administrators can access review analytics.
            </span>
          </div>

          <button
            onClick={() => {
              if (user && (user.roles?.includes('SUPER_ADMIN') || user.roles?.includes('HR_ADMIN'))) {
                navigate('/');
              } else {
                window.location.reload();
              }
            }}
            className="btn btn-primary"
            style={{ padding: '0.75rem 2rem', fontWeight: 800, fontSize: '0.9rem', marginTop: '0.5rem' }}
          >
            {user && (user.roles?.includes('SUPER_ADMIN') || user.roles?.includes('HR_ADMIN'))
              ? 'Return to Admin Dashboard'
              : 'Submit Another Review'}
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Sparkles size={36} color="var(--primary)" style={{ marginBottom: '1rem' }} />
        <h3>Loading Employee Review Form...</h3>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div
        className="glastic-header-banner"
        style={{
          padding: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          boxShadow: '0 15px 35px -10px rgba(37, 99, 235, 0.15)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
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
              Private &amp; Confidential
            </span>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {activeCycle?.title || 'Annual 360° Review Cycle'}
            </span>
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            Employee Review &amp; Rating Form
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem', maxWidth: '640px' }}>
            Evaluate your colleague across standard core competencies. Your submission is securely encrypted and accessible strictly by the Administrator.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.6rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#059669',
            fontWeight: 700,
            fontSize: '0.8rem',
          }}
        >
          <Shield size={18} />
          <span>Admin-Only Review Vault</span>
        </div>
      </div>

      {errorMessage && (
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--danger-light)',
            border: '1px solid var(--danger)',
            color: 'var(--danger)',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 600,
          }}
        >
          <AlertTriangle size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Step 1: Select Evaluatee & Reviewer Information */}
        <div className="glastic-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} color="var(--primary)" />
            <span>1. Review Participants &amp; Context</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Evaluatee Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Colleague Being Evaluated (Evaluatee) *
              </label>
              <select
                value={selectedEvaluateeId}
                onChange={(e) => setSelectedEvaluateeId(Number(e.target.value))}
                className="form-select"
                required
                style={{ width: '100%', fontSize: '0.875rem' }}
              >
                <option value="">Select Employee...</option>
                {evaluatees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.fullName} ({e.departmentName} - {e.designationTitle})
                  </option>
                ))}
              </select>

              {selectedEmployeeObj && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem', padding: '0.6rem 0.85rem', borderRadius: '8px', background: 'var(--bg-tertiary)' }}>
                  <img
                    src={selectedEmployeeObj.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                    alt={selectedEmployeeObj.fullName}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {selectedEmployeeObj.fullName}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                      {selectedEmployeeObj.designationTitle} · {selectedEmployeeObj.departmentName}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reviewer / Candidate Identity & Relationship */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Your Name / Candidate Identity *
              </label>
              <input
                type="text"
                placeholder="Enter your full name or candidate ID..."
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="form-input"
                required
                style={{ width: '100%', fontSize: '0.875rem', marginBottom: '0.75rem' }}
              />

              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Your Email Address (for confirmation) *
              </label>
              <input
                type="email"
                placeholder="candidate.reviewer@example.com"
                value={reviewerEmail}
                onChange={(e) => setReviewerEmail(e.target.value)}
                className="form-input"
                required
                style={{ width: '100%', fontSize: '0.875rem', marginBottom: '0.75rem' }}
              />

              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Your Working Relationship to this Colleague *
              </label>
              <select
                value={reviewType}
                onChange={(e) => setReviewType(e.target.value)}
                className="form-select"
                style={{ width: '100%', fontSize: '0.875rem', marginBottom: '0.75rem' }}
              >
                <option value="PEER">Peer / Team Colleague</option>
                <option value="MANAGER">Manager / Direct Supervisor</option>
                <option value="DIRECT_REPORT">Direct Report (Upward Feedback)</option>
                <option value="CROSS_FUNCTIONAL">Cross-Functional Partner</option>
                <option value="SELF">Self Assessment</option>
              </select>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                />
                <span>Submit as <strong>Confidential Review</strong> (Visible only to Admin, protected from evaluatee)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Step 2: Individual Category Ratings */}
        <div className="glastic-card" style={{ padding: '1.75rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} color="var(--primary)" />
              <span>2. Individual Competency &amp; Performance Ratings (1 to 5)</span>
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Rate each dimension using the benchmark scale: 1 (Rarely) · 2 (Inconsistently) · 3 (Effective) · 4 (Strong) · 5 (Role Model).
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {competencies.map((comp, idx) => {
              const currentScore = ratings[comp.id] || 4;
              return (
                <div
                  key={comp.id}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', background: 'var(--primary-light)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                          #{idx + 1}
                        </span>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                          {comp.name}
                        </strong>
                        <span className="badge" style={{ fontSize: '0.65rem' }}>
                          {comp.category || 'CORE'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {comp.description}
                      </p>
                    </div>

                    {/* 1-5 Star/Number Pill Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleScoreChange(comp.id, val)}
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '8px',
                            border: currentScore === val ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                            background: currentScore === val ? 'var(--primary)' : 'var(--bg-card)',
                            color: currentScore === val ? '#ffffff' : 'var(--text-secondary)',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: currentScore === val ? '0 4px 10px rgba(37, 99, 235, 0.35)' : 'none',
                          }}
                        >
                          {val}★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional Category Comment */}
                  <input
                    type="text"
                    placeholder={`Specific observation or feedback regarding ${comp.name.toLowerCase()} (optional)...`}
                    value={categoryComments[comp.id] || ''}
                    onChange={(e) => handleCategoryCommentChange(comp.id, e.target.value)}
                    className="form-input"
                    style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem', background: 'var(--bg-card)' }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Qualitative Comments & Development Feedback */}
        <div className="glastic-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="var(--primary)" />
            <span>3. Qualitative Feedback &amp; Development Observations</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Overall Performance Summary &amp; General Comments
              </label>
              <textarea
                rows={3}
                placeholder="Share your general perspective on this colleague's impact, attitude, teamwork, and deliverables..."
                value={summaryFeedback}
                onChange={(e) => setSummaryFeedback(e.target.value)}
                className="form-input"
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#059669', marginBottom: '0.35rem' }}>
                Key Strengths &amp; Exemplary Behaviours
              </label>
              <textarea
                rows={2}
                placeholder="What does this colleague do exceptionally well? What should they continue doing?"
                value={keyStrengths}
                onChange={(e) => setKeyStrengths(e.target.value)}
                className="form-input"
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#d97706', marginBottom: '0.35rem' }}>
                Priority Development Areas &amp; Growth Opportunities
              </label>
              <textarea
                rows={2}
                placeholder="Where could this colleague develop further to expand their impact and leadership runway?"
                value={developmentAreas}
                onChange={(e) => setDevelopmentAreas(e.target.value)}
                className="form-input"
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>
          </div>
        </div>

        {/* Submit Button & Privacy Lock Notice */}
        <div
          className="glastic-card"
          style={{
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            background: 'var(--bg-card)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Lock size={18} color="var(--primary)" />
            <span>
              Once submitted, this review is <strong>permanently locked</strong> and stored securely. You will not be able to edit or view it again.
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{
              padding: '0.75rem 2rem',
              fontWeight: 800,
              fontSize: '0.95rem',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
            }}
          >
            {submitting ? (
              'Submitting Securely...'
            ) : (
              <>
                <Send size={18} />
                <span>Submit Confidential Review</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
