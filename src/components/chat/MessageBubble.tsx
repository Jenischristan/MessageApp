import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  CheckCheck,
  CornerDownRight,
  MoreHorizontal,
  Share2,
  Copy,
  Trash2,
  Pin,
  ExternalLink,
  FileText,
  Play,
  Pause,
  Download,
  Flag,
  Star,
} from 'lucide-react';
import { Message, UserProfile } from '../../types';
import { Avatar } from '../common/Avatar';
import { PEOPLE } from '../../data/mockData';
import { fireReactionConfetti } from '../../utils/confetti';
import { playPopSound } from '../../utils/audio';

interface MessageBubbleProps {
  message: Message;
  isFirstInGroup: boolean;
  isGroup: boolean;
  who0: string;
  currentUser: UserProfile;
  soundEnabled?: boolean;
  onOpenProfile: (name: string) => void;
  onReply: (message: Message) => void;
  onForward: (message: Message) => void;
  onDelete: (message: Message) => void;
  onTogglePin: (message: Message) => void;
  onReact: (message: Message, emoji: string) => void;
  onOpenImage: (v?: number, src?: string, caption?: string) => void;
  onScrollToMessage?: (id: number) => void;
  onReportMessage?: (message: Message) => void;
}

const QUICK_EMOJIS = ['❤️', '👍', '🔥', '😂', '😮', '🙌'];

