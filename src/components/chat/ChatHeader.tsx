import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  Sidebar,
  Star,
  VolumeX,
  Volume2,
  Flag,
  MoreVertical,
  Pin,
  Share2,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { Conversation } from '../../types';
import { PEOPLE } from '../../data/mockData';

interface ChatHeaderProps {
  conversation: Conversation;
  isDetailsOpen: boolean;
  isSearchOpen: boolean;
  onBack: () => void;
  onToggleSearch: () => void;
  onToggleDetails: () => void;
  onOpenProfile: () => void;
  onToggleFavorite: () => void;
  onToggleMute?: () => void;
  onReportContact: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  isDetailsOpen,
  isSearchOpen,
  onBack,
  onToggleSearch,
  onToggleDetails,
  onOpenProfile,
  onToggleFavorite,
  onToggleMute,
  onReportContact,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isGroup = conversation.group;
  const person = !isGroup ? PEOPLE[conversation.name] : null;

  // Click outside to dismiss menu
  useEffect(() => {
    if (!showMenu) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showMenu]);

  const statusText = React.useMemo(() => {
    if (conversation.typing) {
      return (
        <span className="text-[#caa6fc] font-medium flex items-center gap-1.5">
          <span className="inline-flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#caa6fc] typing-dot" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#caa6fc] typing-dot" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#caa6fc] typing-dot" />
          </span>
          typing…
        </span>
      );
    }
    if (isGroup) {
      const memberCount = conversation.members?.length || 0;
      return `${memberCount} members · ${Math.max(1, memberCount - 1)} online`;
    }
    if (person?.on) {
      return <span className="text-[#a78bfa] font-medium">Online</span>;
    }
    return person?.seen || 'Offline';
  }, [conversation.typing, isGroup, conversation.members, person]);

  return (
    <header
      className="h-16 px-3 md:px-5 flex items-center justify-between border-b border-white/8 shrink-0 z-20 select-none"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Left: Back & User Info */}
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9 text-white/70"
          aria-label="Back to conversations"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <button
          type="button"
          onClick={onOpenProfile}
          className="flex items-center gap-3 text-left rounded-xl p-1 -m-1 hover:bg-white/[0.04] transition-colors min-w-0 cursor-pointer"
        >
          <Avatar
            name={conversation.name}
            size={42}
            online={isGroup ? undefined : !!person?.on}
            index={conversation.i ?? person?.i ?? 0}
            imgUrl={conversation.imgUrl || person?.imgUrl}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-[15.5px] font-semibold text-white tracking-[-0.01em] truncate leading-tight">
                {conversation.name}
              </h2>
              {conversation.fav && (
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 stroke-amber-400 shrink-0" />
              )}
              {conversation.mute && (
                <VolumeX className="w-3.5 h-3.5 text-white/40 shrink-0" />
              )}
            </div>
            <p className="text-xs text-white/50 truncate mt-0.5 font-normal tracking-normal">
              {statusText}
            </p>
          </div>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Star Button: Only lights up the star, stays transparent ghost button */}
        <button
          type="button"
          onClick={onToggleFavorite}
          className="h-9 w-9 rounded-xl flex items-center justify-center transition-colors hover:bg-white/[0.06] cursor-pointer"
          title={conversation.fav ? 'Favorited' : 'Favorite'}
          aria-label="Toggle favorite"
        >
          <Star
            className={`w-4 h-4 transition-all duration-150 ${
              conversation.fav
                ? 'fill-amber-400 text-amber-400 stroke-amber-400 scale-110 drop-shadow'
                : 'text-white/50 hover:text-white'
            }`}
          />
        </button>

        <button
          type="button"
          className={`h-9 w-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
            isSearchOpen ? 'text-[#caa6fc] bg-[#221e33]' : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
          }`}
          title="Search in conversation"
          onClick={onToggleSearch}
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          type="button"
          className={`h-9 w-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
            isDetailsOpen ? 'text-[#caa6fc] bg-[#221e33]' : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
          }`}
          title="Conversation details"
          onClick={onToggleDetails}
        >
          <Sidebar className="w-4 h-4" />
        </button>

        {/* More Menu Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            className="h-9 w-9 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            title="More actions"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-11 w-52 bg-[#16171d] border border-white/10 rounded-2xl shadow-2xl py-1.5 z-40 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onToggleSearch();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:bg-white/10 text-left cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-white/50" />
                Find in conversation
              </button>

              {onToggleMute && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onToggleMute();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:bg-white/10 text-left cursor-pointer"
                >
                  {conversation.mute ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-white/50" />
                      Unmute notifications
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-white/50" />
                      Mute notifications
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onOpenProfile();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:bg-white/10 text-left cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-white/50" />
                View contact info
              </button>

              <div className="h-px bg-white/10 my-1" />

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onReportContact();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-amber-400 hover:bg-amber-400/10 text-left cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5 text-amber-400" />
                Report {isGroup ? 'Group' : 'Contact'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
