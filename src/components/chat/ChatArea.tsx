import React, { useRef, useEffect, useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { Conversation, Message, MessageReply, UserProfile, FileAttachment, LinkAttachment } from '../../types';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { InChatSearch } from './InChatSearch';
import { PinnedBanner } from './PinnedBanner';
import { ImageLightbox } from './ImageLightbox';
import { AttachModal } from './AttachModal';
import { createMessage, now, PEOPLE } from '../../data/mockData';
import { playSendSound, playReceiveSound } from '../../utils/audio';

interface ChatAreaProps {
  conversation: Conversation;
  currentUser: UserProfile;
  soundEnabled?: boolean;
  enterToSend?: boolean;
  isDetailsOpen: boolean;
  onBack: () => void;
  onToggleDetails: () => void;
  onUpdateConversation: (id: number, updater: (c: Conversation) => Conversation) => void;
  onOpenProfile: (name: string) => void;
  onToast: (msg: string) => void;
  onForwardMessageToDialog: (message: Message, conversation: Conversation) => void;
  onReportContact: () => void;
  onReportMessage: (message: Message) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  conversation,
  currentUser,
  soundEnabled = true,
  enterToSend = true,
  isDetailsOpen,
  onBack,
  onToggleDetails,
  onUpdateConversation,
  onOpenProfile,
  onToast,
  onForwardMessageToDialog,
  onReportContact,
  onReportMessage,
}) => {
  const [replyTarget, setReplyTarget] = useState<MessageReply | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchIndex, setSearchIndex] = useState(0);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [newUnreadCount, setNewUnreadCount] = useState(0);

  // Attach modal state
  const [isAttachOpen, setIsAttachOpen] = useState(false);

  // Lightbox state
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    v?: number;
    src?: string;
    caption?: string;
  }>({ isOpen: false });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Get distance from bottom
  const getDistanceFromBottom = () => {
    const el = scrollContainerRef.current;
    if (!el) return 0;
    return el.scrollHeight - el.scrollTop - el.clientHeight;
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior });
      setNewUnreadCount(0);
    }
  };

  // Initial scroll on mount or conversation switch
  useEffect(() => {
    scrollToBottom('auto');
  }, [conversation.id]);

  // Handle new messages incoming
  useEffect(() => {
    const lastMsg = conversation.msgs[conversation.msgs.length - 1];
    if (lastMsg?.me || getDistanceFromBottom() < 300) {
      scrollToBottom('smooth');
    } else {
      setNewUnreadCount((c) => c + 1);
    }
  }, [conversation.msgs.length]);

  // Handle scroll listener
  const handleScroll = () => {
    const dist = getDistanceFromBottom();
    setShowScrollBottom(dist > 250);
    if (dist < 50) {
      setNewUnreadCount(0);
    }
  };

  // Search matches
  const searchMatches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return conversation.msgs
      .filter((m) => !m.del && !m.sys && m.t && m.t.toLowerCase().includes(q))
      .map((m) => m.id);
  }, [conversation.msgs, searchQuery]);

  useEffect(() => {
    if (searchMatches.length > 0) {
      const targetId = searchMatches[searchIndex % searchMatches.length];
      scrollToMessage(targetId);
    }
  }, [searchIndex, searchMatches]);

  const scrollToMessage = (id: number) => {
    const el = document.getElementById(`msg-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-[#0b69c7]', 'rounded-2xl');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-[#0b69c7]', 'rounded-2xl');
      }, 1500);
    }
  };

  // Pinned messages in this chat
  const pinnedMessages = useMemo(
    () => conversation.msgs.filter((m) => m.pinned && !m.del),
    [conversation.msgs]
  );

  // Send new text message
  const handleSendMessage = (text: string) => {
    playSendSound(soundEnabled);
    const newMsg = createMessage(true, text, now(), {
      st: 'sending',
      reply: replyTarget || undefined,
    });

    setReplyTarget(null);

    // Update conversation with new message
    onUpdateConversation(conversation.id, (c) => ({
      ...c,
      msgs: [...c.msgs, newMsg],
    }));

    // Status progression: sending -> sent -> delivered
    setTimeout(() => {
      onUpdateConversation(conversation.id, (c) => ({
        ...c,
        msgs: c.msgs.map((m) => (m.id === newMsg.id ? { ...m, st: 'sent' } : m)),
      }));
    }, 450);

    setTimeout(() => {
      onUpdateConversation(conversation.id, (c) => ({
        ...c,
        msgs: c.msgs.map((m) => (m.id === newMsg.id ? { ...m, st: 'delivered' } : m)),
      }));
    }, 1100);

    // Realistic auto-reply simulation if contact is online or in group
    const isAlex = conversation.name === 'Alex Morgan';
    const isSarah = conversation.name === 'Sarah Wilson';
    const isGroup = conversation.group;

    if (isAlex || isSarah || isGroup) {
      // Mark as read after 2.5s
      setTimeout(() => {
        onUpdateConversation(conversation.id, (c) => ({
          ...c,
          msgs: c.msgs.map((m) => (m.id === newMsg.id ? { ...m, st: 'read' } : m)),
        }));
      }, 2400);

      // Typing simulation
      setTimeout(() => {
        onUpdateConversation(conversation.id, (c) => ({
          ...c,
          typing: true,
        }));
      }, 3000);

      // Reply message
      setTimeout(() => {
        const replyPool = isGroup
          ? [
              'Approved from my end. Let’s ship this sprint!',
              'I have updated the team Figma tokens with these specs.',
              'Looks clean! Double checking the mobile viewport breakpoints.',
            ]
          : isAlex
          ? [
              'Sounds like a plan! Let’s meet at 6.',
              'Checked the numbers, Q4 forecast looks solid.',
              'Just reviewed the prototype, transitions are super smooth.',
            ]
          : [
              'Awesome, exporting the high-res SVGs right now!',
              'Love the dark palette tokens, they render beautifully.',
              'Just synced the latest Figma icon library.',
            ];

        const randomReply =
          replyPool[Math.floor(Math.random() * replyPool.length)];

        playReceiveSound(soundEnabled);

        onUpdateConversation(conversation.id, (c) => ({
          ...c,
          typing: false,
          msgs: [
            ...c.msgs,
            createMessage(false, randomReply, now(), {
              who: isGroup ? c.members?.[0] || 'Maya Chen' : undefined,
            }),
          ],
        }));
      }, 5500);
    }
  };

  // Send voice note
  const handleSendVoice = (duration: string) => {
    playSendSound(soundEnabled);
    const newMsg = createMessage(true, '', now(), {
      st: 'sent',
      kind: 'voice',
      voiceDuration: duration,
    });
    onUpdateConversation(conversation.id, (c) => ({
      ...c,
      msgs: [...c.msgs, newMsg],
    }));
    onToast('Voice message sent');
  };

  // Attach Image
  const handleAttachImage = (v: number, caption: string) => {
    playSendSound(soundEnabled);
    const newMsg = createMessage(true, caption, now(), {
      st: 'sent',
      kind: 'img',
      v,
    });
    onUpdateConversation(conversation.id, (c) => ({
      ...c,
      msgs: [...c.msgs, newMsg],
    }));
    onToast('Photo attached');
  };

  // Attach File
  const handleAttachFile = (file: FileAttachment, caption?: string) => {
    playSendSound(soundEnabled);
    const newMsg = createMessage(true, caption || '', now(), {
      st: 'sent',
      kind: 'file',
      file,
    });
    onUpdateConversation(conversation.id, (c) => ({
      ...c,
      msgs: [...c.msgs, newMsg],
    }));
    onToast('Document attached');
  };

  // Attach Link
  const handleAttachLink = (link: LinkAttachment) => {
    playSendSound(soundEnabled);
    const newMsg = createMessage(true, '', now(), {
      st: 'sent',
      kind: 'link',
      link,
    });
    onUpdateConversation(conversation.id, (c) => ({
      ...c,
      msgs: [...c.msgs, newMsg],
    }));
    onToast('Link shared');
  };

  // Reactions
  const handleReact = (message: Message, emoji: string) => {
    onUpdateConversation(conversation.id, (c) => ({
      ...c,
      msgs: c.msgs.map((m) => {
        if (m.id !== message.id) return m;
        const currentRx = { ...m.rx };
        const userList = currentRx[emoji] || [];
        const hasReacted = userList.includes('You');

        if (hasReacted) {
          const filtered = userList.filter((u) => u !== 'You');
          if (filtered.length > 0) {
            currentRx[emoji] = filtered;
          } else {
            delete currentRx[emoji];
          }
        } else {
          currentRx[emoji] = [...userList, 'You'];
        }

        return { ...m, rx: currentRx };
      }),
    }));
  };

  // Pin toggle
  const handleTogglePin = (message: Message) => {
    const isPinned = !message.pinned;
    onUpdateConversation(conversation.id, (c) => ({
      ...c,
      msgs: c.msgs.map((m) => (m.id === message.id ? { ...m, pinned: isPinned } : m)),
    }));
    onToast(isPinned ? 'Message pinned' : 'Message unpinned');
  };

  // Delete message
  const handleDeleteMessage = (message: Message) => {
    onUpdateConversation(conversation.id, (c) => ({
      ...c,
      msgs: c.msgs.map((m) =>
        m.id === message.id ? { ...m, del: true, t: '', rx: {} } : m
      ),
    }));
    onToast('Message deleted');
  };

  // Group messages by day
  let currentDay = '';

  return (
    <section
      className="flex flex-col h-full min-w-0 bg-[#08090a] relative select-text"
      aria-label={`Conversation with ${conversation.name}`}
    >
      {/* Header */}
      <ChatHeader
        conversation={conversation}
        isDetailsOpen={isDetailsOpen}
        isSearchOpen={isSearchOpen}
        onBack={onBack}
        onToggleSearch={() => {
          setIsSearchOpen(!isSearchOpen);
          if (isSearchOpen) setSearchQuery('');
        }}
        onToggleDetails={onToggleDetails}
        onOpenProfile={() => onOpenProfile(conversation.name)}
        onToggleFavorite={() =>
          onUpdateConversation(conversation.id, (c) => ({ ...c, fav: !c.fav }))
        }
        onToggleMute={() =>
          onUpdateConversation(conversation.id, (c) => ({ ...c, mute: !c.mute }))
        }
        onReportContact={onReportContact}
      />

      {/* In-chat search dropdown */}
      <InChatSearch
        isOpen={isSearchOpen}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        matchCount={searchMatches.length}
        currentIndex={searchIndex}
        onNext={() => setSearchIndex((i) => i + 1)}
        onPrev={() => setSearchIndex((i) => Math.max(0, i - 1))}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchQuery('');
        }}
      />

      {/* Pinned Messages Banner */}
      <PinnedBanner
        pinnedMessages={pinnedMessages}
        onScrollTo={scrollToMessage}
        onUnpin={handleTogglePin}
      />

      {/* Message Stream */}
      <div className="relative flex-1 min-h-0">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="h-full scr px-3 md:px-6 py-4"
          role="log"
          aria-label="Messages"
        >
          <div className="max-w-4xl mx-auto space-y-3">
            {conversation.msgs.map((msg, idx) => {
              const prevMsg = conversation.msgs[idx - 1];
              const isNewDay = msg.day !== currentDay;
              currentDay = msg.day;

              const isFirstInGroup =
                !prevMsg ||
                isNewDay ||
                prevMsg.sys ||
                prevMsg.me !== msg.me ||
                prevMsg.who !== msg.who;

              return (
                <React.Fragment key={msg.id}>
                  {/* Day Divider */}
                  {isNewDay && (
                    <div className="flex justify-center my-3 select-none">
                      <span className="text-[11px] font-medium tracking-wide text-white/50 bg-[#16181d] border border-white/5 px-3 py-0.5 rounded-full shadow-sm">
                        {msg.day}
                      </span>
                    </div>
                  )}

                  <MessageBubble
                    message={msg}
                    isFirstInGroup={isFirstInGroup}
                    isGroup={!!conversation.group}
                    who0={conversation.name}
                    currentUser={currentUser}
                    soundEnabled={soundEnabled}
                    onOpenProfile={onOpenProfile}
                    onReply={(m) =>
                      setReplyTarget({
                        id: m.id,
                        who: m.me ? 'You' : (m.who || conversation.name).split(' ')[0],
                        text: m.t || (m.kind === 'img' ? 'Photo' : 'Attachment'),
                      })
                    }
                    onForward={(m) => onForwardMessageToDialog(m, conversation)}
                    onDelete={handleDeleteMessage}
                    onTogglePin={handleTogglePin}
                    onReact={handleReact}
                    onOpenImage={(v, src, caption) =>
                      setLightboxState({ isOpen: true, v, src, caption })
                    }
                    onScrollToMessage={scrollToMessage}
                    onReportMessage={onReportMessage}
                  />
                </React.Fragment>
              );
            })}

            {/* Typing Indicator */}
            {conversation.typing && (
              <div className="flex items-center gap-2 pt-2 animate-in fade-in duration-200">
                <div className="bg-[#181a1e] border border-white/5 rounded-2xl rounded-bl-sm px-3.5 py-2.5 flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60 typing-dot" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60 typing-dot" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60 typing-dot" />
                </div>
                <span className="text-xs text-white/40">
                  {conversation.group
                    ? `${conversation.members?.[0] || 'Someone'} is typing…`
                    : `${conversation.name.split(' ')[0]} is typing…`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Scroll To Bottom Button */}
        {showScrollBottom && (
          <button
            type="button"
            onClick={() => scrollToBottom('smooth')}
            aria-label="Scroll to bottom"
            className="absolute right-5 bottom-4 z-20 h-10 w-10 rounded-full bg-[#1e2026] hover:bg-[#272a32] border border-white/10 text-white shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronDown className="w-5 h-5 text-white/80" />
            {newUnreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#0b69c7] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-[#0d0e11] tabular-nums">
                {newUnreadCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSendMessage}
        onSendVoice={handleSendVoice}
        replyTarget={replyTarget}
        onCancelReply={() => setReplyTarget(null)}
        onOpenAttach={() => setIsAttachOpen(true)}
        enterToSend={enterToSend}
      />

      {/* Attach Modal */}
      <AttachModal
        isOpen={isAttachOpen}
        onClose={() => setIsAttachOpen(false)}
        onAttachImage={handleAttachImage}
        onAttachFile={handleAttachFile}
        onAttachLink={handleAttachLink}
      />

      {/* Image Lightbox */}
      <ImageLightbox
        isOpen={lightboxState.isOpen}
        src={lightboxState.src}
        v={lightboxState.v}
        caption={lightboxState.caption}
        onClose={() => setLightboxState({ isOpen: false })}
      />
    </section>
  );
};
