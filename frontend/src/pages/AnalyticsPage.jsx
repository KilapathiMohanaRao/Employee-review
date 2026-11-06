import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyticsApi, employeeApi } from '../services/api';
import { RadarChart } from '../components/common/RadarChart';
import { HeatmapChart } from '../components/common/HeatmapChart';
import { TalentMatrixDiagram } from '../components/common/TalentMatrixDiagram';
import { ScoreboardPillars } from '../components/common/ScoreboardPillars';
import { PerceptionDeltaDiagram } from '../components/common/PerceptionDeltaDiagram';
import {
  BarChart3,
  Users,
  Award,
  Target,
  Sparkles,
  TrendingUp,
  Shield,
  Layers,
  ChevronRight,
  Filter,
} from '../components/common/Icons';

export const AnalyticsPage = () => {
  const { user, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // 'OVERVIEW' | 'TALENT_MATRIX' | 'SCOREBOARD_PILLARS' | 'PERCEPTION_DELTA' | 'HEATMAP'
  const [radarData, setRadarData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [talentMatrixData, setTalentMatrixData] = useState(null);
  const [scoreboardData, setScoreboardData] = useState(null);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [selectedEmpId, setSelectedEmpId] = useState(user?.employeeId || 4);
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSuperOrHr = hasRole('SUPER_ADMIN') || hasRole('HR_ADMIN') || hasRole('MANAGER');

  // Load employee list on mount
  useEffect(() => {
    employeeApi.getAll().then((res) => {
      if (res.data) setEmployeeList(res.data);
    }).catch((e) => console.error(e));

    loadGlobalAnalytics();
  }, []);

  // When selectedEmpId changes, reload subject-specific analytics
  useEffect(() => {
    loadSubjectAnalytics(selectedEmpId);
  }, [selectedEmpId]);

  const loadGlobalAnalytics = async () => {
    try {
      const [hRes, mRes, tRes] = await Promise.all([
        analyticsApi.getHeatmap().catch(() => ({ data: [] })),
        analyticsApi.getDashboardMetrics().catch(() => ({ data: null })),
        analyticsApi.getTalentMatrix().catch(() => ({ data: null })),
      ]);

      if (hRes?.data) setHeatmapData(hRes.data);
      if (mRes?.data) setDashboardMetrics(mRes.data);
      if (tRes?.data) setTalentMatrixData(tRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadSubjectAnalytics = async (empId) => {
    setLoading(true);
    try {
      const [rRes, sRes] = await Promise.all([
        analyticsApi.getRadarData(empId).catch(() => ({ data: [] })),
        analyticsApi.getScoreboard(empId).catch(() => ({ data: null })),
      ]);

      if (rRes?.data) setRadarData(rRes.data);
      if (sRes?.data) setScoreboardData(sRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectedEmployee = employeeList.find((e) => e.id === selectedEmpId) || {
    id: selectedEmpId,
    fullName: scoreboardData?.employeeName || 'Active Evaluatee',
    departmentName: scoreboardData?.department || 'Engineering',
    designationTitle: scoreboardData?.designation || 'Lead Engineer',
    avatarUrl: scoreboardData?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  };

  // Nav Tabs Config
  const tabs = [
    { id: 'OVERVIEW', label: 'Executive Hub', icon: <Layers size={16} /> },
    { id: 'TALENT_MATRIX', label: '3D Talent 9-Box Grid', icon: <Users size={16} /> },
    { id: 'SCOREBOARD_PILLARS', label: '3D Scoreboard Pillars', icon: <BarChart3 size={16} /> },
    { id: 'PERCEPTION_DELTA', label: 'Perception Delta & Gaps', icon: <Target size={16} /> },
    { id: 'HEATMAP', label: 'Competency Heatmap', icon: <Award size={16} /> },
  ];

  return (
    <div style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 3D Glass Header Banner */}
      <div
        className="glastic-header-banner"
        style={{
          padding: '1.75rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: '0 20px 40px -15px rgba(37, 99, 235, 0.15)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                background: 'linear-gradient(135deg, #2563eb, #8b5cf6)',
                color: '#ffffff',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                boxShadow: '0 0 12px rgba(37, 99, 235, 0.4)',
              }}
            >
              Enterprise Intelligence
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Cycle: Annual 360° Leadership Review
            </span>
          </div>

          <h1
            style={{
              fontSize: '1.85rem',
              fontWeight: 900,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Talent Analytics &amp; 3D Scoreboard Matrix
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem', maxWidth: '680px' }}>
            Multi-axis rater benchmarks, 9-box talent matrix calibration, organizational capability heatmaps, and 3D scoreboard diagnostics.
          </p>
        </div>

        {/* Subject Selector Glass Pill */}
        {employeeList.length > 0 && (
          <div
            className="glastic-card"
            style={{
              padding: '0.65rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              background: 'var(--bg-card)',
            }}
          >
            <img
              src={selectedEmployee.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={selectedEmployee.fullName}
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Subject Lens:
              </span>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(Number(e.target.value))}
                className="form-select"
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '0',
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  width: '210px',
                }}
              >
                {employeeList.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.fullName} ({e.departmentName || 'Engineering'})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 4 3D Glass KPI Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {/* KPI 1: Overall 360 Scoreboard Mean */}
        <div className="glastic-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              360 Evaluated Score
            </span>
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(37, 99, 235, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <Award size={16} />
            </span>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
            {scoreboardData?.overallScore || '4.25'}
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}> / 5.0</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700 }}>
            <TrendingUp size={14} />
            <span>+0.25 above enterprise standard (4.00)</span>
          </div>
        </div>

        {/* KPI 2: Multi-Rater Consensus Alignment */}
        <div className="glastic-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Consensus Agreement
            </span>
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--success)',
              }}
            >
              <Shield size={16} />
            </span>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
            {scoreboardData?.consensusAlignmentScore || '91.0'}%
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Self &amp; Stakeholder perceptions align</span>
          </div>
        </div>

        {/* KPI 3: Top Core Superpower */}
        <div className="glastic-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Top Evaluated Strength
            </span>
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(139, 92, 246, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--purple)',
              }}
            >
              <Sparkles size={16} />
            </span>
          </div>
          <div
            style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginTop: '0.5rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {scoreboardData?.topStrengths?.[0] || 'Technical Leadership'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--purple)', fontWeight: 700 }}>
            <span>Consensus benchmark exemplar</span>
          </div>
        </div>

        {/* KPI 4: Primary Development Opportunity */}
        <div className="glastic-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Target Development Area
            </span>
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--warning)',
              }}
            >
              <Target size={16} />
            </span>
          </div>
          <div
            style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginTop: '0.5rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {scoreboardData?.topDevelopmentAreas?.[0] || 'People Mentorship & Coaching'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 700 }}>
            <span>Recommended for IDP action item</span>
          </div>
        </div>
      </div>

      {/* 3D Glass Tab Navigation Bar */}
      <div
        className="glastic-card"
        style={{
          padding: '0.4rem',
          display: 'flex',
          gap: '0.4rem',
          overflowX: 'auto',
          background: 'var(--bg-tertiary)',
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="btn"
              style={{
                flex: 1,
                minWidth: '160px',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--bg-card)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--border-color)' : '1px solid transparent',
                boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Executive Overview Hub */}
      {activeTab === 'OVERVIEW' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Grid: 11-Axis Radar Chart & Department Performance Bars */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.5rem' }}>
            {/* Radar Chart in 3D Glastic Card */}
            <div className="glastic-card" style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    11-Competency Multi-Rater Radar Chart
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Visualizing {selectedEmployee.fullName}&apos;s polygon benchmark against Self, Manager, Others &amp; Standard (4.0).
                  </p>
                </div>
              </div>
              <RadarChart data={radarData} />
            </div>

            {/* Department Performance Comparisons in 3D Glastic Card */}
            <div className="glastic-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Department-Wise Competency Score &amp; Completion
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Benchmarked across organizational business units.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, justifyContent: 'space-around' }}>
                {dashboardMetrics?.departmentPerformance?.map((dept) => {
                  const scorePercent = ((Number(dept.averageScore) || 3.8) / 5.0) * 100;
                  return (
                    <div
                      key={dept.departmentId}
                      style={{
                        padding: '0.9rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                        <div>
                          <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{dept.departmentName}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                            ({dept.totalEmployees} talent profiles)
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--primary)' }}>
                            {dept.averageScore} / 5.0
                          </span>
                          <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                            {dept.completionRate}% Done
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ width: '100%', height: '8px', borderRadius: '9999px', background: 'var(--border-color)', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${scorePercent}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                            borderRadius: '9999px',
                            boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick 3D Scoreboard Pillar Snapshot */}
          <ScoreboardPillars scoreboardData={scoreboardData} selectedEmpName={selectedEmployee.fullName} />
        </div>
      )}

      {/* Tab 2: 3D Talent 9-Box Matrix Grid */}
      {activeTab === 'TALENT_MATRIX' && (
        <TalentMatrixDiagram
          talentMatrixData={talentMatrixData}
          onSelectEmployee={(empId) => {
            setSelectedEmpId(empId);
            setActiveTab('SCOREBOARD_PILLARS');
          }}
          selectedEmpId={selectedEmpId}
        />
      )}

      {/* Tab 3: 3D Scoreboard Pillar Diagram */}
      {activeTab === 'SCOREBOARD_PILLARS' && (
        <ScoreboardPillars scoreboardData={scoreboardData} selectedEmpName={selectedEmployee.fullName} />
      )}

      {/* Tab 4: Perception Delta & Polarization Radar */}
      {activeTab === 'PERCEPTION_DELTA' && (
        <PerceptionDeltaDiagram scoreboardData={scoreboardData} selectedEmpName={selectedEmployee.fullName} />
      )}

      {/* Tab 5: Organizational Competency Heatmap Matrix */}
      {activeTab === 'HEATMAP' && (
        <HeatmapChart heatmapData={heatmapData} />
      )}
    </div>
  );
};
