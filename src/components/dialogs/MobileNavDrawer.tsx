import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Users,
  Bell,
  Settings,
  User,
  LogOut,
  X,
} from 'lucide-react';
import { ViewType, UserProfile } from '../../types';
import { Avatar } from '../common/Avatar';
import { Logo } from '../common/Logo';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  currentUser: UserProfile;
  unreadChats: number;
  unreadNotifications: number;
  onOpenLogOut: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  currentView,
  onSelectView,
  currentUser,
  unreadChats,
  unreadNotifications,
  onOpenLogOut,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative z-10 w-[280px] max-w-[80vw] h-full bg-[#121418] border-r border-white/10 flex flex-col p-5 select-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <Logo size={28} />
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Card */}
            <div
              onClick={() => {
                onSelectView('profile');
                onClose();
              }}
              className="flex items-center gap-3 p-3 mt-4 rounded-xl bg-[#13141f] border border-[#232536] cursor-pointer hover:bg-[#1a1c29] transition-colors"
            >
              <Avatar
                name={currentUser.name}
                size={44}
                online={currentUser.vis}
                index={currentUser.av}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">
                  {currentUser.name}
                </p>
                <p className="text-xs text-white/40 truncate font-mono">
                  @{currentUser.user}
                </p>
              </div>
            </div>

            {/* Nav Links */}
            <div className="flex-1 py-4 space-y-1">
              <button
                type="button"
                onClick={() => {
                  onSelectView('chats');
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  currentView === 'chats'
                    ? 'bg-[#6956e5]/20 text-[#caa6fc] border border-[#6956e5]/30'
                    : 'text-white/70 hover:bg-[#1a1c29]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4" />
                  Chats
                </span>
                {unreadChats > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#6956e5] text-white text-[11px] font-bold">
                    {unreadChats}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectView('contacts');
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  currentView === 'contacts'
                    ? 'bg-[#6956e5]/20 text-[#caa6fc] border border-[#6956e5]/30'
                    : 'text-white/70 hover:bg-[#1a1c29]'
                }`}
              >
                <Users className="w-4 h-4" />
                Contacts
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectView('notifs');
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  currentView === 'notifs'
                    ? 'bg-[#6956e5]/20 text-[#caa6fc] border border-[#6956e5]/30'
                    : 'text-white/70 hover:bg-[#1a1c29]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Bell className="w-4 h-4" />
                  Notifications
                </span>
                {unreadNotifications > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#e5484d] text-white text-[11px] font-bold">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectView('profile');
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  currentView === 'profile'
                    ? 'bg-[#6956e5]/20 text-[#caa6fc] border border-[#6956e5]/30'
                    : 'text-white/70 hover:bg-[#1a1c29]'
                }`}
              >
                <User className="w-4 h-4" />
                My Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectView('settings');
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  currentView === 'settings'
                    ? 'bg-[#6956e5]/20 text-[#caa6fc] border border-[#6956e5]/30'
                    : 'text-white/70 hover:bg-[#1a1c29]'
                }`}
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>

            {/* Logout */}
            <div className="pt-4 border-t border-[#232536]">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogOut();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
