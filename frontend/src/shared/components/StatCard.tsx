import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  accentColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon,
  accentColor = '#6366f1',
}) => {
  return (
    <div
      className="card"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderLeft: `4px solid ${accentColor}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginTop: '6px', letterSpacing: '-0.02em' }}>
            {value}
          </div>
          {subtitle && (
            <div style={{ fontSize: '0.785rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              {subtitle}
            </div>
          )}
        </div>

        {icon && (
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: `rgba(${accentColor === '#6366f1' ? '99, 102, 241' : '16, 185, 129'}, 0.12)`,
              color: accentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {change && (
        <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
          <span
            style={{
              fontWeight: 700,
              color: isPositive ? 'var(--accent-emerald)' : 'var(--accent-rose)',
            }}
          >
            {isPositive ? '↑ ' : '↓ '}
            {change}
          </span>
          <span style={{ color: 'var(--text-dim)' }}>vs previous period</span>
        </div>
      )}
    </div>
  );
};
