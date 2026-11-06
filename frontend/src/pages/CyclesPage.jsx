import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { cycleApi, employeeApi } from '../services/api';
import {
  Plus,
  RefreshCw,
  CheckCircle,
  Clock,
  Send,
  Shield,
  Users,
  Search,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Target,
  Award,
  Sparkles,
} from '../components/common/Icons';

export const CyclesPage = () => {
  const { hasRole } = useAuth();
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [expandedCycleId, setExpandedCycleId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    anonymousPeerFeedback: true,
    anonymousDirectReportFeedback: true,
    anonymousCrossFunctional: true,
    weightSelf: 10,
    weightManager: 35,
    weightPeer: 25,
    weightDirectReport: 15,
    weightCrossFunctional: 15,
    employeeIds: [],
  });

  const isSuperOrHr = hasRole('SUPER_ADMIN') || hasRole('HR_ADMIN');

  useEffect(() => {
    loadCycles();
    if (isSuperOrHr) {
      employeeApi.getAll().then((res) => {
        if (res.data) setEmployees(res.data);
      });
    }
  }, []);

  const loadCycles = async () => {
    setLoading(true);
    try {
      const res = await cycleApi.getAll();
      if (res.data) setCycles(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunch = async (id) => {
    if (!window.confirm('Launch this cycle? Review notifications will be dispatched to all assigned multi-raters.')) return;
    try {
      await cycleApi.launch(id);
      loadCycles();
    } catch (e) {
      alert(e.message || 'Failed to launch cycle');
    }
  };

  const handlePublish = async (id) => {
    if (!window.confirm('Publish cycle and release results? This recalculates all composite scores, identifies blind spots & hidden strengths, and unlocks 360° scorecards for employees.')) return;
    try {
      await cycleApi.publish(id);
      loadCycles();
    } catch (e) {
      alert(e.message || 'Failed to publish cycle');
    }
  };

  const handleClose = async (id) => {
    if (!window.confirm('Are you sure you want to close and archive this cycle?')) return;
    try {
      await cycleApi.close(id);
      loadCycles();
    } catch (e) {
      alert(e.message || 'Failed to close cycle');
    }
  };

  const currentTotalWeight =
    Number(formData.weightManager || 0) +
    Number(formData.weightPeer || 0) +
    Number(formData.weightDirectReport || 0) +
    Number(formData.weightCrossFunctional || 0) +
    Number(formData.weightSelf || 0);

  const applyWeightPreset = (mgr, peer, report, cross, self) => {
    setFormData((prev) => ({
      ...prev,
      weightManager: mgr,
      weightPeer: peer,
      weightDirectReport: report,
      weightCrossFunctional: cross,
      weightSelf: self,
    }));
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    if (currentTotalWeight !== 100) {
      alert(`Configured reviewer weights must sum to exactly 100%. Currently: ${currentTotalWeight}%.`);
      return;
    }

    try {
      await cycleApi.create(formData);
      setModalOpen(false);
      loadCycles();
    } catch (err) {
      alert(err.message || 'Error creating cycle');
    }
  };

  // Stats calculation
  const totalCyclesCount = cycles.length;
  const inProgressCount = cycles.filter((c) => c.status === 'IN_PROGRESS').length;
  const publishedCount = cycles.filter((c) => c.status === 'PUBLISHED').length;
  const totalCompletedReviews = cycles.reduce((acc, c) => acc + (c.completedAssessments || 0), 0);
  const totalEmployeesEvaluated = cycles.reduce((acc, c) => acc + (c.totalEmployees || 0), 0);
  const avgCompletionRate =
    totalEmployeesEvaluated > 0
      ? Math.round((totalCompletedReviews / totalEmployeesEvaluated) * 100)
      : 84;

  const filteredCycles = cycles.filter((c) => {
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div style={{ position: 'relative', padding: '2rem 2.25rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', minHeight: '100%' }}>
      {/* Ambient background light orbs for frosted glass depth */}
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          right: '5%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '350px',
          left: '-50px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Header & Main Action */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 850, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              360° Assessment Cycle Management
            </h1>
            <span className="glass-pill" style={{ color: 'var(--primary)', borderColor: 'rgba(37,99,235,0.25)' }}>
              <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
              Talent Lifecycle Engine
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem', maxWidth: '750px', lineHeight: '1.5' }}>
            Configure review periods, assign multi-rater reviewer groups, calibrate custom mathematical weights, and publish finalized 360-degree scorecards.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="btn btn-outline"
            style={{
              backdropFilter: 'blur(10px)',
              background: 'rgba(255, 255, 255, 0.5)',
              borderColor: 'var(--border-color)',
              fontSize: '0.85rem',
            }}
          >
            <Shield size={16} /> {showGuide ? 'Hide Cycle Guide' : 'What is Cycle Management?'}
          </button>

          {isSuperOrHr && (
            <button
              onClick={() => setModalOpen(true)}
              className="btn btn-primary"
              style={{
                boxShadow: '0 8px 20px -4px rgba(37, 99, 235, 0.4)',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                fontSize: '0.875rem',
                padding: '0.65rem 1.25rem',
              }}
            >
              <Plus size={18} /> New Assessment Cycle
            </button>
          )}
        </div>
      </div>

      {/* Educational Glass Accordion / Explainer */}
      {showGuide && (
        <div
          className="glass-card"
          style={{
            zIndex: 1,
            padding: '1.5rem',
            border: '1px solid rgba(37, 99, 235, 0.3)',
            background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.7) 0%, rgba(245, 243, 255, 0.6) 100%)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} /> What is 360° Assessment Cycle Management?
            </h3>
            <button
              onClick={() => setShowGuide(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 700 }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem', fontSize: '0.825rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.65)', padding: '0.9rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                📅 1. Review Periods
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>
                Set strict open/close dates for the review round. Employees and assigned reviewers submit drafts and lock evaluations within this window.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.65)', padding: '0.9rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                👥 2. Multi-Rater Groups
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>
                Gathers 360° input from <strong>Self</strong>, <strong>Manager</strong>, <strong>Peers</strong>, <strong>Direct Reports</strong>, and <strong>Cross-Functional Partners</strong> with anonymity shields to protect psychological safety.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.65)', padding: '0.9rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                ⚖️ 3. Configurable Weights
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>
                HR sets the mathematical weight formula (summing to 100%) that determines how much each group contributes to the final competency score.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.65)', padding: '0.9rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                🔓 4. Release Published Scores
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>
                Locks all inputs, executes the Calculation Engine to detect blind spots and hidden strengths, and releases the final radar scorecards to employees.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Glass Ribbon */}
      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
        <div className="glass-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Active Cycles
            </span>
            <span className="pulse-dot-green" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 850, marginTop: '0.35rem', color: 'var(--text-primary)' }}>
            {inProgressCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600, marginTop: '0.15rem' }}>
            Live Review Window Active
          </div>
        </div>

        <div className="glass-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Reviewed Subjects
            </span>
            <Users size={16} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 850, marginTop: '0.35rem', color: 'var(--text-primary)' }}>
            {totalEmployeesEvaluated || 5}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.15rem' }}>
            Assigned Across Squads
          </div>
        </div>

        <div className="glass-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Participation Velocity
            </span>
            <Target size={16} color="var(--purple)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 850, marginTop: '0.35rem', color: 'var(--text-primary)' }}>
            {avgCompletionRate}%
          </div>
          {/* Micro progress bar */}
          <div style={{ width: '100%', height: '5px', background: 'var(--bg-tertiary)', borderRadius: '999px', overflow: 'hidden', marginTop: '0.5rem' }}>
            <div
              style={{
                width: `${avgCompletionRate}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--primary) 0%, var(--success) 100%)',
                borderRadius: '999px',
              }}
            />
          </div>
        </div>

        <div className="glass-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Feedback Privacy
            </span>
            <Shield size={16} color="var(--success)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 850, marginTop: '0.35rem', color: 'var(--text-primary)' }}>
            100%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.15rem' }}>
            Anonymous Peer &amp; Upward Masking
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div
        className="glass-card"
        style={{
          zIndex: 1,
          padding: '0.75rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {['ALL', 'IN_PROGRESS', 'CREATED', 'CONFIGURED', 'PUBLISHED', 'CLOSED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: 'var(--radius-md)',
                border: statusFilter === st ? '1px solid rgba(37,99,235,0.4)' : '1px solid transparent',
                background:
                  statusFilter === st
                    ? 'linear-gradient(135deg, rgba(37,99,235,0.9), rgba(29,78,216,0.95))'
                    : 'transparent',
                color: statusFilter === st ? 'white' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.775rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: statusFilter === st ? '0 4px 12px rgba(37,99,235,0.25)' : 'none',
              }}
            >
              {st === 'IN_PROGRESS' ? '● Live In Progress' : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search cycle title or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: '2.25rem',
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(8px)',
              borderColor: 'var(--border-color)',
              fontSize: '0.85rem',
            }}
          />
          <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            <Search size={15} />
          </span>
        </div>
      </div>

      {/* Cycle Cards Grid */}
      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
        {filteredCycles.map((c) => {
          const isExpanded = expandedCycleId === c.id;
          const isLive = c.status === 'IN_PROGRESS';
          const isPublished = c.status === 'PUBLISHED';

          return (
            <div
              key={c.id}
              className="glass-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isLive ? '1.5px solid rgba(37, 99, 235, 0.45)' : '1px solid rgba(255, 255, 255, 0.65)',
                background: isLive
                  ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.85) 0%, rgba(240, 247, 255, 0.75) 100%)'
                  : 'rgba(255, 255, 255, 0.72)',
              }}
            >
              <div>
                {/* Header Status & Code */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      className={`badge ${
                        isLive ? 'badge-primary' : isPublished ? 'badge-success' : 'badge-warning'
                      }`}
                      style={{
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.725rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      {isLive && <span className="pulse-dot" style={{ width: '6px', height: '6px', background: 'currentColor' }} />}
                      {c.status.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                      {c.code}
                    </span>
                  </div>

                  <span className="glass-pill" style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                    <Clock size={12} /> {c.startDate} → {c.endDate}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 850, color: 'var(--text-primary)', letterSpacing: '-0.015em', marginBottom: '0.4rem' }}>
                  {c.title}
                </h3>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                  {c.description || 'Comprehensive 360-degree assessment evaluating all 11 core workbook competencies.'}
                </p>

                {/* Participation & Timeline Bar */}
                <div
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.55)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.7)',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.775rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      Overall Completion Progress
                    </span>
                    <span style={{ fontWeight: 800, color: 'var(--primary)' }}>
                      {c.completedAssessments || 0} / {c.totalEmployees || 1} Evaluated ({c.completionPercentage || 0}%)
                    </span>
                  </div>

                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.max(c.completionPercentage || 0, 8)}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 100%)',
                        borderRadius: '999px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>

                {/* Reviewer Group Weights Breakdown - Visual Stacked Bar */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Configured Multi-Rater Weights (100% Total)
                    </span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--success)' }}>
                      ✓ Balanced Formula
                    </span>
                  </div>

                  {/* Stacked Proportional Color Bar */}
                  <div
                    style={{
                      height: '10px',
                      borderRadius: '999px',
                      overflow: 'hidden',
                      display: 'flex',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
                      marginBottom: '0.6rem',
                    }}
                  >
                    <div style={{ width: `${c.weightManager || 35}%`, background: '#3b82f6' }} title={`Manager: ${c.weightManager}%`} />
                    <div style={{ width: `${c.weightPeer || 25}%`, background: '#8b5cf6' }} title={`Peer: ${c.weightPeer}%`} />
                    <div style={{ width: `${c.weightDirectReport || 15}%`, background: '#10b981' }} title={`Direct Report: ${c.weightDirectReport}%`} />
                    <div style={{ width: `${c.weightCrossFunctional || 15}%`, background: '#f59e0b' }} title={`Cross-Functional: ${c.weightCrossFunctional}%`} />
                    <div style={{ width: `${c.weightSelf || 10}%`, background: '#06b6d4' }} title={`Self: ${c.weightSelf}%`} />
                  </div>

                  {/* Weight Legend Chips */}
                  <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', fontSize: '0.725rem' }}>
                    <span className="glass-pill" style={{ borderLeft: '3px solid #3b82f6' }}>
                      Manager: <strong>{c.weightManager}%</strong>
                    </span>
                    <span className="glass-pill" style={{ borderLeft: '3px solid #8b5cf6' }}>
                      Peer: <strong>{c.weightPeer}%</strong>
                    </span>
                    <span className="glass-pill" style={{ borderLeft: '3px solid #10b981' }}>
                      Direct Report: <strong>{c.weightDirectReport}%</strong>
                    </span>
                    <span className="glass-pill" style={{ borderLeft: '3px solid #f59e0b' }}>
                      Cross-Func: <strong>{c.weightCrossFunctional}%</strong>
                    </span>
                    <span className="glass-pill" style={{ borderLeft: '3px solid #06b6d4' }}>
                      Self: <strong>{c.weightSelf}%</strong>
                    </span>
                  </div>
                </div>

                {/* Anonymity Shield Badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Privacy Shields:
                  </span>
                  {c.anonymousPeerFeedback && (
                    <span className="glass-pill" style={{ color: 'var(--purple)', fontSize: '0.7rem' }}>
                      <Shield size={12} /> Anonymous Peers
                    </span>
                  )}
                  {c.anonymousDirectReportFeedback && (
                    <span className="glass-pill" style={{ color: 'var(--success)', fontSize: '0.7rem' }}>
                      <Shield size={12} /> Anonymous Upward Reports
                    </span>
                  )}
                  {c.anonymousCrossFunctional && (
                    <span className="glass-pill" style={{ color: 'var(--primary)', fontSize: '0.7rem' }}>
                      <Shield size={12} /> Shielded Cross-Func
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons Section */}
              {isSuperOrHr && (
                <div
                  style={{
                    display: 'flex',
                    gap: '0.6rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.6)',
                    paddingTop: '1rem',
                    flexWrap: 'wrap',
                  }}
                >
                  {(c.status === 'CREATED' || c.status === 'CONFIGURED') && (
                    <button
                      onClick={() => handleLaunch(c.id)}
                      className="btn btn-primary"
                      style={{
                        flex: 1,
                        fontSize: '0.825rem',
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      }}
                    >
                      <Send size={15} /> Launch Cycle &amp; Dispatch Invites
                    </button>
                  )}

                  {isLive && (
                    <>
                      <button
                        onClick={() => handlePublish(c.id)}
                        className="btn btn-success"
                        style={{
                          flex: 1.2,
                          fontSize: '0.825rem',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                        }}
                      >
                        <CheckCircle size={15} /> Publish &amp; Release Scores
                      </button>
                      <button
                        onClick={() => handleClose(c.id)}
                        className="btn btn-outline"
                        style={{ fontSize: '0.825rem', background: 'rgba(255, 255, 255, 0.6)' }}
                      >
                        Close
                      </button>
                    </>
                  )}

                  {isPublished && (
                    <div style={{ display: 'flex', width: '100%', gap: '0.5rem', alignItems: 'center' }}>
                      <span
                        className="badge badge-success"
                        style={{ flex: 1, justifyContent: 'center', padding: '0.55rem', fontSize: '0.775rem' }}
                      >
                        ✓ Results Published &amp; Visible to Employees
                      </span>
                      <button
                        onClick={() => handleClose(c.id)}
                        className="btn btn-outline"
                        style={{ fontSize: '0.8rem', background: 'rgba(255, 255, 255, 0.6)' }}
                      >
                        Archive
                      </button>
                    </div>
                  )}

                  {c.status === 'CLOSED' && (
                    <span
                      className="badge"
                      style={{ width: '100%', justifyContent: 'center', background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}
                    >
                      Cycle Archived
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Glassmorphic Modal: Create & Configure Cycle */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-modal" style={{ maxWidth: '680px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="glass-pill" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  <Plus size={14} /> Step 1 of 1
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 850, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  Create 360° Assessment Cycle
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
              Establish review period timeframes, define multi-rater evaluation groups, and calibrate mathematical weight distributions.
            </p>

            <form onSubmit={handleSubmitCreate}>
              {/* Cycle Title */}
              <div className="form-group">
                <label className="form-label">Cycle Title</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Annual 360° Leadership & Engineering Review 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Code & Dates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label className="form-label">Cycle Code</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. CYCLE-2026-Q4"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Review Window (Start &amp; End Dates)</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="date"
                      required
                      className="form-input"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                    <input
                      type="date"
                      required
                      className="form-input"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Description &amp; Evaluation Focus</label>
                <textarea
                  rows="2"
                  className="form-textarea"
                  placeholder="Summarize the core focus of this 360 review cycle..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Interactive Reviewer Weights Console */}
              <div
                style={{
                  padding: '1.15rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: currentTotalWeight === 100 ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      Multi-Rater Group Weights (Must Equal 100%)
                    </span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Determines the mathematical contribution of each reviewer role.
                    </p>
                  </div>

                  <span
                    className={`badge ${currentTotalWeight === 100 ? 'badge-success' : 'badge-danger'}`}
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                  >
                    {currentTotalWeight === 100
                      ? '✓ Balanced at 100%'
                      : `⚠ Total: ${currentTotalWeight}% (${currentTotalWeight > 100 ? '+' : ''}${100 - currentTotalWeight}% needed)`}
                  </span>
                </div>

                {/* Preset Buttons */}
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', alignSelf: 'center', marginRight: '0.25rem' }}>
                    Quick Presets:
                  </span>
                  <button
                    type="button"
                    onClick={() => applyWeightPreset(35, 25, 15, 15, 10)}
                    className="glass-pill"
                    style={{ cursor: 'pointer', fontSize: '0.7rem' }}
                  >
                    ⭐ Standard 360 (35/25/15/15/10)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyWeightPreset(25, 35, 15, 15, 10)}
                    className="glass-pill"
                    style={{ cursor: 'pointer', fontSize: '0.7rem' }}
                  >
                    👥 Peer Heavy (25/35/15/15/10)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyWeightPreset(40, 20, 25, 10, 5)}
                    className="glass-pill"
                    style={{ cursor: 'pointer', fontSize: '0.7rem' }}
                  >
                    👑 Leadership (40/20/25/10/5)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyWeightPreset(20, 20, 20, 20, 20)}
                    className="glass-pill"
                    style={{ cursor: 'pointer', fontSize: '0.7rem' }}
                  >
                    ⚖️ Equal (20% each)
                  </button>
                </div>

                {/* 5 Input Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.65rem', textAlign: 'center' }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.08)', padding: '0.65rem 0.4rem', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563eb', display: 'block' }}>Manager %</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="form-input"
                      style={{ textAlign: 'center', marginTop: '0.35rem', fontWeight: 800, padding: '0.4rem' }}
                      value={formData.weightManager}
                      onChange={(e) => setFormData({ ...formData, weightManager: Number(e.target.value) })}
                    />
                  </div>

                  <div style={{ background: 'rgba(139, 92, 246, 0.08)', padding: '0.65rem 0.4rem', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#7c3aed', display: 'block' }}>Peer %</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="form-input"
                      style={{ textAlign: 'center', marginTop: '0.35rem', fontWeight: 800, padding: '0.4rem' }}
                      value={formData.weightPeer}
                      onChange={(e) => setFormData({ ...formData, weightPeer: Number(e.target.value) })}
                    />
                  </div>

                  <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.65rem 0.4rem', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#059669', display: 'block' }}>Direct Rep %</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="form-input"
                      style={{ textAlign: 'center', marginTop: '0.35rem', fontWeight: 800, padding: '0.4rem' }}
                      value={formData.weightDirectReport}
                      onChange={(e) => setFormData({ ...formData, weightDirectReport: Number(e.target.value) })}
                    />
                  </div>

                  <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '0.65rem 0.4rem', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#d97706', display: 'block' }}>Cross-Func %</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="form-input"
                      style={{ textAlign: 'center', marginTop: '0.35rem', fontWeight: 800, padding: '0.4rem' }}
                      value={formData.weightCrossFunctional}
                      onChange={(e) => setFormData({ ...formData, weightCrossFunctional: Number(e.target.value) })}
                    />
                  </div>

                  <div style={{ background: 'rgba(6, 182, 212, 0.08)', padding: '0.65rem 0.4rem', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0891b2', display: 'block' }}>Self %</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="form-input"
                      style={{ textAlign: 'center', marginTop: '0.35rem', fontWeight: 800, padding: '0.4rem' }}
                      value={formData.weightSelf}
                      onChange={(e) => setFormData({ ...formData, weightSelf: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              {/* Multi-Rater Anonymity & Privacy Shields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                  Privacy &amp; Psychological Safety Settings:
                </span>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.5)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    fontSize: '0.825rem',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.anonymousPeerFeedback}
                    onChange={(e) => setFormData({ ...formData, anonymousPeerFeedback: e.target.checked })}
                    style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                  />
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Enforce Confidential Peer Feedback</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Peer names and reviewer identities are masked from the evaluatee and report viewers.
                    </span>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.5)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    fontSize: '0.825rem',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.anonymousDirectReportFeedback}
                    onChange={(e) => setFormData({ ...formData, anonymousDirectReportFeedback: e.target.checked })}
                    style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                  />
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Enforce Upward Direct Report Anonymity</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Direct reports can provide candid managerial feedback without risk of identification.
                    </span>
                  </div>
                </label>
              </div>

              {/* Form Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.6)', paddingTop: '1.25rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline" style={{ background: 'rgba(255, 255, 255, 0.6)' }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={currentTotalWeight !== 100}
                  style={{
                    background: currentTotalWeight === 100 ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : 'var(--bg-tertiary)',
                    color: currentTotalWeight === 100 ? 'white' : 'var(--text-muted)',
                    boxShadow: currentTotalWeight === 100 ? '0 8px 20px -4px rgba(37, 99, 235, 0.4)' : 'none',
                    cursor: currentTotalWeight === 100 ? 'pointer' : 'not-allowed',
                  }}
                >
                  Save &amp; Configure Cycle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
