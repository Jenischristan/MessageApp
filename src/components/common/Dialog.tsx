import * as React from 'react';
import {
  Dialog as ShadcnDialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { cn } from '../../lib/utils';

export interface DialogProps {
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
  maxWidth = 'sm:max-w-md',
  description,
}) => {
  return (
    <ShadcnDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn('p-0 overflow-hidden flex flex-col', maxWidth)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription className="mt-0.5">{description}</DialogDescription>
          )}
        </DialogHeader>
        <div className="p-4 sm:p-6 overflow-y-auto scr flex-1 text-sm text-white/80 min-h-0">
          {children}
        </div>
      </DialogContent>
    </ShadcnDialog>
  );
};
