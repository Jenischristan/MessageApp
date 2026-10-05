import React from 'react';

interface SwitchProps {
  on: boolean;
  set: (val: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  on,
  set,
  label,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => set(!on)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-white/10 transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090a] disabled:opacity-40 ${
        on ? 'bg-white' : 'bg-[#22242a]'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full shadow-sm transition duration-200 ease-in-out ${
          on ? 'translate-x-6 bg-[#08090a]' : 'translate-x-1 bg-white/70'
        }`}
      />
    </button>
  );
};
