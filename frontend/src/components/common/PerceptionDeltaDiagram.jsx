import React, { useState } from 'react';
import { AlertTriangle, Sparkles, CheckCircle2, TrendingUp, Target, ArrowRight } from './Icons';

export const PerceptionDeltaDiagram = ({ scoreboardData, selectedEmpName }) => {
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'BLIND_SPOTS' | 'HIDDEN_STRENGTHS' | 'ALIGNED'
  const [hoveredComp, setHoveredComp] = useState(null);

  const scorecards = scoreboardData?.competencyScorecards || [];

  if (!scorecards || scorecards.length === 0) {
    return (
      <div className="glastic-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
        <Target size={36} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
        <h4 style={{ fontWeight: 800 }}>Analyzing Perception Alignment</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Calibrating self-assessment vs multi-rater aggregate gap...
        </p>
      </div>
    );
  }

  // Categorize competencies into 4 diagnostic alignment zones
  const blindSpots = scorecards.filter((s) => Number(s.gapScore) >= 0.5);
  const hiddenStrengths = scorecards.filter((s) => Number(s.gapScore) <= -0.5);
  const alignedStrengths = scorecards.filter(
    (s) => Math.abs(Number(s.gapScore)) < 0.5 && Number(s.othersAverage) >= 4.0
  );
  const growthPriorities = scorecards.filter(
    (s) => Math.abs(Number(s.gapScore)) < 0.5 && Number(s.othersAverage) < 4.0
  );

  const filteredList =
    activeTab === 'BLIND_SPOTS'
      ? blindSpots
      : activeTab === 'HIDDEN_STRENGTHS'
      ? hiddenStrengths
      : activeTab === 'ALIGNED'
      ? alignedStrengths
      : scorecards;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Perception Delta Overview KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {/* Blind Spots Card */}
        <div
          onClick={() => setActiveTab(activeTab === 'BLIND_SPOTS' ? 'ALL' : 'BLIND_SPOTS')}
          className="glastic-card"
          style={{
            padding: '1.25rem',
            border: activeTab === 'BLIND_SPOTS' ? '2px solid #f59e0b' : '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: '0 8px 20px rgba(245, 158, 11, 0.15)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>
              Potential Blind Spots
            </span>
            <AlertTriangle size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f59e0b', marginTop: '0.5rem' }}>
            {blindSpots.length}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Self rating is &ge; 0.5 higher than team consensus.
          </p>
        </div>

        {/* Hidden Strengths Card */}
        <div
          onClick={() => setActiveTab(activeTab === 'HIDDEN_STRENGTHS' ? 'ALL' : 'HIDDEN_STRENGTHS')}
          className="glastic-card"
          style={{
            padding: '1.25rem',
            border: activeTab === 'HIDDEN_STRENGTHS' ? '2px solid #8b5cf6' : '1px solid rgba(139, 92, 246, 0.3)',
            boxShadow: '0 8px 20px rgba(139, 92, 246, 0.15)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase' }}>
              Hidden Strengths
            </span>
            <Sparkles size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#8b5cf6', marginTop: '0.5rem' }}>
            {hiddenStrengths.length}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Team consensus rates &ge; 0.5 higher than self rating.
          </p>
        </div>

        {/* Aligned Strengths Card */}
        <div
          onClick={() => setActiveTab(activeTab === 'ALIGNED' ? 'ALL' : 'ALIGNED')}
          className="glastic-card"
          style={{
            padding: '1.25rem',
            border: activeTab === 'ALIGNED' ? '2px solid #10b981' : '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.15)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>
              Harmonious Strengths
            </span>
            <CheckCircle2 size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#10b981', marginTop: '0.5rem' }}>
            {alignedStrengths.length}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            High performance (&ge; 4.0) with mutual perception agreement.
          </p>
        </div>

        {/* Growth Priorities Card */}
        <div
          className="glastic-card"
          style={{
            padding: '1.25rem',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 8px 20px rgba(59, 130, 246, 0.15)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase' }}>
              Shared Growth Targets
            </span>
            <TrendingUp size={18} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#3b82f6', marginTop: '0.5rem' }}>
            {growthPriorities.length}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Agreed focus areas for development and coaching.
          </p>
        </div>
      </div>

      {/* Divergent Delta Bar Chart Stage */}
      <div className="glastic-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Perception Divergence Diagram (Self vs Multi-Rater Consensus Delta)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Gap = (Self Score - Others Average). Positive indicates overestimation; negative indicates hidden strength.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['ALL', 'BLIND_SPOTS', 'HIDDEN_STRENGTHS', 'ALIGNED'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className="btn"
                style={{
                  fontSize: '0.725rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  background: activeTab === t ? 'var(--primary)' : 'var(--bg-tertiary)',
                  color: activeTab === t ? '#ffffff' : 'var(--text-secondary)',
                  border: activeTab === t ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  fontWeight: 700,
                }}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* The Delta Bars List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredList.map((item, idx) => {
            const gap = Number(item.gapScore) || 0;
            const self = Number(item.selfScore) || 4.0;
            const others = Number(item.othersAverage) || 4.0;

            // Normalize gap to percentage (-1.5 to +1.5 range, mapped to 50% center)
            const clampedGap = Math.max(-1.5, Math.min(1.5, gap));
            const barWidthPercent = (Math.abs(clampedGap) / 1.5) * 45; // max 45% on either side
            const isPositive = gap >= 0;

            const isBlindSpot = gap >= 0.5;
            const isHiddenStrength = gap <= -0.5;

            const barColor = isBlindSpot
              ? 'linear-gradient(90deg, #f59e0b, #d97706)'
              : isHiddenStrength
              ? 'linear-gradient(90deg, #8b5cf6, #6d28d9)'
              : 'linear-gradient(90deg, #10b981, #059669)';

            return (
              <div
                key={item.competencyId || idx}
                onMouseEnter={() => setHoveredComp(item)}
                onMouseLeave={() => setHoveredComp(null)}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {item.competencyName}
                    </strong>
                    {isBlindSpot && (
                      <span className="badge badge-warning" style={{ fontSize: '0.675rem' }}>
                        Blind Spot (+{gap.toFixed(2)})
                      </span>
                    )}
                    {isHiddenStrength && (
                      <span className="badge badge-purple" style={{ fontSize: '0.675rem' }}>
                        Hidden Strength ({gap.toFixed(2)})
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem' }}>
                    <span style={{ color: '#3b82f6', fontWeight: 700 }}>Self: {self.toFixed(2)}</span>
                    <span style={{ color: 'var(--text-muted)' }}>vs</span>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>Others: {others.toFixed(2)}</span>
                    <span
                      style={{
                        padding: '0.15rem 0.45rem',
                        borderRadius: '6px',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        background: isBlindSpot ? '#f59e0b25' : isHiddenStrength ? '#8b5cf625' : '#10b98125',
                        color: isBlindSpot ? '#d97706' : isHiddenStrength ? '#8b5cf6' : '#059669',
                      }}
                    >
                      Gap: {gap > 0 ? `+${gap.toFixed(2)}` : gap.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Divergent Bi-directional Gap Bar Container */}
                <div
                  style={{
                    position: 'relative',
                    height: '14px',
                    width: '100%',
                    background: 'var(--bg-card)',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  {/* Center Zero Line */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: 0,
                      bottom: 0,
                      width: '2px',
                      background: 'var(--border-color)',
                      zIndex: 2,
                    }}
                  />

                  {/* Left Bar (Negative Gap: Hidden Strength) */}
                  {!isPositive && (
                    <div
                      style={{
                        position: 'absolute',
                        right: '50%',
                        top: 0,
                        bottom: 0,
                        width: `${barWidthPercent}%`,
                        background: barColor,
                        borderRadius: '9999px 0 0 9999px',
                        boxShadow: '0 0 8px rgba(139, 92, 246, 0.4)',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  )}

                  {/* Right Bar (Positive Gap: Blind Spot) */}
                  {isPositive && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: 0,
                        bottom: 0,
                        width: `${barWidthPercent}%`,
                        background: barColor,
                        borderRadius: '0 9999px 9999px 0',
                        boxShadow: '0 0 8px rgba(245, 158, 11, 0.4)',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  )}
                </div>

                {/* Footnote Labels for Chart */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.675rem', color: 'var(--text-muted)' }}>
                  <span>&larr; Team Rates Higher (Hidden Superpower)</span>
                  <span>Mutual Consensus (Zero Gap)</span>
                  <span>Self Rates Higher (Calibration Required) &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
