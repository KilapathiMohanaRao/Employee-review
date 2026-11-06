import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyticsApi, reportApi, idpApi, cycleApi } from '../services/api';
import { KpiCard } from '../components/common/KpiCard';
import { ScorecardTable } from '../components/common/ScorecardTable';
import { RadarChart } from '../components/common/RadarChart';
import { AdminReviewsSection } from '../components/admin/AdminReviewsSection';
import { ShareReviewModal } from '../components/common/ShareReviewModal';
import {
  Users,
  RefreshCw,
  Award,
  CheckCircle,
  TrendingUp,
  Target,
  FileText,
  Clock,
  ChevronRight,
  Plus,
  LinkIcon,
} from '../components/common/Icons';
import { Link, Navigate } from 'react-router-dom';

export const DashboardPage = () => {
  const { user, hasRole } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [radarData, setRadarData] = useState([]);
  const [plans, setPlans] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

  const isSuperOrHr = hasRole('SUPER_ADMIN') || hasRole('HR_ADMIN');

  if (!isSuperOrHr) {
    // Strict privacy requirement: Employees only have access to the review submission page
    return <Navigate to="/review-form" replace />;
  }

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [mRes, rRes, radRes, pRes, cRes] = await Promise.all([
        analyticsApi.getDashboardMetrics().catch(() => ({ data: null })),
        reportApi.getEmployee360(user?.employeeId || 4).catch(() => ({ data: null })),
        analyticsApi.getRadarData(user?.employeeId || 4).catch(() => ({ data: [] })),
        idpApi.getMyPlans(user?.employeeId || 4).catch(() => ({ data: [] })),
        cycleApi.getAll().catch(() => ({ data: [] })),
      ]);

      if (mRes?.data) setMetrics(mRes.data);
      if (rRes?.data) setReportData(rRes.data);
      if (radRes?.data) setRadarData(radRes.data);
      if (pRes?.data) setPlans(pRes.data);
      if (cRes?.data) setCycles(cRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', padding: '1.75rem 2rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {isSuperOrHr ? 'Executive Talent & Performance Hub' : `Welcome back, ${user?.fullName || 'Colleague'}`}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            {isSuperOrHr
              ? 'Real-time overview of active 360 assessment cycles, participation rates, and organizational competency health.'
              : 'Track your 360-degree feedback, monitor developmental milestones, and review pending evaluations.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {isSuperOrHr && (
            <button
              onClick={() => setShowShareModal(true)}
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 800,
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.35)',
              }}
            >
              <LinkIcon size={16} />
              <span>Share Review Link (Candidates)</span>
            </button>
          )}
          <Link to="/assessments" className="btn btn-outline">
            <FileText size={16} /> Pending Feedback Reviews
          </Link>
          {isSuperOrHr && (
            <Link to="/cycles" className="btn btn-secondary">
              <Plus size={16} /> New Assessment Cycle
            </Link>
          )}
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
        <KpiCard
          title="Total Workforce"
          value={metrics?.totalEmployees || 7}
          subtitle="Active talent profiles"
          icon={<Users size={22} />}
          trend="up"
          trendValue="+12%"
          color="#3b82f6"
        />
        <KpiCard
          title="Active Assessment Cycles"
          value={metrics?.activeAssessmentCycles || 1}
          subtitle="Q4 360 Review in progress"
          icon={<RefreshCw size={22} />}
          color="#8b5cf6"
        />
        <KpiCard
          title="Assessment Completion"
          value={`${metrics?.overallCompletionPercentage || 85}%`}
          subtitle="Submitted peer reviews"
          icon={<CheckCircle size={22} />}
          trend="up"
          trendValue="+6.4%"
          color="#10b981"
        />
        <KpiCard
          title="Avg Competency Score"
          value={`${reportData?.overallScore || '4.15'} / 5.0`}
          subtitle="Across 11 standard competencies"
          icon={<Award size={22} />}
          color="#f59e0b"
        />
      </div>

      {/* Admin-Only Private Reviews & Ratings Management Hub */}
      <AdminReviewsSection />

      {/* Main Content Grid: Scorecard & Analytics Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.5rem' }}>
        {/* Radar Chart Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>11-Competency Multi-Rater Radar</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Comparing Self vs Manager vs Others vs Standard benchmark (4.0)
              </p>
            </div>
            <Link to="/analytics" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>
              Full Heatmap →
            </Link>
          </div>
          <RadarChart data={radarData} />
        </div>

        {/* Development & Insights Highlights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Top Strengths & Development Areas */}
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem' }}>
              360° Automated Performance Insights
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Top Strengths */}
              <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--success-light)', borderLeft: '4px solid var(--success)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: 'var(--success)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <Award size={16} /> TOP 3 STRENGTHS
                </div>
                {reportData?.topStrengths?.map((s, idx) => (
                  <div key={idx} style={{ fontSize: '0.775rem', marginBottom: '0.4rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    • {s.behaviourTitle} ({s.score} / 5.0)
                  </div>
                ))}
              </div>

              {/* Development Areas */}
              <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--warning-light)', borderLeft: '4px solid var(--warning)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: 'var(--warning)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <Target size={16} /> TOP DEVELOPMENT AREAS
                </div>
                {reportData?.topDevelopmentAreas?.map((d, idx) => (
                  <div key={idx} style={{ fontSize: '0.775rem', marginBottom: '0.4rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    • {d.behaviourTitle} ({d.score} / 5.0)
                  </div>
                ))}
              </div>
            </div>

            {/* Blind Spot Alert */}
            {reportData?.blindSpots?.length > 0 && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', border: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ fontSize: '1.25rem' }}>👁️</span>
                <div style={{ fontSize: '0.8rem' }}>
                  <strong>Blind Spot Identified in {reportData.blindSpots[0].competencyName}:</strong> Self-rating exceeds colleagues average by +{reportData.blindSpots[0].gap}. Seek proactive feedback.
                </div>
              </div>
            )}
          </div>

          {/* Active IDP Progress Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Individual Development Plan (70-20-10)</h3>
              <Link to="/development-plans" className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
                Manage IDP
              </Link>
            </div>

            {plans.length > 0 ? (
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  Focus: {plans[0].focusCompetencyName}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {plans[0].smartGoal}
                </div>

                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    <span>Target Date: {plans[0].targetDate}</span>
                    <span>{plans[0].overallProgress}% Complete</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', borderRadius: '9999px', background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                    <div style={{ width: `${plans[0].overallProgress}%`, height: '100%', background: 'linear-gradient(90deg, #2563eb, #10b981)', borderRadius: '9999px' }} />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No active development plan. Create one based on your 360° scorecard.</div>
            )}
          </div>
        </div>
      </div>

      {/* 360 Competency Scorecard Preview */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>360° Competency Scorecard (Excel Workbook Benchmark)</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Complete breakdown of the 11 core competencies across all 6 reviewer categories with gap analysis.
            </p>
          </div>
          <Link to="/reports/360" className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
            Open Printable Report &amp; CSV →
          </Link>
        </div>

        <ScorecardTable scorecards={reportData?.scorecards || []} />
      </div>

      {/* Admin Share Review Link Modal */}
      <ShareReviewModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
    </div>
  );
};
