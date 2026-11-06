import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assessmentApi, competencyApi } from '../services/api';
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield,
  Send,
  Star,
  ChevronRight,
  ChevronDown,
} from '../components/common/Icons';

export const AssessmentsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [selectedRelId, setSelectedRelId] = useState(null);
  const [assessmentDetail, setAssessmentDetail] = useState(null);
  const [competencies, setCompetencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState('');

  // Assessment form state
  const [responses, setResponses] = useState({});
  const [summaryFeedback, setSummaryFeedback] = useState('');
  const [keyStrengths, setKeyStrengths] = useState('');
  const [devAreas, setDevAreas] = useState('');

  const ratingOptions = [
    { score: 1, label: 'Rarely', desc: 'Rarely displays behaviour' },
    { score: 2, label: 'Inconsistently', desc: 'Inconsistent performance' },
    { score: 3, label: 'Effective', desc: 'Consistently meets standards' },
    { score: 4, label: 'Strong', desc: 'Frequently exceeds standards' },
    { score: 5, label: 'Role Model', desc: 'Exemplar and coach for others' },
  ];

  useEffect(() => {
    loadAssignments();
    competencyApi.getAll().then((res) => {
      if (res.data) setCompetencies(res.data);
    });
  }, [user]);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const res = await assessmentApi.getMyAssignments(user?.employeeId || 4);
      if (res.data) {
        setAssignments(res.data);
        if (res.data.length > 0 && !selectedRelId) {
          selectAssignment(res.data[0].relationshipId);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectAssignment = async (relId) => {
    setSelectedRelId(relId);
    setSubmittedMessage('');
    try {
      const res = await assessmentApi.getByRelationship(relId);
      if (res.data) {
        setAssessmentDetail(res.data);
        setSummaryFeedback(res.data.summaryFeedback || '');
        setKeyStrengths(res.data.keyStrengthsComment || '');
        setDevAreas(res.data.developmentAreasComment || '');

        // Map responses
        const map = {};
        if (res.data.responses) {
          res.data.responses.forEach((r) => {
            map[r.behaviourId] = {
              score: r.score,
              notObserved: r.notObserved,
              comments: r.comments || '',
            };
          });
        }
        setResponses(map);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleScoreChange = (behaviourId, score, notObserved = false) => {
    if (assessmentDetail?.locked) return;
    setResponses((prev) => ({
      ...prev,
      [behaviourId]: {
        score: notObserved ? null : score,
        notObserved,
        comments: prev[behaviourId]?.comments || '',
      },
    }));
  };

  const handleSaveDraft = async () => {
    if (!assessmentDetail) return;
    setSaving(true);
    try {
      const payload = {
        summaryFeedback,
        keyStrengthsComment: keyStrengths,
        developmentAreasComment: devAreas,
        responses: Object.entries(responses).map(([bId, val]) => ({
          behaviourId: Number(bId),
          score: val.score,
          notObserved: val.notObserved,
          comments: val.comments,
        })),
      };

      await assessmentApi.saveDraft(assessmentDetail.id, payload);
      setSubmittedMessage('Draft saved successfully!');
      setTimeout(() => setSubmittedMessage(''), 3000);
      loadAssignments();
    } catch (e) {
      alert(e.message || 'Error saving draft');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!assessmentDetail) return;
    if (!window.confirm('Are you sure you want to finalize and submit? Once submitted, the assessment is locked.')) {
      return;
    }

    setSaving(true);
    try {
      const payload = {
        summaryFeedback,
        keyStrengthsComment: keyStrengths,
        developmentAreasComment: devAreas,
        responses: Object.entries(responses).map(([bId, val]) => ({
          behaviourId: Number(bId),
          score: val.score,
          notObserved: val.notObserved,
          comments: val.comments,
        })),
      };

      const res = await assessmentApi.submit(assessmentDetail.id, payload);
      setAssessmentDetail(res.data);
      setSubmittedMessage('Assessment submitted and locked! 360° summary recalculations updated.');
      loadAssignments();
    } catch (e) {
      alert(e.message || 'Error submitting assessment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          360° Assessment &amp; Feedback Form
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Evaluate colleagues and self across the 11 core competencies and their measurable behavioural indicators.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Side: Assigned Reviews List */}
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
            Your Review Assignments ({assignments.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {assignments.map((a) => {
              const isSelected = selectedRelId === a.relationshipId;
              return (
                <div
                  key={a.relationshipId}
                  onClick={() => selectAssignment(a.relationshipId)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: isSelected ? 'var(--primary-light)' : 'var(--bg-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`badge ${a.status === 'SUBMITTED' ? 'badge-success' : 'badge-warning'}`}>
                      {a.status}
                    </span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      {a.reviewType.replace('_', ' ')}
                    </span>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: '0.875rem', marginTop: '0.35rem', color: 'var(--text-primary)' }}>
                    {a.evaluateeName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {a.evaluateeDesignation} • {a.evaluateeDepartment}
                  </div>

                  {a.anonymous && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.35rem', fontSize: '0.7rem', color: 'var(--purple)', fontWeight: 600 }}>
                      <Shield size={12} /> Anonymous Feedback Shielded
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Assessment Dynamic Form */}
        <div className="card" style={{ padding: '1.5rem' }}>
          {assessmentDetail ? (
            <div>
              {/* Header Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                      Evaluating: {assessmentDetail.evaluateeName}
                    </h2>
                    {assessmentDetail.locked && (
                      <span className="badge badge-success">🔒 Submitted &amp; Locked</span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Relationship: <strong>{assessmentDetail.reviewType.replace('_', ' ')}</strong> • Cycle: {assessmentDetail.cycleTitle}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!assessmentDetail.locked && (
                    <>
                      <button onClick={handleSaveDraft} disabled={saving} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>
                        Save Draft
                      </button>
                      <button onClick={handleSubmit} disabled={saving} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
                        <Send size={14} /> Submit Assessment
                      </button>
                    </>
                  )}
                </div>
              </div>

              {submittedMessage && (
                <div style={{
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--success-light)',
                  border: '1px solid var(--success)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.875rem' }}>
                    ✓ {submittedMessage}
                  </div>
                  <button
                    onClick={() => navigate('/reports/360')}
                    className="btn btn-primary"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                  >
                    View Updated 360° Scorecard →
                  </button>
                </div>
              )}

              {/* Rating Scale Legend */}
              <div style={{
                padding: '0.75rem 1rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Rating Scale:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span><strong style={{ color: 'var(--text-primary)' }}>1</strong> = Rarely</span>
                  <span><strong style={{ color: 'var(--text-primary)' }}>2</strong> = Inconsistently</span>
                  <span><strong style={{ color: 'var(--text-primary)' }}>3</strong> = Effective</span>
                  <span><strong style={{ color: 'var(--text-primary)' }}>4</strong> = Strong</span>
                  <span><strong style={{ color: 'var(--text-primary)' }}>5</strong> = Role Model</span>
                  <span><strong style={{ color: 'var(--text-primary)' }}>NA</strong> = Not Observed</span>
                </div>
              </div>

              {/* 11 Competencies Dynamic List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {competencies.map((comp, cIdx) => (
                  <div key={comp.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    {/* Competency Header */}
                    <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>
                          Competency {cIdx + 1} of 11 • {comp.category}
                        </span>
                        <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                          {comp.name}
                        </h4>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {comp.behaviours?.length || 1} {comp.behaviours?.length === 1 ? 'Behavioural Item' : 'Behavioural Items'}
                      </span>
                    </div>

                    {/* Behaviour Questions */}
                    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {comp.behaviours?.map((b) => {
                        const currentResp = responses[b.id] || { score: null, notObserved: false };
                        return (
                          <div key={b.id} style={{ paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                              {b.title}
                            </div>

                            {/* Simple Radio Buttons 1 to 5 + Not Observed */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                              {[1, 2, 3, 4, 5].map((score) => {
                                const isChecked = currentResp.score === score && !currentResp.notObserved;
                                return (
                                  <label
                                    key={score}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.4rem',
                                      cursor: assessmentDetail.locked ? 'not-allowed' : 'pointer',
                                      fontSize: '0.85rem',
                                      fontWeight: isChecked ? 700 : 500,
                                      color: isChecked ? 'var(--primary)' : 'var(--text-primary)',
                                      userSelect: 'none',
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      name={`behaviour-${b.id}`}
                                      value={score}
                                      checked={isChecked}
                                      disabled={assessmentDetail.locked}
                                      onChange={() => handleScoreChange(b.id, score, false)}
                                      style={{
                                        cursor: assessmentDetail.locked ? 'not-allowed' : 'pointer',
                                        accentColor: 'var(--primary)',
                                        width: '16px',
                                        height: '16px',
                                        margin: 0,
                                      }}
                                    />
                                    <span>{score}</span>
                                  </label>
                                );
                              })}

                              {/* Not Observed Option */}
                              <label
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                  cursor: assessmentDetail.locked ? 'not-allowed' : 'pointer',
                                  fontSize: '0.85rem',
                                  fontWeight: currentResp.notObserved ? 700 : 500,
                                  color: currentResp.notObserved ? 'var(--primary)' : 'var(--text-muted)',
                                  marginLeft: '0.5rem',
                                  userSelect: 'none',
                                }}
                              >
                                <input
                                  type="radio"
                                  name={`behaviour-${b.id}`}
                                  value="NA"
                                  checked={!!currentResp.notObserved}
                                  disabled={assessmentDetail.locked}
                                  onChange={() => handleScoreChange(b.id, null, true)}
                                  style={{
                                    cursor: assessmentDetail.locked ? 'not-allowed' : 'pointer',
                                    accentColor: 'var(--primary)',
                                    width: '16px',
                                    height: '16px',
                                    margin: 0,
                                  }}
                                />
                                <span>Not Observed</span>
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Qualitative Feedback Section */}
                <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', background: 'var(--bg-secondary)' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>
                    Qualitative Feedback &amp; Commentary
                  </h4>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700 }}>
                      ⭐ Key Strengths Demonstrated
                    </label>
                    <textarea
                      rows="3"
                      disabled={assessmentDetail.locked}
                      className="form-textarea"
                      placeholder="Highlight primary strengths, high-impact contributions, and exemplary behaviours..."
                      value={keyStrengths}
                      onChange={(e) => setKeyStrengths(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700 }}>
                      🎯 Primary Development &amp; Growth Areas
                    </label>
                    <textarea
                      rows="3"
                      disabled={assessmentDetail.locked}
                      className="form-textarea"
                      placeholder="Constructive areas for skill building, behavioural improvements, or collaboration stretch goals..."
                      value={devAreas}
                      onChange={(e) => setDevAreas(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700 }}>
                      💬 Summary Feedback &amp; Final Thoughts
                    </label>
                    <textarea
                      rows="3"
                      disabled={assessmentDetail.locked}
                      className="form-textarea"
                      placeholder="Overall perspective on colleague performance and trajectory..."
                      value={summaryFeedback}
                      onChange={(e) => setSummaryFeedback(e.target.value)}
                    />
                  </div>
                </div>

                {/* Bottom Actions */}
                {!assessmentDetail.locked && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                    <button onClick={handleSaveDraft} disabled={saving} className="btn btn-secondary">
                      Save as Draft
                    </button>
                    <button onClick={handleSubmit} disabled={saving} className="btn btn-primary">
                      <Send size={16} /> Submit &amp; Finalize Assessment
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Select a review assignment from the left to start evaluating.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
