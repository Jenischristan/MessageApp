import * as React from 'react';
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from '../ui/button';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon' | 'default';
  children?: React.ReactNode;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'md', className, ...props }, ref) => {
    // Map custom variants & sizes to shadcn Button
    const shadcnVariant = variant === 'danger' ? 'destructive' : variant;
    const shadcnSize = size === 'md' ? 'default' : size;

    return (
      <ShadcnButton
        ref={ref}
        variant={shadcnVariant as any}
        size={shadcnSize as any}
        className={className}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
