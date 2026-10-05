import React from 'react';
import { ChevronUp, ChevronDown, X, Search } from 'lucide-react';
import { Button } from '../common/Button';

interface InChatSearchProps {
  isOpen: boolean;
  query: string;
  onQueryChange: (q: string) => void;
  matchCount: number;
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

export const InChatSearch: React.FC<InChatSearchProps> = ({
  isOpen,
  query,
  onQueryChange,
  matchCount,
  currentIndex,
  onNext,
  onPrev,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="px-3 md:px-5 py-2 bg-[#121418] border-b border-white/5 flex items-center justify-between gap-3 text-xs animate-in slide-in-from-top-2 duration-150 z-10">
      <div className="flex-1 flex items-center gap-2 max-w-md">
        <Search className="w-3.5 h-3.5 text-white/40 shrink-0" />
        <input
          type="text"
          autoFocus
          placeholder="Search within this chat..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-1.5 shrink-0 text-white/60">
        {query && (
          <span className="text-[11px] tabular-nums font-mono px-2 py-0.5 rounded-md bg-white/5 text-white/50">
            {matchCount > 0 ? `${currentIndex + 1} of ${matchCount}` : 'No results'}
          </span>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-white/60 hover:text-white"
          disabled={matchCount <= 1}
          onClick={onPrev}
          title="Previous match"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-white/60 hover:text-white"
          disabled={matchCount <= 1}
          onClick={onNext}
          title="Next match"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </Button>

        <div className="w-px h-3.5 bg-white/10 mx-1" />

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-white/60 hover:text-white"
          onClick={onClose}
          title="Close search"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};
