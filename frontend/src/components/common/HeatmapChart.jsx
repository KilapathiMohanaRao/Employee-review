import React, { useState, useMemo } from 'react';
import { Filter, Layers, CheckCircle2, AlertCircle, Info, Sparkles } from './Icons';

export const HeatmapChart = ({ heatmapData = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState('SCORE'); // 'SCORE' | 'VARIANCE' | 'GRADE'
  const [activeCell, setActiveCell] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);

  // Extract unique departments and competencies
  const departments = useMemo(() => {
    if (!heatmapData || heatmapData.length === 0) return [];
    return Array.from(new Set(heatmapData.map((d) => d.department)));
  }, [heatmapData]);

  const competencies = useMemo(() => {
    if (!heatmapData || heatmapData.length === 0) return [];
    return Array.from(new Set(heatmapData.map((d) => d.competency)));
  }, [heatmapData]);

  // Map competency to category
  const getCompetencyCategory = (compName) => {
    const lower = compName.toLowerCase();
    if (lower.includes('lead') || lower.includes('people') || lower.includes('team') || lower.includes('culture')) {
      return 'LEADERSHIP';
    }
    if (lower.includes('strategy') || lower.includes('stake') || lower.includes('cross') || lower.includes('comm')) {
      return 'STRATEGIC';
    }
    if (lower.includes('tech') || lower.includes('qual') || lower.includes('ops') || lower.includes('delivery')) {
      return 'TECHNICAL_EXECUTION';
    }
    return 'BEHAVIOURAL';
  };

  const filteredCompetencies = useMemo(() => {
    if (selectedCategory === 'ALL') return competencies;
    return competencies.filter((c) => getCompetencyCategory(c) === selectedCategory);
  }, [competencies, selectedCategory]);

  const getCellData = (dept, comp) => {
    const item = heatmapData.find((d) => d.department === dept && d.competency === comp);
    return item ? { score: Number(item.averageScore), sampleSize: item.sampleSize || 10 } : null;
  };

  // Color mapping based on score
  const getCellTheme = (score) => {
    if (score === null || score === undefined || isNaN(score)) {
      return {
        bg: 'rgba(148, 163, 184, 0.15)',
        border: 'rgba(148, 163, 184, 0.3)',
        text: 'var(--text-muted)',
        glow: 'rgba(148, 163, 184, 0.2)',
        tier: 'No Data',
        grade: '—',
      };
    }
    if (score >= 4.6) {
      return {
        bg: 'linear-gradient(135deg, rgba(5, 150, 105, 0.85), rgba(16, 185, 129, 0.95))',
        border: 'rgba(52, 211, 153, 0.6)',
        text: '#ffffff',
        glow: 'rgba(16, 185, 129, 0.45)',
        tier: 'Benchmark Exemplar',
        grade: 'A+',
      };
    }
    if (score >= 4.2) {
      return {
        bg: 'linear-gradient(135deg, rgba(13, 148, 136, 0.82), rgba(20, 184, 166, 0.92))',
        border: 'rgba(45, 212, 191, 0.6)',
        text: '#ffffff',
        glow: 'rgba(20, 184, 166, 0.4)',
        tier: 'Role Model',
        grade: 'A',
      };
    }
    if (score >= 3.9) {
      return {
        bg: 'linear-gradient(135deg, rgba(37, 99, 235, 0.82), rgba(59, 130, 246, 0.92))',
        border: 'rgba(96, 165, 250, 0.6)',
        text: '#ffffff',
        glow: 'rgba(59, 130, 246, 0.4)',
        tier: 'Strong / Effective',
        grade: 'B+',
      };
    }
    if (score >= 3.5) {
      return {
        bg: 'linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(129, 140, 248, 0.9))',
        border: 'rgba(165, 180, 252, 0.5)',
        text: '#ffffff',
        glow: 'rgba(99, 102, 241, 0.35)',
        tier: 'Competent Contributor',
        grade: 'B',
      };
    }
    if (score >= 3.0) {
      return {
        bg: 'linear-gradient(135deg, rgba(217, 119, 6, 0.82), rgba(245, 158, 11, 0.92))',
        border: 'rgba(251, 191, 36, 0.6)',
        text: '#ffffff',
        glow: 'rgba(245, 158, 11, 0.4)',
        tier: 'Development Focus',
        grade: 'C',
      };
    }
    return {
      bg: 'linear-gradient(135deg, rgba(220, 38, 38, 0.85), rgba(239, 68, 68, 0.95))',
      border: 'rgba(248, 113, 113, 0.6)',
      text: '#ffffff',
      glow: 'rgba(239, 68, 68, 0.45)',
      tier: 'Critical Priority Gap',
      grade: 'D',
    };
  };

  // Calculate department averages
  const deptAverages = useMemo(() => {
    const map = {};
    departments.forEach((dept) => {
      let sum = 0;
      let count = 0;
      filteredCompetencies.forEach((comp) => {
        const item = getCellData(dept, comp);
        if (item && item.score > 0) {
          sum += item.score;
          count++;
        }
      });
      map[dept] = count > 0 ? (sum / count).toFixed(2) : '—';
    });
    return map;
  }, [departments, filteredCompetencies, heatmapData]);

  // Calculate competency averages
  const compAverages = useMemo(() => {
    const map = {};
    filteredCompetencies.forEach((comp) => {
      let sum = 0;
      let count = 0;
      departments.forEach((dept) => {
        const item = getCellData(dept, comp);
        if (item && item.score > 0) {
          sum += item.score;
          count++;
        }
      });
      map[comp] = count > 0 ? (sum / count).toFixed(2) : '—';
    });
    return map;
  }, [departments, filteredCompetencies, heatmapData]);

  if (!heatmapData || heatmapData.length === 0) {
    return (
      <div className="glastic-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <Info size={36} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
        <h4 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Loading Organizational Heatmap Matrix</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Calibrating cross-department competency benchmarks...
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Heatmap Controls Bar */}
      <div
        className="glastic-card"
        style={{
          padding: '0.85rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Category Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Filter Category:
          </span>
          {[
            { id: 'ALL', label: 'All 11 Competencies' },
            { id: 'LEADERSHIP', label: 'Leadership & Culture' },
            { id: 'STRATEGIC', label: 'Strategic & Influence' },
            { id: 'TECHNICAL_EXECUTION', label: 'Tech & Delivery' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="btn"
              style={{
                fontSize: '0.75rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '20px',
                background: selectedCategory === cat.id ? 'var(--primary)' : 'var(--bg-tertiary)',
                color: selectedCategory === cat.id ? '#ffffff' : 'var(--text-secondary)',
                border: selectedCategory === cat.id ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                fontWeight: 600,
                boxShadow: selectedCategory === cat.id ? '0 0 12px rgba(37, 99, 235, 0.4)' : 'none',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Display:</span>
          <div style={{ background: 'var(--bg-tertiary)', padding: '3px', borderRadius: '8px', display: 'flex', gap: '3px' }}>
            {[
              { id: 'SCORE', label: 'Rating (1-5)' },
              { id: 'VARIANCE', label: 'Variance vs 4.0' },
              { id: 'GRADE', label: 'Tier Grade' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setViewMode(m.id)}
                style={{
                  border: 'none',
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.725rem',
                  fontWeight: 700,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: viewMode === m.id ? 'var(--bg-card)' : 'transparent',
                  color: viewMode === m.id ? 'var(--primary)' : 'var(--text-muted)',
                  boxShadow: viewMode === m.id ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Glassmorphic 3D Heatmap Matrix Table */}
      <div className="glastic-card" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '6px' }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  minWidth: '200px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                }}
              >
                Organizational Unit
              </th>
              {filteredCompetencies.map((comp) => (
                <th
                  key={comp}
                  style={{
                    textAlign: 'center',
                    padding: '0.65rem 0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    minWidth: '95px',
                    maxWidth: '120px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                  }}
                  title={comp}
                >
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {comp.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 500, color: 'var(--text-muted)', marginTop: '2px' }}>
                    Avg: {compAverages[comp]}
                  </div>
                </th>
              ))}
              <th
                style={{
                  textAlign: 'center',
                  padding: '0.65rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  minWidth: '90px',
                  background: 'rgba(37, 99, 235, 0.08)',
                  borderRadius: '8px',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                }}
              >
                Dept Mean
              </th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept}>
                <td
                  style={{
                    padding: '0.75rem 1rem',
                    fontWeight: 700,
                    fontSize: '0.825rem',
                    color: 'var(--text-primary)',
                    background: 'var(--bg-card)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
                    {dept}
                  </div>
                </td>
                {filteredCompetencies.map((comp) => {
                  const data = getCellData(dept, comp);
                  const score = data ? data.score : null;
                  const theme = getCellTheme(score);
                  const isHovered = hoveredCell && hoveredCell.dept === dept && hoveredCell.comp === comp;

                  let displayText = '—';
                  if (score !== null && score > 0) {
                    if (viewMode === 'SCORE') {
                      displayText = score.toFixed(1);
                    } else if (viewMode === 'VARIANCE') {
                      const diff = score - 4.0;
                      displayText = diff >= 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
                    } else if (viewMode === 'GRADE') {
                      displayText = theme.grade;
                    }
                  }

                  return (
                    <td
                      key={comp}
                      onClick={() => setActiveCell({ dept, comp, score, theme, sampleSize: data?.sampleSize })}
                      onMouseEnter={() => setHoveredCell({ dept, comp, score, theme, sampleSize: data?.sampleSize })}
                      onMouseLeave={() => setHoveredCell(null)}
                      className="glastic-cell"
                      style={{
                        padding: '0.6rem 0.4rem',
                        textAlign: 'center',
                        color: theme.text,
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        background: theme.bg,
                        border: `1px solid ${theme.border}`,
                        boxShadow: isHovered
                          ? `0 8px 25px ${theme.glow}, 0 0 15px ${theme.glow}, inset 0 2px 4px rgba(255,255,255,0.7)`
                          : `0 2px 8px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.4)`,
                        cursor: 'pointer',
                        transform: isHovered ? 'scale(1.12) translateZ(8px)' : 'none',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      title={`${dept} - ${comp}: ${score ? score.toFixed(2) : 'N/A'}`}
                    >
                      <div>{displayText}</div>
                    </td>
                  );
                })}
                <td
                  style={{
                    padding: '0.6rem 0.5rem',
                    textAlign: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    color: 'var(--primary)',
                    background: 'rgba(37, 99, 235, 0.08)',
                    borderRadius: '8px',
                    border: '1px solid rgba(37, 99, 235, 0.25)',
                  }}
                >
                  {deptAverages[dept]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Floating 3D Inspector Popover (Active or Hovered Cell) */}
      {(hoveredCell || activeCell) && (
        <div
          className="glastic-card"
          style={{
            padding: '1.25rem 1.5rem',
            border: `1.5px solid ${(hoveredCell || activeCell).theme.border}`,
            background: 'var(--bg-card)',
            boxShadow: `0 15px 35px -5px rgba(0,0,0,0.15), 0 0 25px ${(hoveredCell || activeCell).theme.glow}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: (hoveredCell || activeCell).theme.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '1.25rem',
                boxShadow: `0 6px 16px ${(hoveredCell || activeCell).theme.glow}`,
              }}
            >
              {(hoveredCell || activeCell).score ? (hoveredCell || activeCell).score.toFixed(1) : '—'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                  {(hoveredCell || activeCell).dept}
                </span>
                <span className="badge" style={{ fontSize: '0.7rem', background: (hoveredCell || activeCell).theme.glow, color: 'var(--text-primary)' }}>
                  {(hoveredCell || activeCell).theme.tier}
                </span>
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                {(hoveredCell || activeCell).comp}
              </h4>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Company Target</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>4.00 / 5.0</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Target Variance</div>
              <div
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: (hoveredCell || activeCell).score >= 4.0 ? 'var(--success)' : 'var(--danger)',
                }}
              >
                {(hoveredCell || activeCell).score >= 4.0 ? '+' : ''}
                {((hoveredCell || activeCell).score - 4.0).toFixed(2)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Sample Pool</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {(hoveredCell || activeCell).sampleSize || 12} Evaluators
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Heatmap Legend & Tier Breakdown */}
      <div
        className="glastic-card"
        style={{
          padding: '0.85rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}
      >
        <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Proficiency Spectrum:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'linear-gradient(135deg, #059669, #10b981)' }} />
            <span>Benchmark Exemplar (4.6 - 5.0)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'linear-gradient(135deg, #0d9488, #14b8a6)' }} />
            <span>Role Model (4.2 - 4.5)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'linear-gradient(135deg, #2563eb, #3b82f6)' }} />
            <span>Strong / Effective (3.9 - 4.1)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'linear-gradient(135deg, #6366f1, #818cf8)' }} />
            <span>Competent (3.5 - 3.8)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'linear-gradient(135deg, #d97706, #f59e0b)' }} />
            <span>Development Focus (3.0 - 3.4)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'linear-gradient(135deg, #dc2626, #ef4444)' }} />
            <span>Priority Gap (&lt; 3.0)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
