import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', leftIcon, rightElement, ...props }, ref) => {
    return (
      <div className="relative w-full flex items-center">
        {leftIcon && (
          <span className="absolute left-3 text-white/40 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          {...props}
          className={`flex h-10 w-full rounded-xl bg-[#121316] border border-white/10 px-3.5 text-sm text-white placeholder:text-white/35 transition-colors focus-visible:outline-none focus-visible:border-[#0b69c7]/70 focus-visible:ring-2 focus-visible:ring-[#0b69c7]/30 ${
            leftIcon ? 'pl-9' : ''
          } ${rightElement ? 'pr-10' : ''} ${className}`}
        />
        {rightElement && (
          <div className="absolute right-1 flex items-center">{rightElement}</div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
