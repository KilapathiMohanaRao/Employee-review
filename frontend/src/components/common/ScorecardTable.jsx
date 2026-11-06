import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Award, AlertTriangle, Star } from './Icons';

export const ScorecardTable = ({ scorecards = [] }) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getInsightBadge = (insight) => {
    switch (insight) {
      case 'ROLE_MODEL':
        return <span className="badge badge-success">⭐ Role Model</span>;
      case 'ON_TRACK':
        return <span className="badge badge-primary">✓ On Track</span>;
      case 'BLIND_SPOT':
        return <span className="badge badge-warning">👁️ Blind Spot</span>;
      case 'HIDDEN_STRENGTH':
        return <span className="badge badge-purple">✨ Hidden Strength</span>;
      case 'NEEDS_IMPROVEMENT':
        return <span className="badge badge-danger">⚠️ Needs Focus</span>;
      default:
        return <span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>Pending</span>;
    }
  };

  const formatScore = (val) => {
    if (val === null || val === undefined) return '—';
    return Number(val).toFixed(2);
  };

  const getGapColor = (gap) => {
    if (gap === null || gap === undefined) return 'inherit';
    const num = Number(gap);
    if (num >= 0.5) return 'var(--warning)'; // Blind spot
    if (num <= -0.5) return 'var(--purple)'; // Hidden strength
    if (num > 0) return 'var(--text-secondary)';
    return 'var(--success)';
  };

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th style={{ width: '40px', textAlign: 'center' }}>Rank</th>
            <th>Competency</th>
            <th style={{ textAlign: 'center' }}>Items</th>
            <th style={{ textAlign: 'center', background: 'rgba(37,99,235,0.06)' }}>Self</th>
            <th style={{ textAlign: 'center' }}>Manager</th>
            <th style={{ textAlign: 'center' }}>Peer</th>
            <th style={{ textAlign: 'center' }}>Direct Rep.</th>
            <th style={{ textAlign: 'center' }}>Cross-Func.</th>
            <th style={{ textAlign: 'center', fontWeight: 800, background: 'rgba(16,185,129,0.08)' }}>Others Avg</th>
            <th style={{ textAlign: 'center' }}>Gap</th>
            <th style={{ textAlign: 'center' }}>Performance Insight</th>
          </tr>
        </thead>
        <tbody>
          {scorecards.map((row) => {
            const isExpanded = expandedId === row.competencyId;
            return (
              <React.Fragment key={row.competencyId}>
                <tr
                  onClick={() => toggleExpand(row.competencyId)}
                  style={{ cursor: 'pointer', transition: 'background 0.15s ease' }}
                >
                  <td style={{ textAlign: 'center', fontWeight: 800 }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: row.ranking <= 3 ? 'var(--primary-light)' : 'var(--bg-tertiary)',
                      color: row.ranking <= 3 ? 'var(--primary)' : 'var(--text-secondary)',
                      fontSize: '0.8rem'
                    }}>
                      {row.ranking || '—'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {isExpanded ? <ChevronDown size={14} color="var(--primary)" /> : <ChevronRight size={14} color="var(--text-muted)" />}
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.competencyName}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{row.category}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{row.itemCount}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700, background: 'rgba(37,99,235,0.03)' }}>
                    {formatScore(row.selfScore)}
                  </td>
                  <td style={{ textAlign: 'center' }}>{formatScore(row.managerScore)}</td>
                  <td style={{ textAlign: 'center' }}>{formatScore(row.peerScore)}</td>
                  <td style={{ textAlign: 'center' }}>{formatScore(row.directReportScore)}</td>
                  <td style={{ textAlign: 'center' }}>{formatScore(row.crossFunctionalScore)}</td>
                  <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--success)', background: 'rgba(16,185,129,0.05)', fontSize: '0.95rem' }}>
                    {formatScore(row.othersAverage)}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: getGapColor(row.gapScore) }}>
                    {row.gapScore !== null ? (row.gapScore > 0 ? `+${formatScore(row.gapScore)}` : formatScore(row.gapScore)) : '—'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {getInsightBadge(row.performanceInsight)}
                  </td>
                </tr>

                {isExpanded && (
                  <tr style={{ background: 'var(--bg-tertiary)' }}>
                    <td colSpan="11" style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                          Behavioural Competency Details:
                        </div>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                          Standard 5-point rating calculation across all multi-rater feedback sources (Self, Manager, Peer, Direct Report, Cross-Functional).
                        </div>
                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.8rem' }}>
                          <div><strong>Manager Score:</strong> {formatScore(row.managerScore)} / 5.0</div>
                          <div><strong>Colleagues Aggregate:</strong> {formatScore(row.othersAverage)} / 5.0</div>
                          <div><strong>Gap Direction:</strong> {row.gapScore >= 0 ? 'Self-rating higher' : 'Colleagues rated higher'}</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
