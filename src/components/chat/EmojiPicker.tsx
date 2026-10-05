import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface EmojiPickerProps {
  isOpen: boolean;
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const EMOJI_CATEGORIES = [
  {
    name: 'Frequent & Reactions',
    emojis: ['❤️', '🔥', '👍', '🙌', '😂', '😍', '✨', '🎉', '💡', '🚀', '👀', '💯'],
  },
  {
    name: 'Smileys',
    emojis: ['🙂', '😊', '😎', '🤩', '🤔', '😴', '🥳', '😇', '🤫', '🫡', '🤯', '😭'],
  },
  {
    name: 'Gestures',
    emojis: ['👋', '✌️', '👌', '🤝', '👏', '💪', '🙏', '🤙', '✊', '🤛', '🤜', '🫰'],
  },
  {
    name: 'Objects & Symbols',
    emojis: ['☕', '💻', '📌', '📎', '⚡', '⭐', '💬', '🔔', '🔒', '🔑', '🎯', '🎨'],
  },
];

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  isOpen,
  onSelect,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15 }}
          className="absolute bottom-14 left-2 z-40 w-72 rounded-2xl bg-[#151722] border border-[#262838] shadow-2xl p-3 flex flex-col gap-2.5 backdrop-blur-md"
        >
          <div className="flex items-center justify-between pb-1 border-b border-[#232536]">
            <span className="text-xs font-semibold text-white/70">Emojis</span>
            <span className="text-[10px] text-white/40">Tap to insert</span>
          </div>

          <div className="max-h-56 scr space-y-3 pr-1">
            {EMOJI_CATEGORIES.map((cat) => (
              <div key={cat.name}>
                <span className="block text-[11px] font-medium text-white/40 mb-1 px-1">
                  {cat.name}
                </span>
                <div className="grid grid-cols-6 gap-1">
                  {cat.emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        onSelect(emoji);
                      }}
                      className="h-8 w-8 flex items-center justify-center rounded-lg text-lg hover:bg-[#242636] active:scale-90 transition-all select-none"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
