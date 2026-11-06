import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { idpApi, competencyApi, employeeApi } from '../services/api';
import {
  Target,
  Award,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  ChevronDown,
  ChevronRight,
} from '../components/common/Icons';

export const DevelopmentPlanPage = () => {
  const { user, hasRole } = useAuth();
  const [plans, setPlans] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [checkinModalOpen, setCheckinModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // IDP Form
  const [newPlan, setNewPlan] = useState({
    focusCompetencyId: '',
    smartGoal: '',
    mentorOrSupport: '',
    successMeasurement: '',
    targetDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    actions: [
      { frameworkType: 'EXPERIENTIAL_70', actionTitle: '', actionDescription: '', targetCompletionDate: '' },
      { frameworkType: 'EXPOSURE_20', actionTitle: '', actionDescription: '', targetCompletionDate: '' },
      { frameworkType: 'EDUCATION_10', actionTitle: '', actionDescription: '', targetCompletionDate: '' },
    ],
  });

  // Checkin Form
  const [newCheckin, setNewCheckin] = useState({
    checkinDate: new Date().toISOString().split('T')[0],
    checkinType: 'FOUR_WEEK',
    employeeNotes: '',
    managerFeedback: '',
    progressPercentage: 65,
    statusAssessment: 'ON_TRACK',
  });

  useEffect(() => {
    loadPlans();
    competencyApi.getAll().then((res) => {
      if (res.data) setCompetencies(res.data);
    });
  }, [user]);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const res = await idpApi.getMyPlans(user?.employeeId || 4);
      if (res.data) setPlans(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      await idpApi.create({
        ...newPlan,
        employeeId: user?.employeeId || 4,
        focusCompetencyId: Number(newPlan.focusCompetencyId),
      });
      setCreateModalOpen(false);
      loadPlans();
    } catch (err) {
      alert(err.message || 'Error creating plan');
    }
  };

  const handleAddCheckin = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;
    try {
      await idpApi.addCheckin(selectedPlan.id, newCheckin);
      setCheckinModalOpen(false);
      loadPlans();
    } catch (err) {
      alert(err.message || 'Error logging check-in');
    }
  };

  return (
    <div style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Individual Development Plans (70-20-10 Model)
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Transform 360° scorecard insights into structured growth actions: 70% Experiential, 20% Mentorship, 10% Formal Learning.
          </p>
        </div>

        <button onClick={() => setCreateModalOpen(true)} className="btn btn-primary">
          <Plus size={16} /> Create New Development Goal
        </button>
      </div>

      {/* 70-20-10 Framework Infobox */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary)', marginBottom: '0.2rem' }}>
            70% Experiential (On-the-job)
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Leading stretch initiatives, solving complex architectural bottlenecks, and cross-team rotations.
          </div>
        </div>

        <div className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--success)' }}>
          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--success)', marginBottom: '0.2rem' }}>
            20% Exposure (Coaching &amp; Mentoring)
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            1-on-1 executive coaching, peer shadowing, cross-department alignment, and reverse mentorship.
          </div>
        </div>

        <div className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--purple)' }}>
          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--purple)', marginBottom: '0.2rem' }}>
            10% Education (Formal Learning)
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Certified courses, technical book-clubs, masterclasses, and external industry conferences.
          </div>
        </div>
      </div>

      {/* Plans List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {plans.map((p) => (
          <div key={p.id} className="card" style={{ padding: '1.5rem' }}>
            {/* Plan Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-primary">{p.focusCompetencyCategory || 'CORE'}</span>
                  <span className="badge badge-success">{p.status}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.35rem', color: 'var(--text-primary)' }}>
                  Focus: {p.focusCompetencyName}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  SMART Goal: <strong>{p.smartGoal}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button
                  onClick={() => {
                    setSelectedPlan(p);
                    setCheckinModalOpen(true);
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem' }}
                >
                  <Clock size={14} /> Log 4-6 Wk Check-in
                </button>
              </div>
            </div>

            {/* Plan Metadata Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', fontSize: '0.8rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>TARGET COMPLETION</span>
                <strong>{p.targetDate}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>MENTOR / SPONSOR</span>
                <strong>{p.mentorOrSupport || 'Sarah Connor (EM)'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>OVERALL PROGRESS</span>
                <strong>{p.overallProgress}% Complete</strong>
              </div>
            </div>

            {/* 70-20-10 Actions Breakdown */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                70-20-10 Milestone Actions
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {p.actions?.map((act) => {
                  const tagColor =
                    act.frameworkType === 'EXPERIENTIAL_70'
                      ? 'var(--primary)'
                      : act.frameworkType === 'EXPOSURE_20'
                      ? 'var(--success)'
                      : 'var(--purple)';

                  return (
                    <div
                      key={act.id}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          background: 'var(--bg-tertiary)',
                          color: tagColor,
                        }}>
                          {act.frameworkType.replace('_', ' ')}
                        </span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{act.actionTitle}</div>
                          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{act.actionDescription}</div>
                        </div>
                      </div>

                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Due: {act.targetCompletionDate || 'Next Sprint'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4-6 Week Progress Check-in History */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                4-6 Week Progress Cadence History
              </h4>
              {p.checkins?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {p.checkins.map((chk) => (
                    <div
                      key={chk.id}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-tertiary)',
                        fontSize: '0.825rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <div>
                          <strong style={{ color: 'var(--text-primary)' }}>Cadence: {chk.checkinType}</strong>
                          <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({chk.checkinDate})</span>
                        </div>
                        <span className={`badge ${chk.statusAssessment === 'ON_TRACK' ? 'badge-success' : 'badge-warning'}`}>
                          {chk.statusAssessment} ({chk.progressPercentage}%)
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                        <strong>Employee Notes:</strong> {chk.employeeNotes}
                      </div>
                      {chk.managerFeedback && (
                        <div style={{ color: 'var(--primary)', fontStyle: 'italic' }}>
                          <strong>Manager Feedback:</strong> "{chk.managerFeedback}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                  No check-ins logged yet. Schedule your first 4-week cadence review with your manager.
                </div>
              )}
            </div>
          </div>
        ))}

        {plans.length === 0 && (
          <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
            <Target size={48} color="var(--primary)" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              No Individual Development Plans Created Yet
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
              Development plans are created based on genuine multi-rater feedback. Once reviewers submit their 360° assessments, collaborate with your manager to target development areas using the 70-20-10 framework.
            </p>
            <button onClick={() => setCreateModalOpen(true)} className="btn btn-primary" style={{ margin: '0 auto' }}>
              <Plus size={16} /> Create Development Plan
            </button>
          </div>
        )}
      </div>

      {/* Create Plan Modal */}
      {createModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Initiate 70-20-10 Individual Development Goal
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Formulate a SMART development goal tied directly to your 360° competency scorecard.
            </p>

            <form onSubmit={handleCreatePlan}>
              <div className="form-group">
                <label className="form-label">Focus Competency</label>
                <select
                  required
                  className="form-select"
                  value={newPlan.focusCompetencyId}
                  onChange={(e) => setNewPlan({ ...newPlan, focusCompetencyId: e.target.value })}
                >
                  <option value="">Select a competency...</option>
                  {competencies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">SMART Goal Description</label>
                <textarea
                  required
                  rows="2"
                  className="form-textarea"
                  placeholder="Specific, Measurable, Achievable, Relevant, and Time-bound goal..."
                  value={newPlan.smartGoal}
                  onChange={(e) => setNewPlan({ ...newPlan, smartGoal: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Mentor / Sponsor</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Sarah Connor (EM)"
                    value={newPlan.mentorOrSupport}
                    onChange={(e) => setNewPlan({ ...newPlan, mentorOrSupport: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Target Completion Date</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={newPlan.targetDate}
                    onChange={(e) => setNewPlan({ ...newPlan, targetDate: e.target.value })}
                  />
                </div>
              </div>

              {/* 70-20-10 Actions Inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                    70% On-The-Job Experiential Action
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Action: e.g. Lead monthly cross-team technical architecture alignment"
                    value={newPlan.actions[0].actionTitle}
                    onChange={(e) => {
                      const acts = [...newPlan.actions];
                      acts[0].actionTitle = e.target.value;
                      setNewPlan({ ...newPlan, actions: acts });
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--success)', fontWeight: 700 }}>
                    20% Exposure &amp; Coaching Action
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Action: e.g. Monthly 1-on-1 strategy sync with Principal Product Manager"
                    value={newPlan.actions[1].actionTitle}
                    onChange={(e) => {
                      const acts = [...newPlan.actions];
                      acts[1].actionTitle = e.target.value;
                      setNewPlan({ ...newPlan, actions: acts });
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--purple)', fontWeight: 700 }}>
                    10% Education &amp; Formal Learning Action
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Action: e.g. Complete certified workshop on Cross-Functional Leadership"
                    value={newPlan.actions[2].actionTitle}
                    onChange={(e) => {
                      const acts = [...newPlan.actions];
                      acts[2].actionTitle = e.target.value;
                      setNewPlan({ ...newPlan, actions: acts });
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setCreateModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Activate Development Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Checkin Modal */}
      {checkinModalOpen && selectedPlan && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Log 4-6 Week Progress Check-in
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Goal: {selectedPlan.focusCompetencyName}
            </p>

            <form onSubmit={handleAddCheckin}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Cadence Period</label>
                  <select
                    className="form-select"
                    value={newCheckin.checkinType}
                    onChange={(e) => setNewCheckin({ ...newCheckin, checkinType: e.target.value })}
                  >
                    <option value="FOUR_WEEK">4-Week Cadence</option>
                    <option value="SIX_WEEK">6-Week Cadence</option>
                    <option value="QUARTERLY">Quarterly Review</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status Assessment</label>
                  <select
                    className="form-select"
                    value={newCheckin.statusAssessment}
                    onChange={(e) => setNewCheckin({ ...newCheckin, statusAssessment: e.target.value })}
                  >
                    <option value="ON_TRACK">On Track</option>
                    <option value="AT_RISK">At Risk / Needs Support</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Current Progress: {newCheckin.progressPercentage}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  style={{ width: '100%' }}
                  value={newCheckin.progressPercentage}
                  onChange={(e) => setNewCheckin({ ...newCheckin, progressPercentage: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Employee Reflections &amp; Completed Milestones</label>
                <textarea
                  required
                  rows="3"
                  className="form-textarea"
                  placeholder="Notes on recent accomplishments, roadblocks, or breakthroughs..."
                  value={newCheckin.employeeNotes}
                  onChange={(e) => setNewCheckin({ ...newCheckin, employeeNotes: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Manager Feedback &amp; Support Commitment</label>
                <textarea
                  rows="2"
                  className="form-textarea"
                  placeholder="Manager observations, guidance, and commitments..."
                  value={newCheckin.managerFeedback}
                  onChange={(e) => setNewCheckin({ ...newCheckin, managerFeedback: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setCheckinModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Check-in Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
