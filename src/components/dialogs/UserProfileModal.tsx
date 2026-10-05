import React, { useState } from 'react';
import { Dialog } from '../common/Dialog';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { Tabs } from '../common/Tabs';
import { MessageSquare, Star, VolumeX, Volume2, FileText, Link2, ExternalLink, Download, Flag } from 'lucide-react';
import { Conversation, UserProfile } from '../../types';
import { PEOPLE } from '../../data/mockData';

interface UserProfileModalProps {
  isOpen: boolean;
  name: string | null;
  activeConversationName?: string | null;
  onClose: () => void;
  currentUser: UserProfile;
  conversations: Conversation[];
  onStartMessage: (name: string) => void;
  onOpenImage: (v?: number, src?: string, caption?: string) => void;
  onToggleFavorite: (id: number) => void;
  onToggleMute: (id: number) => void;
  onReportUser: (name: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  name,
  activeConversationName,
  onClose,
  currentUser,
  conversations,
  onStartMessage,
  onOpenImage,
  onToggleFavorite,
  onToggleMute,
  onReportUser,
}) => {
  const [activeTab, setActiveTab] = useState<'media' | 'docs' | 'links'>('media');

  if (!isOpen || !name) return null;

  const isMe = name === currentUser.name;
  const isAlreadyInThisChat = activeConversationName === name;
  const person = !isMe ? PEOPLE[name] : null;

  // Find DM conversation if exists
  const dmConversation = conversations.find(
    (c) => !c.group && c.name.toLowerCase() === name.toLowerCase()
  );

  const sharedMessages = dmConversation
    ? dmConversation.msgs.filter((m) => !m.del && !m.sys)
    : [];

  const mediaList = sharedMessages.filter((m) => m.kind === 'img');
  const docsList = sharedMessages.filter((m) => m.kind === 'file' && m.file);
  const linksList = sharedMessages.filter((m) => m.kind === 'link' && m.link);

  const tabsConfig = [
    { id: 'media', label: 'Media', count: mediaList.length },
    { id: 'docs', label: 'Docs', count: docsList.length },
    { id: 'links', label: 'Links', count: linksList.length },
  ];

  return (
    <Dialog
      isOpen={isOpen}
      title="Contact Profile"
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <div className="space-y-5">
        {/* Profile Card */}
        <div className="flex items-center gap-4">
          <Avatar
            name={name}
            size={68}
            online={isMe ? currentUser.vis : !!person?.on}
            index={isMe ? currentUser.av : person?.i ?? 0}
            imgUrl={isMe ? currentUser.imgUrl : (person?.imgUrl || dmConversation?.imgUrl)}
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-white truncate">
              {name} {isMe ? '(You)' : ''}
            </h3>
            <p className="text-xs text-white/50 font-mono">
              @{isMe ? currentUser.user : person?.u || 'user'} ·{' '}
              {isMe
                ? 'Current User'
                : person?.on
                ? 'Online now'
                : person?.seen || 'Offline'}
            </p>
            <p className="text-xs text-white/70 mt-1.5 leading-relaxed">
              {isMe ? currentUser.bio : person?.bio || 'nook team member'}
            </p>
          </div>
        </div>

        {/* Action Buttons: Never show redundant "Message" if already chatting with this contact! */}
        <div className="flex gap-2 flex-wrap">
          {!isMe && !isAlreadyInThisChat && (
            <Button
              className="flex-1 gap-1.5 cursor-pointer font-semibold"
              onClick={() => {
                onStartMessage(name);
                onClose();
              }}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Message</span>
            </Button>
          )}

          {dmConversation && (
            <>
              <Button
                variant={dmConversation.fav ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => onToggleFavorite(dmConversation.id)}
                className="cursor-pointer"
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    dmConversation.fav ? 'fill-amber-400 text-amber-400' : ''
                  }`}
                />
                {dmConversation.fav ? 'Favorited' : 'Favorite'}
              </Button>
              <Button
                variant={dmConversation.mute ? 'danger' : 'outline'}
                size="sm"
                onClick={() => onToggleMute(dmConversation.id)}
                className="cursor-pointer"
              >
                {dmConversation.mute ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    Unmute
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    Mute
                  </>
                )}
              </Button>
            </>
          )}

          {!isMe && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onReportUser(name);
              }}
              className="text-amber-400/90 hover:text-amber-300 hover:bg-amber-400/10 cursor-pointer"
              title="Report user"
            >
              <Flag className="w-3.5 h-3.5 mr-1" />
              Report
            </Button>
          )}
        </div>

        {/* Shared items tabs */}
        {dmConversation && (
          <div className="space-y-2 pt-2 border-t border-white/5">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block">
              Shared in chat
            </span>
            <Tabs
              items={tabsConfig}
              value={activeTab}
              onChange={(val) => setActiveTab(val as any)}
              label="Shared items"
            />

            <div className="min-h-[140px] pt-1">
              {activeTab === 'media' && (
                mediaList.length === 0 ? (
                  <p className="text-center py-8 text-xs text-white/40">
                    No photos shared yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {mediaList.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => onOpenImage(m.v, m.imgUrl, m.t)}
                        className="aspect-[4/3] rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all hover:scale-[1.02] cursor-pointer"
                        style={{
                          background: `linear-gradient(${120 + (m.v || 0) * 40}deg, #1d1f26, #363945)`,
                        }}
                      >
                        <svg viewBox="0 0 120 90" className="w-full h-full p-3 opacity-70">
                          <circle cx={30 + (m.v || 0) * 20} cy="26" r="9" fill="#ffffff" />
                          <path
                            d={
                              (m.v || 0) % 2
                                ? 'M0 90V55l30-22 30 24 25-14 35 30v17z'
                                : 'M0 90V62l25-18 28 22 32-30 35 34v20z'
                            }
                            fill="#0b0c0e"
                          />
                        </svg>
                      </button>
                    ))}
                  </div>
                )
              )}

              {activeTab === 'docs' && (
                docsList.length === 0 ? (
                  <p className="text-center py-8 text-xs text-white/40">
                    No documents shared yet.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {docsList.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-left"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-white/80 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate">
                              {m.file?.name}
                            </p>
                            <p className="text-[10px] text-white/40">{m.file?.size}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => alert(`Downloading ${m.file?.name}`)}
                          className="p-1 rounded-md text-white/40 hover:text-white cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )
              )}

              {activeTab === 'links' && (
                linksList.length === 0 ? (
                  <p className="text-center py-8 text-xs text-white/40">
                    No links shared yet.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {linksList.map((m) => (
                      <a
                        key={m.id}
                        href={`https://${m.link?.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all text-left cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-white/50 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-white truncate">
                            {m.link?.title}
                          </p>
                          <p className="text-[10px] text-white/40 truncate">
                            {m.link?.url}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};
