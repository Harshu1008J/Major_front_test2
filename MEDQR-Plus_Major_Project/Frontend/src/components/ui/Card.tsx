import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap = {
  none: '0',
  sm: '16px',
  md: '24px',
  lg: '32px',
};

export const Card: React.FC<CardProps> = ({
  children,
  className,
  style,
  onClick,
  hoverable,
  padding = 'md',
}) => (
  <div
    className={className}
    onClick={onClick}
    style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-sm)',
      padding: paddingMap[padding],
      transition: 'all var(--transition-base)',
      cursor: onClick ? 'pointer' : undefined,
      ...(hoverable && {
        cursor: 'pointer',
      }),
      ...style,
    }}
    onMouseEnter={e => {
      if (hoverable || onClick) {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      }
    }}
    onMouseLeave={e => {
      if (hoverable || onClick) {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
        (e.currentTarget as HTMLElement).style.transform = '';
      }
    }}
  >
    {children}
  </div>
);
