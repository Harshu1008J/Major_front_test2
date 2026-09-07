import React from 'react';

type BadgeVariant = 'teal' | 'navy' | 'brick' | 'warning' | 'info' | 'neutral' | 'ghost';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

const variantMap: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
  teal:    { bg: 'var(--color-teal-bg)',   color: 'var(--color-teal-dim)',  border: 'var(--color-teal)' },
  navy:    { bg: 'var(--color-navy)',       color: '#fff',                    border: 'var(--color-navy-border)' },
  brick:   { bg: 'var(--color-brick-bg)',  color: 'var(--color-brick)',     border: 'var(--color-brick)' },
  warning: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)',  border: 'var(--color-warning)' },
  info:    { bg: 'var(--color-info-bg)',   color: 'var(--color-info)',      border: 'var(--color-info)' },
  neutral: { bg: 'var(--color-bg)',        color: 'var(--color-text-secondary)', border: 'var(--color-border)' },
  ghost:   { bg: 'transparent',            color: 'var(--color-text-muted)', border: 'transparent' },
};

const sizeMap: Record<BadgeSize, { padding: string; fontSize: string; borderRadius: string }> = {
  sm: { padding: '2px 8px',  fontSize: '11px', borderRadius: 'var(--radius-full)' },
  md: { padding: '4px 12px', fontSize: '13px', borderRadius: 'var(--radius-full)' },
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', size = 'md', icon, style }) => {
  const v = variantMap[variant];
  const s = sizeMap[size];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontWeight: 600,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        border: `1px solid ${v.border}`,
        background: v.bg,
        color: v.color,
        ...s,
        ...style,
      }}
    >
      {icon}
      {children}
    </span>
  );
};
