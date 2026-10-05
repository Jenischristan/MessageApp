import React from 'react';
import { Dialog } from '../common/Dialog';
import { Button } from '../common/Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmVariant?: 'default' | 'danger';
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  confirmVariant = 'default',
  onConfirm,
  onClose,
}) => {
  return (
    <Dialog isOpen={isOpen} title={title} onClose={onClose} maxWidth="max-w-sm">
      <div className="space-y-4">
        <p className="text-sm text-white/70 leading-relaxed">{description}</p>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={confirmVariant}
            className="flex-1"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
