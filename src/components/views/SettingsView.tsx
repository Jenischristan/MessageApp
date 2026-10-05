import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Shield,
  Bell,
  Lock,
  Database,
  Info,
  LogOut,
  Trash2,
} from 'lucide-react';
import { AppSettings, UserProfile } from '../../types';
import { Button } from '../common/Button';
import { Switch } from '../common/Switch';

interface SettingsViewProps {
  settings: AppSettings;
  currentUser: UserProfile;
  onBack: () => void;
  onUpdateSetting: <K extends keyof AppSettings>(key: K, val: AppSettings[K]) => void;
  onOpenBlockedUsers: () => void;
  onOpenActiveSessions: () => void;
  onOpenLogOutDialog: () => void;
  onToast: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  currentUser,
  onBack,
  onUpdateSetting,
  onOpenBlockedUsers,
  onOpenActiveSessions,
  onOpenLogOutDialog,
  onToast,
}) => {
  const [storageUsed, setStorageUsed] = useState('184 MB');

  const handleClearCache = () => {
    setStorageUsed('0 KB');
    onToast('Local cache cleared (184 MB freed)');
  };

  return (
    <div className="h-full flex flex-col bg-[#0f1114] select-none">
      {/* Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#202230] shrink-0">
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
          <div>
            <h2 className="text-base font-semibold text-white">Settings</h2>
            <p className="text-xs text-white/50">Preferences & Privacy</p>
          </div>
        </div>
      </div>

      {/* Main Settings List */}
      <div className="flex-1 scr p-4 space-y-6 max-w-xl mx-auto w-full pb-16">
        {/* Section 1: Privacy */}
        <div className="space-y-2">
          <span className="flex items-center gap-2 text-xs font-semibold tracking-wider text-white/40 uppercase px-1">
            <Lock className="w-3.5 h-3.5" />
            Privacy & Visibility
          </span>
          <div className="rounded-2xl bg-[#14161a] border border-[#232536] divide-y divide-[#232536] overflow-hidden">
            <div className="flex items-center justify-between p-3.5">
              <div>
                <p className="text-sm font-medium text-white">Last Seen Timestamp</p>
                <p className="text-xs text-white/40">Show when you were last online</p>
              </div>
              <Switch
                on={settings.seen}
                set={(v) => onUpdateSetting('seen', v)}
                label="Last seen toggle"
              />
            </div>

            <div className="flex items-center justify-between p-3.5">
              <div>
                <p className="text-sm font-medium text-white">Read Receipts</p>
                <p className="text-xs text-white/40">Let others know when you read messages</p>
              </div>
              <Switch
                on={settings.receipts}
                set={(v) => onUpdateSetting('receipts', v)}
                label="Read receipts toggle"
              />
            </div>

            <div className="flex items-center justify-between p-3.5">
              <div>
                <p className="text-sm font-medium text-white">Online Indicator</p>
                <p className="text-xs text-white/40">Display green presence badge</p>
              </div>
              <Switch
                on={settings.online}
                set={(v) => onUpdateSetting('online', v)}
                label="Online indicator toggle"
              />
            </div>

            <button
              type="button"
              onClick={onOpenBlockedUsers}
              className="w-full flex items-center justify-between p-3.5 hover:bg-[#1a1c27] transition-colors text-left"
            >
              <div>
                <p className="text-sm font-medium text-white">Blocked Contacts</p>
                <p className="text-xs text-white/40">2 contacts currently blocked</p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </button>
          </div>
        </div>

        {/* Section 2: Notifications & Audio */}
        <div className="space-y-2">
          <span className="flex items-center gap-2 text-xs font-semibold tracking-wider text-white/40 uppercase px-1">
            <Bell className="w-3.5 h-3.5" />
            Notifications & Sounds
          </span>
          <div className="rounded-2xl bg-[#14161a] border border-[#232536] divide-y divide-[#232536] overflow-hidden">
            <div className="flex items-center justify-between p-3.5">
              <div>
                <p className="text-sm font-medium text-white">Message Notifications</p>
                <p className="text-xs text-white/40">Alert when receiving direct messages</p>
              </div>
              <Switch
                on={settings.notif}
                set={(v) => onUpdateSetting('notif', v)}
                label="Notifications toggle"
              />
            </div>

            <div className="flex items-center justify-between p-3.5">
              <div>
                <p className="text-sm font-medium text-white">Subtle Sound Effects</p>
                <p className="text-xs text-white/40">Haptic chimes on send, receive, and reactions</p>
              </div>
              <Switch
                on={settings.sound}
                set={(v) => onUpdateSetting('sound', v)}
                label="Sound effects toggle"
              />
            </div>

            <div className="flex items-center justify-between p-3.5">
              <div>
                <p className="text-sm font-medium text-white">Reaction Bursts</p>
                <p className="text-xs text-white/40">Confetti particle effects when reacting</p>
              </div>
              <Switch
                on={settings.react}
                set={(v) => onUpdateSetting('react', v)}
                label="Reactions toggle"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Chat Composing */}
        <div className="space-y-2">
          <span className="flex items-center gap-2 text-xs font-semibold tracking-wider text-white/40 uppercase px-1">
            <Shield className="w-3.5 h-3.5" />
            Chat Preferences
          </span>
          <div className="rounded-2xl bg-[#14161a] border border-[#232536] divide-y divide-[#232536] overflow-hidden">
            <div className="flex items-center justify-between p-3.5">
              <div>
                <p className="text-sm font-medium text-white">Enter to Send</p>
                <p className="text-xs text-white/40">Press Enter to send, Shift+Enter for new line</p>
              </div>
              <Switch
                on={settings.enter}
                set={(v) => onUpdateSetting('enter', v)}
                label="Enter to send toggle"
              />
            </div>

            <div className="flex items-center justify-between p-3.5">
              <div>
                <p className="text-sm font-medium text-white">Rich Link Previews</p>
                <p className="text-xs text-white/40">Render metadata card when URLs are sent</p>
              </div>
              <Switch
                on={settings.links}
                set={(v) => onUpdateSetting('links', v)}
                label="Link previews toggle"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Data & Storage */}
        <div className="space-y-2">
          <span className="flex items-center gap-2 text-xs font-semibold tracking-wider text-white/40 uppercase px-1">
            <Database className="w-3.5 h-3.5" />
            Storage & Sessions
          </span>
          <div className="rounded-2xl bg-[#14161a] border border-[#232536] divide-y divide-[#232536] overflow-hidden">
            <div className="flex items-center justify-between p-3.5">
              <div>
                <p className="text-sm font-medium text-white">Storage Usage</p>
                <p className="text-xs text-white/40 font-mono">{storageUsed} in cache</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearCache}
                className="gap-1.5 text-xs"
              >
                <Trash2 className="w-3 h-3 text-red-400" />
                Clear Cache
              </Button>
            </div>

            <button
              type="button"
              onClick={onOpenActiveSessions}
              className="w-full flex items-center justify-between p-3.5 hover:bg-[#1a1c27] transition-colors text-left"
            >
              <div>
                <p className="text-sm font-medium text-white">Active Sessions</p>
                <p className="text-xs text-white/40">3 logged in devices</p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </button>
          </div>
        </div>

        {/* Section 5: About & Log Out */}
        <div className="space-y-3 pt-2">
          <div className="rounded-2xl bg-[#14161a] border border-[#232536] p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-white/50">
              <Info className="w-4 h-4" />
              <span>nook build 1.4.0 — high-fidelity messaging</span>
            </div>
            <span className="text-white/40 font-mono">End-to-end encrypted</span>
          </div>

          <Button
            variant="danger"
            className="w-full h-11 rounded-xl gap-2 font-medium"
            onClick={onOpenLogOutDialog}
          >
            <LogOut className="w-4 h-4" />
            Log Out of {currentUser.name}
          </Button>
        </div>
      </div>
    </div>
  );
};
