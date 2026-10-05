import React from 'react';
import { motion } from 'motion/react';

interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  label?: string;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  value,
  onChange,
  label = 'Navigation Tabs',
  className = '',
}) => {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={`flex items-center gap-1 overflow-x-auto nsb p-1 bg-[#121316] rounded-xl border border-white/5 ${className}`}
    >
      {items.map((tab) => {
        const isActive = value === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors select-none cursor-pointer ${
              isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-[#22242a] rounded-lg shadow-sm border border-white/10"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
            {typeof tab.count === 'number' && tab.count > 0 && (
              <span
                className={`relative z-10 text-[10px] font-semibold px-1.5 py-0.2 rounded-full tabular-nums ${
                  isActive
                    ? 'bg-white text-[#08090a]'
                    : 'bg-white/10 text-white/60'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
