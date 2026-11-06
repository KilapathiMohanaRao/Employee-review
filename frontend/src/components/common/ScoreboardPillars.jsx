import React, { useState } from 'react';
import { Award, Target, TrendingUp, AlertTriangle, CheckCircle2, Star, Sparkles } from './Icons';

export const ScoreboardPillars = ({ scoreboardData, selectedEmpName }) => {
  const [activeSeries, setActiveSeries] = useState('OTHERS'); // 'OTHERS' | 'SELF_MGR' | 'ALL'
  const [hoveredComp, setHoveredComp] = useState(null);

  const scorecards = scoreboardData?.competencyScorecards || [];

  if (!scorecards || scorecards.length === 0) {
    return (
      <div className="glastic-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
        <Award size={36} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
        <h4 style={{ fontWeight: 800 }}>Generating 3D Scoreboard Pillar Analysis</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Consolidating multi-rater evaluation weights...
        </p>
      </div>
    );
  }

  // Find max score for scaling (up to 5.0)
  const maxScore = 5.0;
  const chartHeight = 220; // px

  const getPillarColor = (score) => {
    if (score >= 4.5) return { front: 'linear-gradient(180deg, #10b981 0%, #059669 100%)', cap: '#34d399', glow: 'rgba(16, 185, 129, 0.4)' };
    if (score >= 4.0) return { front: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)', cap: '#60a5fa', glow: 'rgba(59, 130, 246, 0.4)' };
    if (score >= 3.5) return { front: 'linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%)', cap: '#a78bfa', glow: 'rgba(139, 92, 246, 0.4)' };
    if (score >= 3.0) return { front: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)', cap: '#fbbf24', glow: 'rgba(245, 158, 11, 0.4)' };
    return { front: 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)', cap: '#f87171', glow: 'rgba(239, 68, 68, 0.4)' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 3D Pillar Controls Bar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="var(--primary)" />
          <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            11-Competency 3D Glassmorphic Scoreboard Pillars
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ({selectedEmpName || 'Active Subject'})
          </span>
        </div>

        {/* Series Filter Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Pillar Metric:</span>
          <div style={{ background: 'var(--bg-tertiary)', padding: '3px', borderRadius: '8px', display: 'flex', gap: '3px' }}>
            {[
              { id: 'OTHERS', label: 'Multi-Rater Others Avg' },
              { id: 'SELF_MGR', label: 'Self vs Manager' },
              { id: 'ALL', label: 'Full 360 Consensus' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSeries(s.id)}
                style={{
                  border: 'none',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.725rem',
                  fontWeight: 700,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: activeSeries === s.id ? 'var(--bg-card)' : 'transparent',
                  color: activeSeries === s.id ? 'var(--primary)' : 'var(--text-muted)',
                  boxShadow: activeSeries === s.id ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Isometric Glass Pillars Graphic Stage */}
      <div
        className="glastic-card"
        style={{
          padding: '2.5rem 1.5rem 1.5rem',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(240,245,255,0.85) 100%)',
        }}
      >
        {/* Benchmark 4.0 Standard Reference Line */}
        <div
          style={{
            position: 'absolute',
            left: '1.5rem',
            right: '1.5rem',
            bottom: `${(4.0 / maxScore) * chartHeight + 45}px`,
            borderTop: '2px dashed #8b5cf6',
            zIndex: 1,
            pointerEvents: 'none',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <span
            style={{
              transform: 'translateY(-50%)',
              background: '#8b5cf6',
              color: '#ffffff',
              fontSize: '0.65rem',
              fontWeight: 800,
              padding: '0.1rem 0.4rem',
              borderRadius: '4px',
              boxShadow: '0 2px 6px rgba(139, 92, 246, 0.4)',
            }}
          >
            Enterprise Benchmark (4.00)
          </span>
        </div>

        {/* The 11 Pillars Container */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '0.75rem',
            height: `${chartHeight + 40}px`,
            paddingBottom: '20px',
            borderBottom: '2px solid var(--border-color)',
          }}
        >
          {scorecards.map((item, idx) => {
            const score = Number(item.othersAverage) || 4.0;
            const selfScore = Number(item.selfScore) || 4.0;
            const mgrScore = Number(item.managerScore) || 4.0;
            const pillarHeight = Math.max(30, (score / maxScore) * chartHeight);
            const theme = getPillarColor(score);
            const isHovered = hoveredComp && hoveredComp.competencyId === item.competencyId;

            return (
              <div
                key={item.competencyId || idx}
                onMouseEnter={() => setHoveredComp(item)}
                onMouseLeave={() => setHoveredComp(null)}
                className="pillar-isometric"
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  transform: isHovered ? 'scale(1.08) translateY(-6px)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: isHovered ? 10 : 2,
                }}
              >
                {/* 3D Pillar Top Score Badge */}
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    color: isHovered ? 'var(--primary)' : 'var(--text-primary)',
                    marginBottom: '6px',
                    transition: 'all 0.2s',
                  }}
                >
                  {score.toFixed(1)}
                </div>

                {/* 3D Glass Pillar Body */}
                <div
                  style={{
                    width: '100%',
                    maxWidth: '38px',
                    height: `${pillarHeight}px`,
                    position: 'relative',
                    borderRadius: '8px 8px 3px 3px',
                    background: theme.front,
                    boxShadow: isHovered
                      ? `0 12px 28px ${theme.glow}, 0 0 20px ${theme.glow}, inset 0 2px 4px rgba(255,255,255,0.8)`
                      : `0 6px 15px rgba(0,0,0,0.12), inset 0 1px 2px rgba(255,255,255,0.5)`,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Pillar 3D Gloss Sheen Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '40%',
                      height: '100%',
                      background: 'linear-gradient(90deg, rgba(255,255,255,0.4), transparent)',
                      borderRadius: '8px 0 0 3px',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* 3D Specular Top Cap */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      left: '2px',
                      right: '2px',
                      height: '8px',
                      borderRadius: '50%',
                      background: theme.cap,
                      boxShadow: `0 0 10px ${theme.cap}`,
                    }}
                  />

                  {/* Self vs Manager indicator lines inside pillar if active */}
                  {activeSeries === 'SELF_MGR' && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: `${(selfScore / maxScore) * pillarHeight}px`,
                        left: 0,
                        right: 0,
                        borderTop: '2px solid #ffffff',
                        boxShadow: '0 0 5px rgba(255,255,255,0.8)',
                      }}
                      title={`Self Score: ${selfScore.toFixed(1)}`}
                    />
                  )}
                </div>

                {/* Rank Badge at Foot of Pillar */}
                <div
                  style={{
                    marginTop: '8px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : idx === 2 ? '#b45309' : 'var(--bg-tertiary)',
                    color: idx < 3 ? '#ffffff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                  }}
                >
                  #{idx + 1}
                </div>

                {/* Competency Code */}
                <div
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: isHovered ? 'var(--primary)' : 'var(--text-secondary)',
                    marginTop: '4px',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '55px',
                  }}
                  title={item.competencyName}
                >
                  {item.competencyName.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hovered Competency 3D Glass Inspector Snapshot */}
      {hoveredComp && (
        <div
          className="glastic-card"
          style={{
            padding: '1.25rem 1.5rem',
            background: 'var(--bg-card)',
            border: '1.5px solid var(--primary)',
            boxShadow: '0 15px 35px rgba(37, 99, 235, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--primary), #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '1rem',
              }}
            >
              #{hoveredComp.ranking || 1}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge" style={{ fontSize: '0.65rem', background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  {hoveredComp.category || 'CORE'}
                </span>
                <span className="badge" style={{ fontSize: '0.65rem', background: 'var(--success-light)', color: 'var(--success)' }}>
                  {hoveredComp.performanceInsight || 'ON_TRACK'}
                </span>
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                {hoveredComp.competencyName}
              </h4>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Self Rating</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#3b82f6' }}>
                {hoveredComp.selfScore ? Number(hoveredComp.selfScore).toFixed(2) : '—'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Manager Rating</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981' }}>
                {hoveredComp.managerScore ? Number(hoveredComp.managerScore).toFixed(2) : '—'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Others Consensus</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#8b5cf6' }}>
                {hoveredComp.othersAverage ? Number(hoveredComp.othersAverage).toFixed(2) : '—'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Perception Gap</div>
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: Number(hoveredComp.gapScore) >= 0.5 ? 'var(--warning)' : Number(hoveredComp.gapScore) <= -0.5 ? 'var(--purple)' : 'var(--success)',
                }}
              >
                {Number(hoveredComp.gapScore) > 0 ? '+' : ''}
                {Number(hoveredComp.gapScore).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Ranked Scoreboard Table */}
      <div className="glastic-card" style={{ padding: '1.25rem', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={18} color="var(--primary)" />
          <span>Ranked 360-Degree Competency Scoreboard Matrix</span>
        </h3>

        <table className="custom-table" style={{ fontSize: '0.8rem' }}>
          <thead>
            <tr>
              <th style={{ width: '60px', textAlign: 'center' }}>Rank</th>
              <th>Competency &amp; Dimension</th>
              <th>Category</th>
              <th style={{ textAlign: 'center' }}>Self Score</th>
              <th style={{ textAlign: 'center' }}>Manager Score</th>
              <th style={{ textAlign: 'center' }}>Multi-Rater Others</th>
              <th style={{ textAlign: 'center' }}>Perception Gap</th>
              <th style={{ textAlign: 'center' }}>Benchmark Delta</th>
              <th>Status Insight</th>
            </tr>
          </thead>
          <tbody>
            {scorecards.map((item, idx) => {
              const others = Number(item.othersAverage) || 4.0;
              const self = Number(item.selfScore) || 4.0;
              const mgr = Number(item.managerScore) || 4.0;
              const gap = Number(item.gapScore) || 0;
              const bmDelta = others - 4.0;

              return (
                <tr key={item.competencyId || idx} style={{ transition: 'background 0.2s' }}>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        background: idx < 3 ? 'rgba(37, 99, 235, 0.1)' : 'var(--bg-tertiary)',
                        color: idx < 3 ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                      }}
                    >
                      #{idx + 1}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                      {item.competencyName}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Code: {item.competencyCode}
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{ fontSize: '0.675rem', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                      {item.category || 'CORE'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: '#3b82f6' }}>
                    {self.toFixed(2)}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: '#10b981' }}>
                    {mgr.toFixed(2)}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--text-primary)' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        background: others >= 4.2 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(37, 99, 235, 0.1)',
                        color: others >= 4.2 ? '#059669' : 'var(--primary)',
                      }}
                    >
                      {others.toFixed(2)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        color: gap >= 0.5 ? '#d97706' : gap <= -0.5 ? '#8b5cf6' : 'var(--success)',
                      }}
                    >
                      {gap > 0 ? `+${gap.toFixed(2)}` : gap.toFixed(2)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        color: bmDelta >= 0 ? 'var(--success)' : 'var(--danger)',
                      }}
                    >
                      {bmDelta >= 0 ? `+${bmDelta.toFixed(2)}` : bmDelta.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    {item.performanceInsight === 'BLIND_SPOT' && (
                      <span className="badge badge-warning" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <AlertTriangle size={12} />
                        Blind Spot Focus
                      </span>
                    )}
                    {item.performanceInsight === 'HIDDEN_STRENGTH' && (
                      <span className="badge badge-purple" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Sparkles size={12} />
                        Hidden Strength
                      </span>
                    )}
                    {item.performanceInsight === 'ON_TRACK' && (
                      <span className="badge badge-success" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <CheckCircle2 size={12} />
                        Exemplar Mastery
                      </span>
                    )}
                    {item.performanceInsight === 'NEEDS_IMPROVEMENT' && (
                      <span className="badge badge-danger" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <TrendingUp size={12} />
                        Growth Priority
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
