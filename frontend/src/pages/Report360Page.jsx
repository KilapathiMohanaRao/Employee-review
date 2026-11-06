import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { reportApi, employeeApi } from '../services/api';
import { ScorecardTable } from '../components/common/ScorecardTable';
import {
  Award,
  Target,
  Download,
  FileText,
  Users,
  Shield,
  Star,
  AlertTriangle,
} from '../components/common/Icons';

export const Report360Page = () => {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [selectedEmpId, setSelectedEmpId] = useState(4); // Default to Alex Taylor (the active 360 evaluatee)
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Always load all employees so any user can inspect evaluatee reports
  useEffect(() => {
    employeeApi.getAll().then((res) => {
      if (res.data) {
        setEmployeeList(res.data);
      }
    }).catch((e) => console.error(e));
  }, []);

  // Sync selectedEmpId when role/user changes: default to Alex Taylor (4) or user's employeeId if they are Alex
  useEffect(() => {
    if (user?.employeeId === 4) {
      setSelectedEmpId(4);
    } else if (!selectedEmpId) {
      setSelectedEmpId(4);
    }
  }, [user]);

  useEffect(() => {
    if (selectedEmpId) {
      loadReport(selectedEmpId);
    }
  }, [selectedEmpId]);

  const loadReport = async (empId) => {
    setLoading(true);
    try {
      const res = await reportApi.getEmployee360(empId);
      if (res.data) {
        setReport(res.data);
      } else {
        setReport(null);
      }
    } catch (e) {
      console.error(e);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    window.print();
  };

  return (
    <div style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header and Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }} className="no-print">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            360° Employee Performance Assessment Report
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Comprehensive multi-rater competency scorecard, blind spot gap analysis, and developmental insights.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {employeeList.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Employee:</span>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(Number(e.target.value))}
                className="form-select"
                style={{ width: '220px', fontSize: '0.825rem' }}
              >
                {employeeList.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.fullName} ({e.designationTitle || e.employeeCode})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button onClick={handleDownloadReport} className="btn btn-primary" style={{ fontSize: '0.825rem' }}>
            <Download size={16} /> Download Report
          </button>
        </div>
      </div>

      {report ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {report.status === 'NOT_ASSIGNED' && (
            <div style={{ padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--warning-light)', border: '1px solid var(--warning)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                ℹ️ <strong>{report.employeeName}</strong> is not currently assigned to an active 360 review cycle.
              </div>
              <button onClick={() => setSelectedEmpId(4)} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
                Switch to Alex Taylor's Active 360° Review →
              </button>
            </div>
          )}

          {/* Employee Executive Profile Banner */}
          <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', background: 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(16,185,129,0.06))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
                boxShadow: '0 4px 10px rgba(37,99,235,0.3)',
              }}>
                {report.employeeName?.charAt(0) || 'A'}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {report.employeeName}
                  </h2>
                  <span className="badge badge-primary">{report.employeeCode}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {report.designationTitle} • {report.departmentName}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Reporting Manager: <strong>{report.managerName}</strong> • Cycle: <strong>{report.cycleTitle}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  OVERALL COMPOSITE
                </span>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>
                  {report.overallScore ? Number(report.overallScore).toFixed(2) : '—'}
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}> / 5.0</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)', paddingLeft: '2rem' }}>
                <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  REVIEWER SAMPLE
                </span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {report.completedReviews} / {report.totalReviewers} Reviews
                </div>
                <span style={{ fontSize: '0.75rem', color: report.completedReviews > 0 ? 'var(--success)' : 'var(--text-muted)', fontWeight: 700 }}>
                  {report.totalReviewers > 0
                    ? `${Math.round((report.completedReviews / report.totalReviewers) * 100)}% Submitted`
                    : 'Awaiting Reviews'}
                </span>
              </div>
            </div>
          </div>

          {/* Excel-Inspired Competency Scorecard */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                  Competency Scorecard &amp; Multi-Rater Gap Analysis
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Scores calibrated on a 5-point scale: Rarely (1), Inconsistently (2), Effective (3), Strong (4), Role Model (5).
                </p>
              </div>
            </div>

            <ScorecardTable scorecards={report.scorecards} />
          </div>

          {/* Key Insights Grid: Top Strengths, Development, Blind Spots, Hidden Strengths */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Top 3 Strengths */}
            <div className="card" style={{ borderTop: '4px solid var(--success)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: 'var(--success)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                <Award size={18} /> TOP 3 STRENGTHS (RATED BY OTHERS)
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Highest-rated specific behavioural indicators across peers, managers, and partners.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {report.topStrengths && report.topStrengths.length > 0 ? (
                  report.topStrengths.map((s, idx) => (
                    <div key={idx} style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'var(--success-light)', fontSize: '0.825rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{s.behaviourTitle}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        <span>{s.competencyName}</span>
                        <strong>{s.score} / 5.0</strong>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Awaiting reviewer submissions to identify top strengths.
                  </div>
                )}
              </div>
            </div>

            {/* Top 3 Development Areas */}
            <div className="card" style={{ borderTop: '4px solid var(--danger)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: 'var(--danger)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                <Target size={18} /> TOP 3 DEVELOPMENT AREAS
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Lowest-rated behaviours indicating prime focus targets for Individual Development Plans.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {report.topDevelopmentAreas && report.topDevelopmentAreas.length > 0 ? (
                  report.topDevelopmentAreas.map((d, idx) => (
                    <div key={idx} style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'var(--danger-light)', fontSize: '0.825rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{d.behaviourTitle}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        <span>{d.competencyName}</span>
                        <strong>{d.score} / 5.0</strong>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Awaiting reviewer submissions to identify development priorities.
                  </div>
                )}
              </div>
            </div>

            {/* Blind Spots (Self >> Others) */}
            <div className="card" style={{ borderTop: '4px solid var(--warning)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: 'var(--warning)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                <span>👁️</span> BLIND SPOTS (SELF &gt; OTHERS)
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Competencies where self-evaluation exceeds colleagues aggregate by ≥ +0.5.
              </p>
              {report.blindSpots?.length > 0 ? (
                report.blindSpots.map((b, idx) => (
                  <div key={idx} style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'var(--warning-light)', fontSize: '0.825rem', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{b.competencyName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      Self: {b.selfScore} vs Others: {b.othersScore} (Gap: +{b.gap})
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.3rem', fontStyle: 'italic' }}>
                      {b.advice}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>No significant blind spots detected. Excellent self-awareness alignment.</div>
              )}
            </div>

            {/* Hidden Strengths (Others >> Self) */}
            <div className="card" style={{ borderTop: '4px solid var(--purple)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: 'var(--purple)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                <span>✨</span> HIDDEN STRENGTHS (OTHERS &gt; SELF)
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Competencies where colleagues rate performance significantly higher than self-perception.
              </p>
              {report.hiddenStrengths?.length > 0 ? (
                report.hiddenStrengths.map((h, idx) => (
                  <div key={idx} style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'var(--purple-light)', fontSize: '0.825rem', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{h.competencyName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      Others: {h.othersScore} vs Self: {h.selfScore} (Gap: {h.gap})
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.3rem', fontStyle: 'italic' }}>
                      {h.advice}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Self ratings are well calibrated to external perceptions.</div>
              )}
            </div>
          </div>

          {/* Qualitative Commentary (Anonymity Enforced) */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Synthesized Qualitative Feedback
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              All colleague feedback is moderated and anonymized in compliance with enterprise HR privacy policies.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--success)', marginBottom: '0.65rem' }}>
                  What colleagues appreciate most:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {report.qualitativeStrengths?.map((c, idx) => (
                    <div key={idx} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', fontSize: '0.825rem', fontStyle: 'italic' }}>
                      "{c}"
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--warning)', marginBottom: '0.65rem' }}>
                  Colleagues recommend focusing on:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {report.qualitativeDevelopmentAreas?.map((c, idx) => (
                    <div key={idx} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', fontSize: '0.825rem', fontStyle: 'italic' }}>
                      "{c}"
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Loading 360-degree performance report...
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <Shield size={44} color="var(--primary)" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            No 360° Review Assignment for Selected Employee
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
            The selected employee does not have an active 360 review assignment in this cycle. Select Alex Taylor from the dropdown above or click the button below to view the active 360° scorecard.
          </p>
          <button onClick={() => setSelectedEmpId(4)} className="btn btn-primary" style={{ margin: '0 auto' }}>
            View Alex Taylor's 360° Report →
          </button>
        </div>
      )}
    </div>
  );
};
