import React from 'react';
import { TrendingUp, TrendingDown } from './Icons';

export const KpiCard = ({ title, value, subtitle, icon, trend, trendValue, color = 'var(--primary)' }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {title}
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            {value}
          </div>
        </div>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: `rgba(37,99,235,0.08)`,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {icon}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.775rem' }}>
        {trend && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.2rem',
            fontWeight: 700,
            color: trend === 'up' ? 'var(--success)' : 'var(--danger)',
          }}>
            {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trendValue}
          </span>
        )}
        <span style={{ color: 'var(--text-muted)' }}>{subtitle}</span>
      </div>
    </div>
  );
};
