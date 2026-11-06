import React, { useState, useMemo } from 'react';
import { Users, Star, Award, Shield, Target, Sparkles, Filter, ChevronRight } from './Icons';

export const TalentMatrixDiagram = ({ talentMatrixData, onSelectEmployee, selectedEmpId }) => {
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredEmp, setHoveredEmp] = useState(null);

  const employees = talentMatrixData?.employees || [];

  // Extract departments
  const departments = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.department))).filter(Boolean);
  }, [employees]);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchDept = selectedDept === 'ALL' || emp.department === selectedDept;
      const matchQuery =
        !searchQuery ||
        emp.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchQuery;
    });
  }, [employees, selectedDept, searchQuery]);

  // 9 Quadrant definitions
  const quadrantDefs = [
    // Row 1: High Potential (Y: High)
    {
      key: 'ROUGH_DIAMOND',
      row: 0,
      col: 0,
      label: 'Rough Diamonds',
      sublabel: 'High Potential · Developing Performance',
      perfRange: '< 3.6',
      potRange: '≥ 4.2',
      color: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.25)',
      bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(217, 119, 6, 0.05))',
      action: 'Targeted technical mentoring & stretch goals',
    },
    {
      key: 'EMERGING_LEADER',
      row: 0,
      col: 1,
      label: 'Emerging Leaders',
      sublabel: 'High Potential · Strong Performance',
      perfRange: '3.6 - 4.1',
      potRange: '≥ 4.2',
      color: '#8b5cf6',
      glow: 'rgba(139, 92, 246, 0.25)',
      bg: 'linear-gradient(135deg, rgba(139, 92, 246, 0.14), rgba(109, 40, 217, 0.06))',
      action: 'Fast-track leadership succession & high-visibility projects',
    },
    {
      key: 'TOP_TALENT',
      row: 0,
      col: 2,
      label: 'Top Talent / Stars',
      sublabel: 'High Potential · Benchmark Performance',
      perfRange: '≥ 4.2',
      potRange: '≥ 4.2',
      color: '#10b981',
      glow: 'rgba(16, 185, 129, 0.35)',
      bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18), rgba(5, 150, 105, 0.08))',
      action: 'Executive sponsorship, retain, and elevate as benchmark coach',
    },

    // Row 2: Medium Potential (Y: Med)
    {
      key: 'INCONSISTENT',
      row: 1,
      col: 0,
      label: 'Inconsistent / Dilemmas',
      sublabel: 'Medium Potential · Developing Performance',
      perfRange: '< 3.6',
      potRange: '3.6 - 4.1',
      color: '#ea580c',
      glow: 'rgba(234, 88, 12, 0.25)',
      bg: 'linear-gradient(135deg, rgba(234, 88, 12, 0.12), rgba(194, 65, 12, 0.05))',
      action: 'Clarify expectations, resolve bottlenecks & monitor milestones',
    },
    {
      key: 'CORE_PILLAR',
      row: 1,
      col: 1,
      label: 'Core Pillars',
      sublabel: 'Solid Potential · Solid Performance',
      perfRange: '3.6 - 4.1',
      potRange: '3.6 - 4.1',
      color: '#6366f1',
      glow: 'rgba(99, 102, 241, 0.25)',
      bg: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(67, 56, 202, 0.05))',
      action: 'Continuous capability enrichment & horizontal domain expansion',
    },
    {
      key: 'HIGH_IMPACT',
      row: 1,
      col: 2,
      label: 'High Impact Specialists',
      sublabel: 'Solid Potential · Benchmark Performance',
      perfRange: '≥ 4.2',
      potRange: '3.6 - 4.1',
      color: '#059669',
      glow: 'rgba(5, 150, 105, 0.3)',
      bg: 'linear-gradient(135deg, rgba(5, 150, 105, 0.15), rgba(4, 120, 87, 0.06))',
      action: 'Domain leadership, architectural ownership & key deliverables',
    },

    // Row 3: Low Potential (Y: Low)
    {
      key: 'ACTION_REQUIRED',
      row: 2,
      col: 0,
      label: 'Action Required',
      sublabel: 'Low Potential · Developing Performance',
      perfRange: '< 3.6',
      potRange: '< 3.6',
      color: '#ef4444',
      glow: 'rgba(239, 68, 68, 0.25)',
      bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.14), rgba(185, 28, 28, 0.06))',
      action: 'Structured PIP or role realignment',
    },
    {
      key: 'EFFECTIVE_PRO',
      row: 2,
      col: 1,
      label: 'Effective Contributors',
      sublabel: 'Low Potential · Solid Performance',
      perfRange: '3.6 - 4.1',
      potRange: '< 3.6',
      color: '#64748b',
      glow: 'rgba(100, 116, 139, 0.2)',
      bg: 'linear-gradient(135deg, rgba(100, 116, 139, 0.1), rgba(71, 85, 105, 0.05))',
      action: 'Steady operational roles & steady maintenance execution',
    },
    {
      key: 'MASTER_CONTRIBUTOR',
      row: 2,
      col: 2,
      label: 'Master Contributors',
      sublabel: 'Low Potential · Benchmark Performance',
      perfRange: '≥ 4.2',
      potRange: '< 3.6',
      color: '#0284c7',
      glow: 'rgba(2, 132, 199, 0.25)',
      bg: 'linear-gradient(135deg, rgba(2, 132, 199, 0.14), rgba(3, 105, 161, 0.06))',
      action: 'Subject-matter expert consultation & specialized delivery',
    },
  ];

  // Group filtered employees into quadrants
  const quadrantMap = useMemo(() => {
    const map = {};
    quadrantDefs.forEach((q) => { map[q.key] = []; });
    filteredEmployees.forEach((emp) => {
      if (map[emp.quadrantKey]) {
        map[emp.quadrantKey].push(emp);
      } else {
        // Fallback matching
        map['CORE_PILLAR'].push(emp);
      }
    });
    return map;
  }, [filteredEmployees]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 9-Box Controls & Filter Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Department:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="form-select"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', width: '200px' }}
            >
              <option value="ALL">All Departments ({employees.length})</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder="Search talent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', width: '180px' }}
          />
        </div>

        {/* Talent Distribution Summary KPI */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Top Talent:</span>
            <strong style={{ color: '#10b981' }}>{quadrantMap['TOP_TALENT']?.length || 0}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#8b5cf6' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Emerging:</span>
            <strong style={{ color: '#8b5cf6' }}>{quadrantMap['EMERGING_LEADER']?.length || 0}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#059669' }} />
            <span style={{ color: 'var(--text-secondary)' }}>High Impact:</span>
            <strong style={{ color: '#059669' }}>{quadrantMap['HIGH_IMPACT']?.length || 0}</strong>
          </div>
        </div>
      </div>

      {/* 9-Box Grid Layout with Axis Labels */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* Y-Axis Label: Potential / Leadership Mastery */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.825rem' }}>
            <Sparkles size={16} />
            <span>Y-AXIS: FUTURE POTENTIAL &amp; LEADERSHIP CAPACITY</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            High (Top) to Low (Bottom)
          </div>
        </div>

        {/* The 3x3 Quadrant Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
          }}
        >
          {quadrantDefs.map((q) => {
            const empsInQuadrant = quadrantMap[q.key] || [];
            return (
              <div
                key={q.key}
                className="glastic-card"
                style={{
                  background: q.bg,
                  border: `1.5px solid ${q.color}40`,
                  boxShadow: `0 8px 24px -6px ${q.glow}`,
                  padding: '1rem',
                  minHeight: '210px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Quadrant Header */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: q.color, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {q.label}
                      </h4>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                        {q.sublabel}
                      </p>
                    </div>
                    <span
                      style={{
                        padding: '0.15rem 0.5rem',
                        borderRadius: '9999px',
                        background: `${q.color}25`,
                        color: q.color,
                        fontWeight: 800,
                        fontSize: '0.725rem',
                        border: `1px solid ${q.color}50`,
                      }}
                    >
                      {empsInQuadrant.length}
                    </span>
                  </div>

                  {/* Plotted Employees List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                    {empsInQuadrant.map((emp) => {
                      const isSelected = selectedEmpId === emp.employeeId;
                      return (
                        <div
                          key={emp.employeeId}
                          onClick={() => onSelectEmployee && onSelectEmployee(emp.employeeId)}
                          onMouseEnter={() => setHoveredEmp(emp)}
                          onMouseLeave={() => setHoveredEmp(null)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.5rem 0.65rem',
                            borderRadius: '8px',
                            background: isSelected ? 'var(--primary)' : 'var(--bg-card)',
                            color: isSelected ? '#ffffff' : 'var(--text-primary)',
                            border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                            boxShadow: isSelected
                              ? '0 4px 15px rgba(37, 99, 235, 0.4)'
                              : '0 2px 6px rgba(0,0,0,0.06)',
                            cursor: 'pointer',
                            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                            transform: isSelected ? 'scale(1.02)' : 'none',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img
                              src={emp.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                              alt={emp.employeeName}
                              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontSize: '0.775rem', fontWeight: 800, lineHeight: 1.2 }}>
                                {emp.employeeName}
                              </div>
                              <div style={{ fontSize: '0.675rem', color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}>
                                {emp.department}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span
                              style={{
                                fontSize: '0.725rem',
                                fontWeight: 800,
                                padding: '0.15rem 0.35rem',
                                borderRadius: '4px',
                                background: isSelected ? 'rgba(255,255,255,0.2)' : `${q.color}20`,
                                color: isSelected ? '#ffffff' : q.color,
                              }}
                            >
                              {emp.performanceScore}★
                            </span>
                            <ChevronRight size={14} color={isSelected ? '#ffffff' : 'var(--text-muted)'} />
                          </div>
                        </div>
                      );
                    })}

                    {empsInQuadrant.length === 0 && (
                      <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', fontStyle: 'italic' }}>
                        No talent currently placed in this quadrant
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommended Strategic HR Action */}
                <div
                  style={{
                    marginTop: '0.85rem',
                    paddingTop: '0.5rem',
                    borderTop: `1px dashed ${q.color}35`,
                    fontSize: '0.675rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Target size={12} color={q.color} />
                  <span>{q.action}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* X-Axis Label: 360 Evaluated Performance Scoreboard */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.825rem' }}>
          <Award size={16} />
          <span>X-AXIS: 360-DEGREE EVALUATED PERFORMANCE SCOREBOARD (LOW &lt; 3.6 → SOLID 3.6-4.1 → HIGH ≥ 4.2)</span>
        </div>
      </div>

      {/* Hovered / Inspected Talent 3D Snapshot */}
      {hoveredEmp && (
        <div
          className="glastic-card"
          style={{
            padding: '1.25rem 1.5rem',
            background: 'var(--bg-card)',
            border: `1.5px solid ${hoveredEmp.quadrantColor}`,
            boxShadow: `0 15px 35px rgba(0,0,0,0.15), 0 0 25px ${hoveredEmp.quadrantColor}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img
              src={hoveredEmp.avatarUrl}
              alt={hoveredEmp.employeeName}
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${hoveredEmp.quadrantColor}` }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {hoveredEmp.employeeName}
                </h4>
                <span
                  style={{
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    background: `${hoveredEmp.quadrantColor}25`,
                    color: hoveredEmp.quadrantColor,
                    border: `1px solid ${hoveredEmp.quadrantColor}50`,
                  }}
                >
                  {hoveredEmp.quadrantLabel}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {hoveredEmp.designation} · {hoveredEmp.department}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Performance</div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: hoveredEmp.quadrantColor }}>
                {hoveredEmp.performanceScore} / 5.0
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Potential</div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--primary)' }}>
                {hoveredEmp.potentialScore} / 5.0
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Top Core Superpower</div>
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {hoveredEmp.topStrength}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
