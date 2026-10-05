import React from 'react';
import { Pin, X, ChevronRight } from 'lucide-react';
import { Message } from '../../types';

interface PinnedBannerProps {
  pinnedMessages: Message[];
  onScrollTo: (id: number) => void;
  onUnpin: (message: Message) => void;
}

export const PinnedBanner: React.FC<PinnedBannerProps> = ({
  pinnedMessages,
  onScrollTo,
  onUnpin,
}) => {
  if (pinnedMessages.length === 0) return null;
  const latestPinned = pinnedMessages[pinnedMessages.length - 1];

  return (
    <div className="bg-[#15171b] border-b border-white/5 px-4 py-1.5 flex items-center justify-between text-xs text-white/80 z-10">
      <button
        type="button"
        onClick={() => onScrollTo(latestPinned.id)}
        className="flex items-center gap-2 min-w-0 flex-1 text-left hover:text-white transition-colors"
      >
        <Pin className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
        <div className="min-w-0 flex-1 flex items-center gap-1.5">
          <span className="font-semibold text-amber-300 shrink-0">
            Pinned {pinnedMessages.length > 1 ? `(${pinnedMessages.length})` : ''}:
          </span>
          <span className="truncate text-white/70">
            {latestPinned.t ||
              (latestPinned.kind === 'img'
                ? 'Photo'
                : latestPinned.file
                ? latestPinned.file.name
                : 'Attachment')}
          </span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-white/40 shrink-0" />
      </button>

      <button
        type="button"
        title="Unpin message"
        onClick={(e) => {
          e.stopPropagation();
          onUnpin(latestPinned);
        }}
        className="p-1 rounded-md hover:bg-white/10 text-white/40 hover:text-white ml-2 shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
