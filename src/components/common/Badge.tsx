import * as React from 'react';
import { Badge as ShadcnBadge } from '../ui/badge';
import { cn } from '../../lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'danger' | 'primary' | 'muted' | 'destructive' | 'secondary' | 'default' | 'purple';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'danger',
  className = '',
}) => {
  const variantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'purple'> = {
    danger: 'destructive',
    primary: 'default',
    muted: 'secondary',
    destructive: 'destructive',
    secondary: 'secondary',
    default: 'default',
    purple: 'purple',
  };

  return (
    <ShadcnBadge
      variant={variantMap[variant] || 'default'}
      className={cn('min-w-5 h-5 px-1.5 text-[11px] font-semibold leading-none shadow-sm', className)}
    >
      {children}
    </ShadcnBadge>
  );
};
