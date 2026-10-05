import React, { useState } from 'react';
import { Dialog } from '../common/Dialog';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { Check } from 'lucide-react';
import { PEOPLE } from '../../data/mockData';

interface AddMembersDialogProps {
  isOpen: boolean;
  groupName: string;
  existingMembers: string[];
  onClose: () => void;
  onAddMembers: (newMembers: string[]) => void;
}

export const AddMembersDialog: React.FC<AddMembersDialogProps> = ({
  isOpen,
  groupName,
  existingMembers,
  onClose,
  onAddMembers,
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  // Eligible contacts are those not already in the group
  const eligibleContacts = Object.entries(PEOPLE).filter(
    ([name]) => !existingMembers.includes(name)
  );

  const toggleSelect = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleConfirm = () => {
    if (selected.length === 0) return;
    onAddMembers(selected);
    setSelected([]);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      title={`Add to ${groupName}`}
      description="Choose contacts to join this group discussion"
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {eligibleContacts.length === 0 ? (
          <p className="text-center py-8 text-xs text-white/40">
            All contacts in your list are already members of this group.
          </p>
        ) : (
          <div className="max-h-60 scr space-y-1.5 p-1">
            {eligibleContacts.map(([name, data]) => {
              const isSelected = selected.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleSelect(name)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-[#242636] border-[#383b54] text-white'
                      : 'bg-[#12131a] border-[#222432] hover:border-[#323548] text-white/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar
                      name={name}
                      size={32}
                      online={!!data.on}
                      index={data.i}
                      imgUrl={data.imgUrl}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{name}</p>
                      <p className="text-[11px] text-white/40 truncate">@{data.u}</p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#6956e5] text-white border-[#6956e5]'
                        : 'border-[#3b3e54]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1 cursor-pointer" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1 font-semibold cursor-pointer"
            disabled={selected.length === 0}
            onClick={handleConfirm}
          >
            Add Selected ({selected.length})
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
