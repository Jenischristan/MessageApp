import React from 'react';
import { motion } from 'motion/react';
import {
  MessageSquare,
  Users,
  Bell,
  Settings,
  Star,
  Plus,
} from 'lucide-react';
import { ViewType, UserProfile } from '../../types';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';

interface NavigationRailProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  unreadChats: number;
  unreadNotifications: number;
  currentUser: UserProfile;
  onNewMessage: () => void;
  onOpenFavorites: () => void;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  currentView,
  onViewChange,
  unreadChats,
  unreadNotifications,
  currentUser,
  onNewMessage,
  onOpenFavorites,
}) => {
  const navItems: Array<{
    id: ViewType;
    icon: React.ElementType;
    label: string;
    badgeCount?: number;
  }> = [
    {
      id: 'chats',
      icon: MessageSquare,
      label: 'Chats',
      badgeCount: currentView !== 'chats' ? unreadChats : 0,
    },
    {
      id: 'contacts',
      icon: Users,
      label: 'Contacts',
    },
    {
      id: 'notifs',
      icon: Bell,
      label: 'Notifications',
      badgeCount: unreadNotifications,
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Settings',
    },
  ];

  return (
    <nav
      aria-label="Primary navigation"
      className="hidden md:flex flex-col items-center w-[74px] bg-[#0c0d10] py-5 gap-2.5 shrink-0 border-r border-[#222432] select-none z-30"
    >
      {/* Brand Icon */}
      <button
        type="button"
        onClick={() => onViewChange('chats')}
        className="w-11 h-11 mb-2 rounded-2xl bg-[#14161f] border border-[#262836] hover:border-[#383b4e] transition-all flex items-center justify-center cursor-pointer group shadow-sm"
        title="nook — messaging"
      >
        <svg
          width={28}
          height={28}
          viewBox="0 0 32 32"
          role="img"
          aria-label="nook"
          className="group-hover:scale-105 transition-transform"
        >
          <rect width="32" height="32" rx="9" fill="#6956e5" />
          <path
            d="M10 23V9.5M10 15.5a6 6 0 0 1 12 0V19"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
          <circle cx="22" cy="23.5" r="2.6" fill="#ffffff" />
        </svg>
      </button>

      {/* Nav Buttons */}
      <div className="flex flex-col gap-1.5 w-full items-center">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              title={item.label}
              onClick={() => onViewChange(item.id)}
              className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#222434] text-white font-medium shadow-sm'
                  : 'text-white/45 hover:text-white hover:bg-[#1a1b26]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute left-0 w-1 h-6 rounded-r bg-[#6956e5]"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <Icon className="w-5 h-5" />

              {/* Badge Counter */}
              {typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#e5484d] text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-[#0c0d10] tabular-nums">
                  {item.badgeCount}
                </span>
              )}
            </button>
          );
        })}

        {/* Divider */}
        <div className="w-8 h-px bg-[#232534] my-1" />

        {/* Favorites Quick Filter */}
        <button
          type="button"
          aria-label="Favorites"
          title="Favorites"
          onClick={onOpenFavorites}
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white/45 hover:text-amber-400 hover:bg-[#1a1b26] transition-colors cursor-pointer"
        >
          <Star className="w-5 h-5" />
        </button>

        {/* New Chat Action */}
        <Button
          size="icon"
          className="mt-2 h-11 w-11 rounded-2xl bg-[#6956e5] hover:bg-[#5b48d6] text-white shadow-sm font-bold cursor-pointer border border-transparent"
          title="New conversation"
          onClick={onNewMessage}
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </Button>
      </div>

      {/* User Avatar at bottom */}
      <div className="mt-auto flex flex-col items-center">
        <button
          type="button"
          onClick={() => onViewChange('profile')}
          title={`Profile (${currentUser.name})`}
          className="p-1 rounded-full hover:ring-2 hover:ring-[#6956e5]/50 transition-all cursor-pointer"
        >
          <Avatar
            name={currentUser.name}
            size={38}
            online={currentUser.vis}
            index={currentUser.av}
            imgUrl={currentUser.imgUrl}
          />
        </button>
      </div>
    </nav>
  );
};
