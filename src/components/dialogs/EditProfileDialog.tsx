import React, { useState } from 'react';
import { Dialog } from '../common/Dialog';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Avatar } from '../common/Avatar';
import { UserProfile } from '../../types';

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSave: (updated: UserProfile) => void;
}

export const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserProfile>(currentUser);

  React.useEffect(() => {
    setFormData(currentUser);
  }, [currentUser, isOpen]);

  const handleSave = () => {
    if (!formData.name.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      title="Edit Profile"
      description="Update your personal details and presentation"
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Avatar customizer */}
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#121316] border border-[#232536]">
          <Avatar
            name={formData.name || 'You'}
            size={56}
            online={formData.vis}
            index={formData.av}
          />
          <div className="space-y-1">
            <span className="text-xs font-semibold text-white/80 block">
              Avatar Color Scheme
            </span>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFormData({ ...formData, av: i })}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    formData.av === i
                      ? 'ring-2 ring-[#6956e5] scale-110'
                      : 'hover:scale-105 opacity-70'
                  }`}
                >
                  <Avatar name={formData.name || 'You'} size={24} index={i} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div>
          <label
            htmlFor="edit-name"
            className="block text-xs font-semibold text-white/70 mb-1.5"
          >
            Full Name
          </label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>

        <div>
          <label
            htmlFor="edit-user"
            className="block text-xs font-semibold text-white/70 mb-1.5"
          >
            Username
          </label>
          <Input
            id="edit-user"
            value={formData.user}
            onChange={(e) =>
              setFormData({ ...formData, user: e.target.value })
            }
          />
        </div>

        <div>
          <label
            htmlFor="edit-bio"
            className="block text-xs font-semibold text-white/70 mb-1.5"
          >
            Bio
          </label>
          <Input
            id="edit-bio"
            value={formData.bio}
            onChange={(e) =>
              setFormData({ ...formData, bio: e.target.value })
            }
          />
        </div>

        <div>
          <label
            htmlFor="edit-email"
            className="block text-xs font-semibold text-white/70 mb-1.5"
          >
            Email
          </label>
          <Input
            id="edit-email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
