import React from 'react';

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 32,
  showWordmark = true,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        role="img"
        aria-label="nook"
        className="shrink-0 drop-shadow-sm"
      >
        <rect width="32" height="32" rx="9" fill="#ffffff" />
        <path
          d="M10 23V9.5M10 15.5a6 6 0 0 1 12 0V19"
          fill="none"
          stroke="#0b0c0e"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        <circle cx="22" cy="23.5" r="2.6" fill="#0b0c0e" />
      </svg>
      {showWordmark && (
        <span className="text-xl font-bold tracking-tight text-white flex items-baseline">
          nook<span className="text-[#0b69c7]">.</span>
        </span>
      )}
    </div>
  );
};
