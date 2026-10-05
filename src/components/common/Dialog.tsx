import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface DialogProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  description?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  title,
  onClose,
  children,
  maxWidth = 'max-w-md',
  description,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', damping: 26, stiffness: 350 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            className={`relative z-10 w-full ${maxWidth} max-h-[88dvh] flex flex-col rounded-2xl bg-[#15171b] border border-white/10 shadow-2xl overflow-hidden`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/5 shrink-0">
              <div>
                <h2 id="dialog-title" className="text-base font-semibold text-white tracking-tight">
                  {title}
                </h2>
                {description && (
                  <p className="text-xs text-white/50 mt-0.5">{description}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/60 hover:text-white -mr-1"
                aria-label="Close"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Body */}
            <div className="flex-1 scr p-5 min-h-0 text-sm text-white/80">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
