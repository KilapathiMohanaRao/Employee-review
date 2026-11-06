import React, { useState } from 'react';

export const RadarChart = ({ data = [] }) => {
  const [activeSeries, setActiveSeries] = useState({ self: true, manager: true, others: true, benchmark: true });
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="glastic-card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No radar metrics available
      </div>
    );
  }

  const size = 520;
  const center = size / 2;
  const radius = center - 85;
  const totalAxes = data.length;
  const angleSlice = (Math.PI * 2) / totalAxes;

  // Grid levels (1 to 5)
  const levels = [1, 2, 3, 4, 5];

  const getCoordinates = (index, value) => {
    const angle = index * angleSlice - Math.PI / 2;
    const r = (value / 5) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const buildPolygonPoints = (key) => {
    return data
      .map((item, index) => {
        const val = item[key] !== null && item[key] !== undefined ? Number(item[key]) : 0;
        const coords = getCoordinates(index, val);
        return `${coords.x},${coords.y}`;
      })
      .join(' ');
  };

  const hoveredItem = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'relative' }}>
      {/* Legend & 3D Glass Series Toggles */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', fontSize: '0.8rem', fontWeight: 700 }}>
        <button
          onClick={() => setActiveSeries((s) => ({ ...s, self: !s.self }))}
          className="btn"
          style={{
            padding: '0.35rem 0.75rem',
            borderRadius: '20px',
            background: activeSeries.self ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-tertiary)',
            border: activeSeries.self ? '1px solid #3b82f6' : '1px solid var(--border-color)',
            color: activeSeries.self ? '#3b82f6' : 'var(--text-muted)',
            boxShadow: activeSeries.self ? '0 0 10px rgba(59, 130, 246, 0.3)' : 'none',
          }}
        >
          <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#3b82f6' }} />
          <span>Self Assessment</span>
        </button>

        <button
          onClick={() => setActiveSeries((s) => ({ ...s, manager: !s.manager }))}
          className="btn"
          style={{
            padding: '0.35rem 0.75rem',
            borderRadius: '20px',
            background: activeSeries.manager ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-tertiary)',
            border: activeSeries.manager ? '1px solid #10b981' : '1px solid var(--border-color)',
            color: activeSeries.manager ? '#10b981' : 'var(--text-muted)',
            boxShadow: activeSeries.manager ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none',
          }}
        >
          <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#10b981' }} />
          <span>Manager Rating</span>
        </button>

        <button
          onClick={() => setActiveSeries((s) => ({ ...s, others: !s.others }))}
          className="btn"
          style={{
            padding: '0.35rem 0.75rem',
            borderRadius: '20px',
            background: activeSeries.others ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-tertiary)',
            border: activeSeries.others ? '1px solid #f59e0b' : '1px solid var(--border-color)',
            color: activeSeries.others ? '#f59e0b' : 'var(--text-muted)',
            boxShadow: activeSeries.others ? '0 0 10px rgba(245, 158, 11, 0.3)' : 'none',
          }}
        >
          <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#f59e0b' }} />
          <span>Multi-Rater Others</span>
        </button>

        <button
          onClick={() => setActiveSeries((s) => ({ ...s, benchmark: !s.benchmark }))}
          className="btn"
          style={{
            padding: '0.35rem 0.75rem',
            borderRadius: '20px',
            background: activeSeries.benchmark ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-tertiary)',
            border: activeSeries.benchmark ? '1px dashed #8b5cf6' : '1px solid var(--border-color)',
            color: activeSeries.benchmark ? '#8b5cf6' : 'var(--text-muted)',
            boxShadow: activeSeries.benchmark ? '0 0 10px rgba(139, 92, 246, 0.3)' : 'none',
          }}
        >
          <span style={{ width: '10px', height: '10px', borderRadius: '3px', border: '2px dashed #8b5cf6' }} />
          <span>Benchmark Standard (4.0)</span>
        </button>
      </div>

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ maxWidth: '100%', overflow: 'visible' }}>
        <defs>
          <filter id="radar-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id="center-radial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Center Glow */}
        <circle cx={center} cy={center} r={radius} fill="url(#center-radial)" />

        {/* Background Concentric Circles */}
        {levels.map((lvl) => {
          const r = (lvl / 5) * radius;
          return (
            <g key={lvl}>
              <circle
                cx={center}
                cy={center}
                r={r}
                fill={lvl % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'none'}
                stroke="var(--border-color)"
                strokeDasharray={lvl === 5 ? 'none' : '4,4'}
                strokeWidth={lvl === 5 ? 1.5 : 1}
              />
              <text
                x={center + 6}
                y={center - r + 12}
                fill="var(--text-muted)"
                fontSize="10"
                fontWeight="700"
              >
                {lvl}.0
              </text>
            </g>
          );
        })}

        {/* Radial Axis Spokes & Competency Labels */}
        {data.map((item, index) => {
          const angle = index * angleSlice - Math.PI / 2;
          const spokeCoords = getCoordinates(index, 5);
          const labelCoords = {
            x: center + (radius + 28) * Math.cos(angle),
            y: center + (radius + 22) * Math.sin(angle),
          };

          const isHovered = hoveredIndex === index;

          return (
            <g key={index} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
              <line
                x1={center}
                y1={center}
                x2={spokeCoords.x}
                y2={spokeCoords.y}
                stroke={isHovered ? 'var(--primary)' : 'var(--border-color)'}
                strokeWidth={isHovered ? 2.5 : 1}
                strokeDasharray={isHovered ? 'none' : '2,2'}
                style={{ transition: 'all 0.2s' }}
              />
              <text
                x={labelCoords.x}
                y={labelCoords.y}
                textAnchor={labelCoords.x > center + 15 ? 'start' : labelCoords.x < center - 15 ? 'end' : 'middle'}
                dominantBaseline="central"
                fill={isHovered ? 'var(--primary)' : 'var(--text-secondary)'}
                fontSize="11"
                fontWeight={isHovered ? 800 : 600}
                style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
              >
                {item.code || item.competency.substring(0, 14)}
              </text>
            </g>
          );
        })}

        {/* Benchmark Dashed Polygon */}
        {activeSeries.benchmark && (
          <polygon
            points={buildPolygonPoints('benchmark')}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.8"
          />
        )}

        {/* Self Assessment Polygon */}
        {activeSeries.self && (
          <polygon
            points={buildPolygonPoints('selfScore')}
            fill="rgba(59, 130, 246, 0.22)"
            stroke="#3b82f6"
            strokeWidth="2.5"
            filter="url(#radar-glow)"
          />
        )}

        {/* Manager Assessment Polygon */}
        {activeSeries.manager && (
          <polygon
            points={buildPolygonPoints('managerScore')}
            fill="rgba(16, 185, 129, 0.22)"
            stroke="#10b981"
            strokeWidth="2.5"
            filter="url(#radar-glow)"
          />
        )}

        {/* Others Average Polygon */}
        {activeSeries.others && (
          <polygon
            points={buildPolygonPoints('othersScore')}
            fill="rgba(245, 158, 11, 0.25)"
            stroke="#f59e0b"
            strokeWidth="2.5"
            filter="url(#radar-glow)"
          />
        )}

        {/* Data Points and Nodes */}
        {data.map((item, index) => {
          const isHovered = hoveredIndex === index;
          const pSelf = getCoordinates(index, Number(item.selfScore) || 0);
          const pMgr = getCoordinates(index, Number(item.managerScore) || 0);
          const pOthers = getCoordinates(index, Number(item.othersScore) || 0);

          return (
            <g key={`points-${index}`} style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredIndex(index)}>
              {activeSeries.self && (
                <circle
                  cx={pSelf.x}
                  cy={pSelf.y}
                  r={isHovered ? 6 : 4}
                  fill="#3b82f6"
                  stroke="#ffffff"
                  strokeWidth="2"
                  boxShadow="0 0 10px #3b82f6"
                />
              )}
              {activeSeries.manager && (
                <circle
                  cx={pMgr.x}
                  cy={pMgr.y}
                  r={isHovered ? 6 : 4}
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              )}
              {activeSeries.others && (
                <circle
                  cx={pOthers.x}
                  cy={pOthers.y}
                  r={isHovered ? 6 : 4}
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Interactive Tooltip Card for Hovered Axis */}
      {hoveredItem && (
        <div
          className="glastic-card"
          style={{
            position: 'absolute',
            bottom: '10px',
            padding: '0.75rem 1.25rem',
            background: 'var(--bg-card)',
            border: '1.5px solid var(--primary)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            zIndex: 20,
          }}
        >
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
              {hoveredItem.code}
            </div>
            <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              {hoveredItem.competency}
            </strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Self: </span>
              <strong style={{ color: '#3b82f6' }}>{Number(hoveredItem.selfScore).toFixed(1)}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Manager: </span>
              <strong style={{ color: '#10b981' }}>{Number(hoveredItem.managerScore).toFixed(1)}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Others: </span>
              <strong style={{ color: '#f59e0b' }}>{Number(hoveredItem.othersScore).toFixed(1)}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Benchmark: </span>
              <strong style={{ color: '#8b5cf6' }}>4.0</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
