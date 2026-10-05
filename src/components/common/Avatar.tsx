import React from 'react';

const AVATAR_PALETTES = [
  { bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#ffffff' },
  { bg: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', color: '#ffffff' },
  { bg: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', color: '#ffffff' },
  { bg: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', color: '#ffffff' },
  { bg: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', color: '#ffffff' },
  { bg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', color: '#ffffff' },
];

interface AvatarProps {
  name: string;
  size?: number;
  online?: boolean;
  index?: number;
  className?: string;
  imgUrl?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 40,
  online,
  index = 0,
  className = '',
  imgUrl,
}) => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const palette = AVATAR_PALETTES[Math.abs(index) % AVATAR_PALETTES.length];
  const indicatorSize = Math.max(9, Math.round(size * 0.28));

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full font-semibold select-none leading-none shadow-sm transition-transform ${className}`}
      style={{
        width: size,
        height: size,
        background: palette.bg,
        color: palette.color,
        fontSize: Math.max(9, Math.round(size * 0.38)),
      }}
      aria-hidden="true"
    >
      {imgUrl ? (
        <img
          src={imgUrl}
          alt={name}
          className="w-full h-full rounded-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="flex items-center justify-center leading-none tracking-tight">
          {initials || '?'}
        </span>
      )}
      {online && (
        <span
          title="Online"
          className="absolute right-0 bottom-0 rounded-full ring-2 ring-[#08090a] bg-[#22c55e] z-10"
          style={{
            width: indicatorSize,
            height: indicatorSize,
          }}
        />
      )}
    </span>
  );
};
