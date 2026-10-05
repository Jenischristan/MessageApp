import React from 'react';
import { Pin, Star, VolumeX, Check, CheckCheck, Image, FileText } from 'lucide-react';
import { Conversation } from '../../types';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { PEOPLE } from '../../data/mockData';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onSelect,
}) => {
  const isGroup = conversation.group;
  const person = !isGroup ? PEOPLE[conversation.name] : null;

  const lastMessage =
    conversation.msgs.filter((m) => !m.sys).slice(-1)[0] || { t: '', time: '' };

  const snippet = React.useMemo(() => {
    if (conversation.typing) {
      return (
        <span className="text-[#38bdf8] font-medium italic">typing…</span>
      );
    }
    if (lastMessage.del) {
      return <span className="italic opacity-60">Message deleted</span>;
    }
    if (lastMessage.kind === 'img') {
      return (
        <span className="inline-flex items-center gap-1">
          <Image className="w-3.5 h-3.5 opacity-60" />
          <span>Photo</span>
        </span>
      );
    }
    if (lastMessage.kind === 'file') {
      return (
        <span className="inline-flex items-center gap-1 truncate">
          <FileText className="w-3.5 h-3.5 opacity-60 shrink-0" />
          <span className="truncate">{lastMessage.file?.name}</span>
        </span>
      );
    }
    if (lastMessage.kind === 'voice') {
      return <span>Voice message</span>;
    }
    return lastMessage.t || 'No messages yet';
  }, [conversation.typing, lastMessage]);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isActive ? 'true' : undefined}
      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-xl transition-all cursor-pointer select-none ${
        isActive
          ? 'bg-[#1c1d27] shadow-sm ring-1 ring-[#caa6fc]/25 border-l-[3px] border-[#caa6fc]'
          : 'hover:bg-white/[0.04]'
      }`}
    >
      {/* Avatar */}
      <Avatar
        name={conversation.name}
        size={44}
        online={isGroup ? undefined : !!person?.on}
        index={conversation.i ?? person?.i ?? 0}
        imgUrl={conversation.imgUrl || person?.imgUrl}
      />

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Top Line: Name and Time / Badges */}
        <div className="flex items-center justify-between gap-1.5">
          <span
            className={`truncate text-sm ${
              conversation.unread > 0 ? 'font-semibold text-white' : 'font-medium text-white/90'
            }`}
          >
            {conversation.name}
          </span>

          <span className="text-[11px] font-mono text-white/45 shrink-0 flex items-center gap-1 tabular-nums">
            {conversation.pin && (
              <Pin className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
            )}
            {conversation.fav && (
              <Star className="w-3 h-3 text-amber-400 fill-amber-400 stroke-amber-400 shrink-0" />
            )}
            <span>{lastMessage.time}</span>
          </span>
        </div>

        {/* Bottom Line: Message Snippet and Indicators */}
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p
            className={`truncate text-xs leading-normal flex items-center gap-1 ${
              conversation.unread > 0 && !conversation.mute
                ? 'text-white font-medium'
                : 'text-white/45'
            }`}
          >
            {/* Sender Ticks if my message */}
            {lastMessage.me && (
              <span className="shrink-0 inline-flex items-center">
                {lastMessage.st === 'read' ? (
                  <CheckCheck className="w-3.5 h-3.5 text-[#caa6fc]" />
                ) : lastMessage.st === 'delivered' ? (
                  <CheckCheck className="w-3.5 h-3.5 text-white/40" />
                ) : (
                  <Check className="w-3.5 h-3.5 text-white/40" />
                )}
              </span>
            )}
            <span className="truncate">{snippet}</span>
          </p>

          <div className="flex items-center gap-1 shrink-0">
            {conversation.mute && (
              <VolumeX className="w-3.5 h-3.5 text-white/35" />
            )}
            {conversation.unread > 0 && (
              <span className="inline-flex min-w-5 h-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums bg-[#6956e5] text-white shadow-sm">
                {conversation.unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};
