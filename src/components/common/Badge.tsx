import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'danger' | 'primary' | 'muted';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'danger',
  className = '',
}) => {
  const styles = {
    danger: 'bg-[#e5484d] text-white',
    primary: 'bg-white text-[#08090a]',
    muted: 'bg-white/15 text-white/90',
  }[variant];

  return (
    <span
      className={`inline-flex min-w-5 h-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums leading-none select-none shadow-sm ${styles} ${className}`}
    >
      {children}
    </span>
  );
};
