import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
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
  className = '',
}) => {
  // Unique layoutId instance prefix based on tab IDs
  const tabInstanceId = React.useId();

  return (
    <div
      role="tablist"
      className={cn(
        'w-full flex items-center overflow-x-auto nsb p-1 bg-[#12131a] border border-[#232536] rounded-xl gap-1',
        className
      )}
    >
      {items.map((tab) => {
        const isActive = value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium rounded-lg transition-colors cursor-pointer select-none shrink-0 ${
              isActive ? 'text-white' : 'text-white/50 hover:text-white'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={`active-tab-${tabInstanceId}`}
                className="absolute inset-0 rounded-lg bg-[#242636] border border-[#323548] shadow-sm"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
            {typeof tab.count === 'number' && tab.count > 0 && (
              <span
                className={`relative z-10 text-[10px] font-semibold px-1.5 py-0.2 rounded-full tabular-nums transition-colors ${
                  isActive
                    ? 'bg-[#6956e5] text-white'
                    : 'bg-[#232536] text-white/60'
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
