import React from 'react';

type Variant = 'primary' | 'secondary' | 'teal' | 'ghost' | 'danger' | 'outline' | 'brick' | 'navy';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: 'var(--color-navy-light)',
    color: '#fff',
    border: '1px solid var(--color-navy-border)',
  },
  secondary: {
    background: 'var(--color-surface)',
    color: 'var(--color-navy)',
    border: '1px solid var(--color-border)',
  },
  teal: {
    background: 'var(--color-teal)',
    color: '#fff',
    border: 'none',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-text-secondary)',
    border: 'none',
  },
  danger: {
    background: 'var(--color-brick)',
    color: '#fff',
    border: 'none',
  },
  outline: {
    background: 'transparent',
    color: 'var(--color-teal)',
    border: '1.5px solid var(--color-teal)',
  },
  brick: {
    background: 'var(--color-brick)',
    color: '#fff',
    border: 'none',
  },
  navy: {
    background: 'var(--color-navy)',
    color: '#fff',
    border: 'none',
  },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { padding: '6px 14px', fontSize: '13px', borderRadius: 'var(--radius-sm)', gap: '6px' },
  md: { padding: '10px 20px', fontSize: '14px', borderRadius: 'var(--radius-md)', gap: '8px' },
  lg: { padding: '14px 28px', fontSize: '16px', borderRadius: 'var(--radius-md)', gap: '10px' },
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading,
  fullWidth,
  children,
  style,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;
  return (
    <button
      {...props}
      disabled={isDisabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-primary)',
        fontWeight: 600,
        letterSpacing: '0.01em',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.6 : 1,
        transition: 'all var(--transition-fast)',
        width: fullWidth ? '100%' : undefined,
        whiteSpace: 'nowrap',
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      onMouseEnter={e => {
        if (!isDisabled) {
          (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.filter = '';
        (e.currentTarget as HTMLElement).style.transform = '';
      }}
    >
      {loading ? (
        <span style={{
          width: 16, height: 16, border: '2px solid currentColor',
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
      ) : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
};
