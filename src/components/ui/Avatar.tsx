import React from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  name?: string;
  size?: number;
  src?: string | null;
  style?: React.CSSProperties;
}

function getInitials(name?: string) {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function getColor(name?: string) {
  const colors = ['#2A9D8F', '#1F3A6E', '#3182CE', '#6B46C1', '#D69E2E'];
  if (!name) return colors[0];
  return colors[name.charCodeAt(0) % colors.length];
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 40, src, style }) => {
  const initials = getInitials(name);
  const bg = getColor(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', ...style }}
      />
    );
  }

  return (
    <div
      style={{
        width: size, height: size,
        borderRadius: '50%',
        background: bg,
        color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.36,
        fontWeight: 700,
        fontFamily: 'var(--font-display)',
        flexShrink: 0,
        ...style,
      }}
    >
      {name ? initials : <User size={size * 0.5} />}
    </div>
  );
};
