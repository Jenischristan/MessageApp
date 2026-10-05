import React from 'react';
import { ArrowLeft, Edit3, Shield, Mail, AtSign, Globe } from 'lucide-react';
import { UserProfile } from '../../types';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { Tabs } from '../common/Tabs';

interface ProfileViewProps {
  currentUser: UserProfile;
  onBack: () => void;
  onEditProfile: () => void;
  onUpdateStatus: (status: 'Available' | 'Busy' | 'Away') => void;
  onToggleVisibility: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onBack,
  onEditProfile,
  onUpdateStatus,
  onToggleVisibility,
}) => {
  const statusTabs = [
    { id: 'Available', label: '🟢 Available' },
    { id: 'Busy', label: '🔴 Busy' },
    { id: 'Away', label: '🟡 Away' },
  ];

  return (
    <div className="h-full flex flex-col bg-[#0f1114] select-none">
      {/* Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-white/70"
            onClick={onBack}
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-base font-semibold text-white">Your Profile</h2>
        </div>

        <Button size="sm" onClick={onEditProfile} className="gap-1.5">
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 scr p-5 space-y-6 max-w-xl mx-auto w-full">
        {/* Profile Hero */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 rounded-2xl bg-[#14161a] border border-white/5">
          <Avatar
            name={currentUser.name}
            size={88}
            online={currentUser.vis}
            index={currentUser.av}
          />
          <div className="text-center sm:text-left min-w-0 flex-1">
            <h3 className="text-lg font-bold text-white">{currentUser.name}</h3>
            <p className="text-xs text-white/50 font-mono mt-0.5">
              @{currentUser.user}
            </p>
            <p className="text-sm text-white/80 mt-2 leading-relaxed">
              {currentUser.bio}
            </p>
          </div>
        </div>

        {/* Status Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block">
            Presence Status
          </label>
          <Tabs
            items={statusTabs}
            value={currentUser.status}
            onChange={(val) => onUpdateStatus(val as any)}
            label="Set presence status"
          />
        </div>

        {/* Profile Details List */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block">
            Account Details
          </label>
          <div className="rounded-2xl bg-[#14161a] border border-white/5 divide-y divide-white/5 text-xs">
            <div className="flex items-center justify-between p-3.5">
              <span className="flex items-center gap-2.5 text-white/60">
                <AtSign className="w-4 h-4 text-white/40" />
                Username
              </span>
              <span className="font-mono text-white/90">@{currentUser.user}</span>
            </div>

            <div className="flex items-center justify-between p-3.5">
              <span className="flex items-center gap-2.5 text-white/60">
                <Mail className="w-4 h-4 text-white/40" />
                Email
              </span>
              <span className="text-white/90">{currentUser.email}</span>
            </div>

            <div className="flex items-center justify-between p-3.5">
              <span className="flex items-center gap-2.5 text-white/60">
                <Globe className="w-4 h-4 text-white/40" />
                Online Visibility
              </span>
              <button
                type="button"
                onClick={onToggleVisibility}
                className="text-xs font-semibold text-[#38bdf8] hover:underline cursor-pointer"
              >
                {currentUser.vis ? 'Visible to everyone' : 'Hidden'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5">
              <span className="flex items-center gap-2.5 text-white/60">
                <Shield className="w-4 h-4 text-white/40" />
                Encryption Invariants
              </span>
              <span className="font-mono text-emerald-400">ECDSA-256 Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
