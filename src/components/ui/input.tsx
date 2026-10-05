import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightElement, ...props }, ref) => {
    if (leftIcon || rightElement) {
      return (
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-white/50">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'flex h-10 w-full rounded-xl border border-[#262836] bg-[#12131a] px-3 py-2 text-sm placeholder:text-white/35 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#6956e5]/50 focus-visible:border-[#6956e5]/70 disabled:cursor-not-allowed disabled:opacity-50 text-white transition-all',
              leftIcon ? 'pl-9' : '',
              rightElement ? 'pr-10' : '',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-2 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-xl border border-[#262836] bg-[#12131a] px-3 py-2 text-sm placeholder:text-white/35 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#6956e5]/50 focus-visible:border-[#6956e5]/70 disabled:cursor-not-allowed disabled:opacity-50 text-white transition-all',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
