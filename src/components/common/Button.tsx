import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const variantStyles = {
    default:
      'bg-white text-[#08090a] hover:bg-[#e2e4e8] active:bg-[#d0d3d8] font-semibold shadow-sm border border-transparent',
    secondary:
      'bg-white/[0.08] text-white hover:bg-white/[0.13] active:bg-white/[0.18] border border-white/10 shadow-sm',
    outline:
      'bg-[#131417] text-white/90 hover:bg-[#1c1d22] active:bg-[#24262d] border border-white/10 hover:border-white/20 shadow-sm',
    ghost:
      'text-white/70 hover:text-white hover:bg-white/[0.06] active:bg-white/[0.1] border border-transparent',
    danger:
      'bg-[#e5484d] text-white hover:bg-[#d03d42] active:bg-[#b83338] shadow-sm',
  }[variant];

  const sizeStyles = {
    sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg font-medium',
    md: 'h-9 px-4 text-sm gap-2 rounded-xl font-medium',
    lg: 'h-11 px-6 text-sm gap-2.5 rounded-xl font-semibold',
    icon: 'h-9 w-9 p-0 rounded-xl shrink-0',
  }[size];

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090a] ${variantStyles} ${sizeStyles} ${className}`}
    >
      {children}
    </button>
  );
};