// Distinct indicator accent colors per sender
const SENDER_ACCENTS: Record<string, { bar: string; text: string }> = {
  'Alex Morgan': { bar: '#caa6fc', text: '#d8b4fe' },
  'Sarah Wilson': { bar: '#f472b6', text: '#f9a8d4' },
  'Daniel Thomas': { bar: '#38bdf8', text: '#7dd3fc' },
  'Emma Davis': { bar: '#fbbf24', text: '#fde68a' },
  'Maya Chen': { bar: '#34d399', text: '#6ee7b7' },
  'Priya Patel': { bar: '#a78bfa', text: '#c4b5fd' },
  'Liam Brooks': { bar: '#60a5fa', text: '#93c5fd' },
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isFirstInGroup,
  isGroup,
  who0,
  currentUser,
  soundEnabled = true,
  onOpenProfile,
  onReply,
  onForward,
  onDelete,
  onTogglePin,
  onReact,
  onOpenImage,
  onScrollToMessage,
  onReportMessage,
}) => {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [ratingStars, setRatingStars] = useState(3);

  // System notification message
  if (message.sys) {
    return (
      <div className="flex justify-center my-3 select-none">
        <span className="text-[11px] font-medium text-white/50 bg-[#161720] border border-white/8 px-4 py-1 rounded-full shadow-sm">
          {message.t}
        </span>
      </div>
    );
  }

  // Deleted message
  if (message.del) {
    return (
      <div className={`flex my-2 ${message.me ? 'justify-end' : 'justify-start'}`}>
        <div className="px-4 py-2.5 rounded-2xl bg-[#14151b] border border-white/6 text-xs italic text-white/40 select-none">
          This message was deleted
        </div>
      </div>
    );
  }

  const senderName = message.who || who0;
  const senderContact = PEOPLE[senderName];
  const isMe = message.me;
  const accent = SENDER_ACCENTS[senderName] || { bar: '#caa6fc', text: '#d8b4fe' };

  const handleReactionClick = (emoji: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playPopSound(soundEnabled);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const originX = (rect.left + rect.width / 2) / window.innerWidth;
    const originY = (rect.top + rect.height / 2) / window.innerHeight;
    fireReactionConfetti(emoji, originX, originY);
    onReact(message, emoji);
  };

  const copyToClipboard = () => {
    if (message.t) {
      navigator.clipboard?.writeText(message.t).catch(() => {});
    }
    setShowMenu(false);
  };

  return (
    <motion.div
      id={`msg-${message.id}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.16 }}
      className={`group relative flex items-end gap-2.5 ${
        isFirstInGroup ? 'mt-4 mb-1' : 'my-1'
      } ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Sender Avatar */}
      <div className="w-8 shrink-0 self-start mt-0.5">
        {!isMe && isFirstInGroup && (
          <button
            type="button"
            aria-label={`View ${senderName} profile`}
            onClick={() => onOpenProfile(senderName)}
            className="cursor-pointer hover:opacity-85 transition-opacity"
          >
            <Avatar
              name={senderName}
              size={32}
              online={!!senderContact?.on}
              index={senderContact?.i ?? 0}
              imgUrl={senderContact?.imgUrl}
            />
          </button>
        )}
        {isMe && isFirstInGroup && (
          <Avatar
            name={currentUser.name}
            size={32}
            online={currentUser.vis}
            index={currentUser.av}
            imgUrl={currentUser.imgUrl}
          />
        )}
      </div>

      {/* Bubble Core */}
      <div
        className={`min-w-0 max-w-[80%] md:max-w-[min(520px,70%)] flex flex-col ${
          isMe ? 'items-end' : 'items-start'
        }`}
      >
        {/* Sender Name with Indicator Color Tag */}
        {!isMe && isFirstInGroup && (
          <button
            type="button"
            onClick={() => onOpenProfile(senderName)}
            className="flex items-center gap-1.5 mb-1.5 ml-1 text-left cursor-pointer group/name"
          >
            {/* Color dot indicator */}
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: accent.bar }}
            />
            <span
              className="text-[11.5px] font-semibold tracking-tight transition-opacity hover:opacity-100"
              style={{ color: accent.text }}
            >
              {senderName}
            </span>
          </button>
        )}

        {/* Message Container:
            - Outgoing: Soft Pastel Lavender #ceb5ff with Dark Text #181228 (from user reference image!)
            - Incoming: Dark Charcoal #1b1c24 with White Text
        */}
        <div
          className={`relative rounded-2xl px-4 py-3 text-[14px] leading-relaxed break-words max-w-full shadow-sm transition-all ${
            isMe
              ? 'bg-[#ceb5ff] text-[#181228] font-medium rounded-br-[4px]'
              : 'bg-[#1b1c24] text-[#eeeff1] border border-white/8 rounded-bl-[4px]'
          } ${!isFirstInGroup ? (isMe ? 'rounded-tr-[6px]' : 'rounded-tl-[6px]') : ''} ${
            message.pinned ? 'ring-2 ring-amber-400/60' : ''
          }`}
          style={
            !isMe
              ? { borderLeftWidth: '3px', borderLeftColor: accent.bar }
              : undefined
          }
        >
          {/* Forwarded Header */}
          {message.fwd && (
            <p
              className={`text-[11px] mb-1.5 flex items-center gap-1 select-none ${
                isMe ? 'text-[#181228]/70' : 'text-white/50'
              }`}
            >
              <Share2 className="w-3 h-3 rotate-180" />
              Forwarded message
            </p>
          )}

          {/* Pinned Marker */}
          {message.pinned && (
            <div
              className={`flex items-center gap-1 text-[11px] font-semibold mb-1 select-none ${
                isMe ? 'text-amber-900' : 'text-amber-300'
              }`}
            >
              <Pin className="w-3 h-3 fill-current" />
              Pinned message
            </div>
          )}

          {/* Replied Quotation Preview */}
          {message.reply && (
            <button
              type="button"
              onClick={() => message.reply?.id && onScrollToMessage?.(message.reply.id)}
              className={`mb-2.5 text-left block w-full rounded-xl border-l-2 border-current px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
                isMe
                  ? 'bg-black/10 hover:bg-black/15 text-[#181228]'
                  : 'bg-white/5 hover:bg-white/10 text-white/90'
              }`}
            >
              <span className="font-bold block truncate">{message.reply.who}</span>
              <span className="block opacity-75 truncate line-clamp-1">
                {message.reply.text}
              </span>
            </button>
          )}

          {/* Image Content */}
          {message.kind === 'img' && (
            <button
              type="button"
              onClick={() => onOpenImage(message.v, message.imgUrl, message.t)}
              className="group/img relative mb-2 block w-64 max-w-full rounded-xl overflow-hidden border border-black/10 cursor-pointer shadow-sm hover:brightness-105 transition-all text-left"
            >
              {message.imgUrl ? (
                <img
                  src={message.imgUrl}
                  alt={message.t || 'Image'}
                  className="w-full aspect-[4/3] object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div
                  className="w-full aspect-[4/3] flex items-center justify-center"
                  style={{
                    background: `linear-gradient(${120 + (message.v || 0) * 40}deg, #181a20, #363a45)`,
                  }}
                >
                  <svg viewBox="0 0 120 90" className="w-full h-full p-6 opacity-75">
                    <circle cx={30 + (message.v || 0) * 20} cy="26" r="10" fill="#ffffff" />
                    <path
                      d={
                        (message.v || 0) % 2
                          ? 'M0 90V55l30-22 30 24 25-14 35 30v17z'
                          : 'M0 90V62l25-18 28 22 32-30 35 34v20z'
                      }
                      fill="#0b0c0e"
                    />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-xs bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-full font-medium shadow-sm">
                  Click to expand
                </span>
              </div>
            </button>
          )}

          {/* File Content */}
          {message.kind === 'file' && message.file && (
            <div
              className={`flex items-center gap-3 p-2.5 rounded-xl mb-1.5 min-w-[210px] border ${
                isMe
                  ? 'bg-black/10 border-black/10 text-[#181228]'
                  : 'bg-white/5 border-white/10 text-white'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg grid place-items-center shrink-0 ${
                  isMe ? 'bg-black/15 text-[#181228]' : 'bg-white/10 text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold truncate leading-tight">
                  {message.file.name}
                </p>
                <p className="text-[11px] opacity-75 mt-0.5">{message.file.size}</p>
              </div>
              <a
                href="#download"
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Downloading ${message.file?.name}`);
                }}
                title="Download file"
                className="p-1.5 rounded-lg hover:bg-black/10 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Web Link Card Content */}
          {message.kind === 'link' && message.link && (
            <a
              href={`https://${message.link.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`block rounded-xl p-3 mb-1 min-w-[220px] max-w-full border transition-all cursor-pointer ${
                isMe
                  ? 'bg-black/10 border-black/15 hover:bg-black/15 text-[#181228]'
                  : 'bg-[#14151a] border-white/10 hover:border-white/20 text-white'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[11px] opacity-75 mb-1 font-mono">
                <ExternalLink className="w-3 h-3" />
                <span className="truncate">{message.link.url}</span>
              </div>
              <p className="text-xs font-bold leading-tight line-clamp-1">
                {message.link.title}
              </p>
              {message.link.desc && (
                <p className="text-[11px] opacity-75 mt-1 line-clamp-2">
                  {message.link.desc}
                </p>
              )}
            </a>
          )}

          {/* Voice Memo Content */}
          {message.kind === 'voice' && (
            <div className="flex items-center gap-3 py-1 px-1 min-w-[200px]">
              <button
                type="button"
                onClick={() => setIsPlayingVoice(!isPlayingVoice)}
                className={`w-8 h-8 rounded-full grid place-items-center transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm ${
                  isMe
                    ? 'bg-[#181228] text-[#ceb5ff]'
                    : 'bg-[#caa6fc] text-[#181228]'
                }`}
              >
                {isPlayingVoice ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>
              <div className="flex-1 flex items-center gap-0.5 h-6">
                {[12, 20, 8, 16, 24, 18, 14, 22, 10, 19, 15, 23, 11, 17].map(
                  (h, idx) => (
                    <span
                      key={idx}
                      className={`w-1 rounded-full transition-all duration-200 ${
                        isMe
                          ? isPlayingVoice
                            ? 'bg-[#181228] animate-pulse'
                            : 'bg-[#181228]/50'
                          : isPlayingVoice
                          ? 'bg-white animate-pulse'
                          : 'bg-white/40'
                      }`}
                      style={{ height: `${h}px` }}
                    />
                  )
                )}
              </div>
              <span className="text-[11px] font-mono opacity-80">
                {message.voiceDuration || '0:14'}
              </span>
            </div>
          )}

          {/* Text Message */}
          {message.t && message.kind !== 'file' && (
            <span
              className={
                message.kind === 'emoji'
                  ? 'text-4xl leading-tight block select-none py-1'
                  : ''
              }
            >
              {message.t}
            </span>
          )}

          {/* Interactive Rating Component (as featured in reference screenshot!) */}
          {message.t.toLowerCase().includes('rate your experience') && (
            <div className="mt-3 pt-2 border-t border-black/10 flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingStars(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= ratingStars
                          ? 'fill-[#6956e5] text-[#6956e5]'
                          : 'text-[#181228]/30'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => alert(`Thank you for rating ${ratingStars}/5 stars!`)}
                className="px-3 py-1 rounded-lg bg-[#6956e5] text-white text-xs font-semibold hover:bg-[#5b48d6] transition-colors cursor-pointer shadow-sm"
              >
                Share Feedback
              </button>
            </div>
          )}
        </div>

        {/* Reaction Badges: Cleanly Nestled Beneath Bubble */}
        {Object.keys(message.rx).length > 0 && (
          <div
            className={`flex items-center gap-1.5 mt-1.5 flex-wrap ${
              isMe ? 'justify-end' : 'justify-start'
            }`}
          >
            {Object.entries(message.rx).map(([emoji, names]) => {
              const hasReacted = names.includes('You');
              return (
                <button
                  key={emoji}
                  type="button"
                  onClick={(e) => handleReactionClick(emoji, e)}
                  title={names.join(', ')}
                  className={`text-xs inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 transition-all shadow-sm cursor-pointer ${
                    hasReacted
                      ? 'bg-[#caa6fc] text-[#181228] font-bold ring-1 ring-[#caa6fc]'
                      : 'bg-[#1e1f28] text-white/80 hover:bg-[#272834] border border-white/10'
                  }`}
                >
                  <span>{emoji}</span>
                  {names.length > 1 && (
                    <span className="text-[10px] font-semibold">{names.length}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Meta (Timestamp + Read Receipts) */}
      <div className="self-end mb-1 shrink-0 flex items-center gap-1 text-[11px] text-white/40 select-none font-mono">
        <span>{message.time}</span>
        {isMe && (
          <span className="inline-flex items-center">
            {message.st === 'sending' && (
              <span className="w-3 h-3 rounded-full border border-white/40 border-t-transparent animate-spin" />
            )}
            {message.st === 'sent' && (
              <Check className="w-3.5 h-3.5 text-white/40" />
            )}
            {message.st === 'delivered' && (
              <CheckCheck className="w-3.5 h-3.5 text-white/50" />
            )}
            {message.st === 'read' && (
              <CheckCheck className="w-3.5 h-3.5 text-[#caa6fc] font-bold" />
            )}
          </span>
        )}
      </div>

      {/* Quick Action Floating Bar on Hover */}
      <div
        className={`opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 absolute -top-8 ${
          isMe ? 'right-2' : 'left-2'
        } z-20 flex items-center gap-1 bg-[#1a1b24] border border-white/10 rounded-full px-2 py-0.5 shadow-xl backdrop-blur-md`}
      >
        {/* Quick Reactions */}
        {QUICK_EMOJIS.slice(0, 4).map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={(e) => handleReactionClick(emoji, e)}
            className="w-6 h-6 rounded-full flex items-center justify-center text-sm hover:scale-125 transition-transform cursor-pointer"
          >
            {emoji}
          </button>
        ))}

        <div className="w-px h-3.5 bg-white/10 mx-0.5" />

        {/* Reply */}
        <button
          type="button"
          title="Reply"
          onClick={() => onReply(message)}
          className="p-1 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        >
          <CornerDownRight className="w-3.5 h-3.5" />
        </button>

        {/* More Actions Dropdown Toggle */}
        <div className="relative">
          <button
            type="button"
            title="More actions"
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.12 }}
                className={`absolute top-8 ${
                  isMe ? 'right-0' : 'left-0'
                } w-44 bg-[#1b1c26] border border-white/10 rounded-xl shadow-2xl py-1 z-30 text-xs`}
              >
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="w-full flex items-center gap-2 px-3 py-2 text-white/80 hover:bg-white/10 text-left cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-white/50" />
                  Copy text
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onTogglePin(message);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-white/80 hover:bg-white/10 text-left cursor-pointer"
                >
                  <Pin className="w-3.5 h-3.5 text-white/50" />
                  {message.pinned ? 'Unpin message' : 'Pin message'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onForward(message);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-white/80 hover:bg-white/10 text-left cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-white/50" />
                  Forward...
                </button>

                {!isMe && (
                  <button
                    type="button"
                    onClick={() => {
                      onReportMessage?.(message);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-amber-400/90 hover:bg-amber-400/10 text-left cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5 text-amber-400" />
                    Report message
                  </button>
                )}

                <div className="h-px bg-white/10 my-1" />
                <button
                  type="button"
                  onClick={() => {
                    onDelete(message);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 text-left cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete message
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
