import React, { useState, useMemo } from 'react';
import {
  X,
  Star,
  VolumeX,
  Volume2,
  FileText,
  Link2,
  Image as ImageIcon,
  Users,
  ChevronRight,
  ExternalLink,
  Download,
  Flag,
  UserPlus,
} from 'lucide-react';
import { Conversation, UserProfile } from '../../types';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { Tabs } from '../common/Tabs';
import { PEOPLE } from '../../data/mockData';

interface ConversationDetailsProps {
  conversation: Conversation;
  currentUser: UserProfile;
  onClose: () => void;
  onToggleFavorite: () => void;
  onToggleMute: () => void;
  onOpenProfile: (name: string) => void;
  onOpenImage: (v?: number, src?: string, caption?: string) => void;
  onReportContact: () => void;
  onAddGroupMembers?: () => void;
}

export const ConversationDetails: React.FC<ConversationDetailsProps> = ({
  conversation,
  currentUser,
  onClose,
  onToggleFavorite,
  onToggleMute,
  onOpenProfile,
  onOpenImage,
  onReportContact,
  onAddGroupMembers,
}) => {
  const [activeTab, setActiveTab] = useState<'members' | 'media' | 'docs' | 'links'>(
    conversation.group ? 'members' : 'media'
  );

  const isGroup = conversation.group;
  const person = !isGroup ? PEOPLE[conversation.name] : null;

  // Extract shared items from chat history
  const validMessages = useMemo(
    () => conversation.msgs.filter((m) => !m.del && !m.sys),
    [conversation.msgs]
  );

  const mediaList = useMemo(
    () => validMessages.filter((m) => m.kind === 'img'),
    [validMessages]
  );

  const docsList = useMemo(
    () => validMessages.filter((m) => m.kind === 'file' && m.file),
    [validMessages]
  );

  const linksList = useMemo(
    () => validMessages.filter((m) => m.kind === 'link' && m.link),
    [validMessages]
  );

  const tabsConfig = [
    ...(isGroup ? [{ id: 'members', label: 'Members', count: conversation.members?.length || 0 }] : []),
    { id: 'media', label: 'Media', count: mediaList.length },
    { id: 'docs', label: 'Docs', count: docsList.length },
    { id: 'links', label: 'Links', count: linksList.length },
  ];

  return (
    <aside className="h-full flex flex-col bg-[#101114] border-l border-white/8 select-text w-full">
      {/* Panel Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-white/8 shrink-0">
        <h3 className="text-sm font-semibold text-white/80">
          {isGroup ? 'Group Information' : 'Contact Details'}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white/50 hover:text-white rounded-lg cursor-pointer"
          onClick={onClose}
          aria-label="Close details"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 scr p-5 space-y-6">
        {/* Profile Card (styled faithfully like the purple card in the user reference image) */}
        <div className="flex flex-col items-center text-center p-5 rounded-3xl bg-gradient-to-b from-[#6956e5] to-[#5542d4] text-white shadow-lg relative overflow-hidden">
          <div className="relative">
            <Avatar
              name={conversation.name}
              size={76}
              online={isGroup ? undefined : !!person?.on}
              index={conversation.i ?? person?.i ?? 0}
              imgUrl={conversation.imgUrl || person?.imgUrl}
              className="ring-4 ring-white/20 shadow-md"
            />
            {isGroup && (
              <span className="absolute -right-1 bottom-0 px-2 py-0.5 rounded-full bg-white text-[11px] font-bold text-[#5542d4] shadow-sm">
                +{conversation.members?.length || 0}
              </span>
            )}
          </div>

          <h4 className="mt-3 text-base font-bold text-white tracking-tight">
            {conversation.name}
          </h4>

          <p className="text-xs text-white/80 mt-0.5 font-mono">
            {isGroup
              ? `${conversation.members?.length || 0} members · Team Group`
              : person?.email || `@${person?.u || 'user'}`}
          </p>

          {!isGroup && person?.bio && (
            <p className="text-xs text-white/90 mt-2 max-w-xs leading-relaxed font-normal">
              {person.bio}
            </p>
          )}

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 mt-4 flex-wrap justify-center">
            <button
              type="button"
              onClick={onToggleFavorite}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                conversation.fav
                  ? 'bg-white text-[#5542d4]'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title="Favorite"
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  conversation.fav ? 'fill-current' : ''
                }`}
              />
              <span>{conversation.fav ? 'Saved' : 'Save'}</span>
            </button>
            <button
              type="button"
              onClick={onToggleMute}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                conversation.mute
                  ? 'bg-red-400 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {conversation.mute ? (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Unmute</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Mute</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onReportContact}
              className="p-2 rounded-xl text-xs font-semibold bg-white/20 text-white hover:bg-white/30 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Report</span>
            </button>
          </div>
        </div>

        {/* Tabbed Shared Content */}
        <div className="space-y-3">
          <Tabs
            items={tabsConfig}
            value={activeTab}
            onChange={(val) => setActiveTab(val as any)}
            label="Shared content filter"
          />

          <div className="min-h-[160px]">
            {/* Members Tab */}
            {activeTab === 'members' && isGroup && (
              <div className="space-y-2">
                {onAddGroupMembers && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 justify-center py-2 text-xs mb-2 cursor-pointer"
                    onClick={onAddGroupMembers}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Add Members</span>
                  </Button>
                )}

                <div className="space-y-1">
                  {conversation.members?.map((member, i) => {
                    const isCurrent = member === currentUser.name;
                    const memberContact = PEOPLE[member];
                    return (
                      <button
                        key={member}
                        type="button"
                        onClick={() => onOpenProfile(member)}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Avatar
                            name={member}
                            size={32}
                            online={isCurrent ? true : !!memberContact?.on}
                            index={isCurrent ? currentUser.av : memberContact?.i ?? 0}
                            imgUrl={isCurrent ? currentUser.imgUrl : memberContact?.imgUrl}
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate">
                              {member} {isCurrent ? '(You)' : ''}
                            </p>
                            <p className="text-[11px] text-white/40 truncate">
                              {isCurrent
                                ? currentUser.bio
                                : memberContact?.bio || 'nook member'}
                            </p>
                          </div>
                        </div>
                        {i < 2 && (
                          <span className="text-[10px] font-semibold text-white/60 bg-white/10 px-2 py-0.5 rounded-full shrink-0">
                            {i === 0 ? 'Admin' : 'Moderator'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && (
              <div>
                {mediaList.length === 0 ? (
                  <div className="text-center py-8 text-xs text-white/40">
                    <ImageIcon className="w-6 h-6 mx-auto mb-1.5 opacity-40" />
                    No photos shared in this chat yet.
                  </div>
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
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'docs' && (
              <div>
                {docsList.length === 0 ? (
                  <div className="text-center py-8 text-xs text-white/40">
                    <FileText className="w-6 h-6 mx-auto mb-1.5 opacity-40" />
                    No documents shared in this chat yet.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {docsList.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all text-left"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-8 h-8 rounded-lg bg-white/10 text-white grid place-items-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate">
                              {m.file?.name}
                            </p>
                            <p className="text-[11px] text-white/40">
                              {m.file?.size} · {m.time}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => alert(`Downloading ${m.file?.name}`)}
                          className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Links Tab */}
            {activeTab === 'links' && (
              <div>
                {linksList.length === 0 ? (
                  <div className="text-center py-8 text-xs text-white/40">
                    <Link2 className="w-6 h-6 mx-auto mb-1.5 opacity-40" />
                    No links shared in this chat yet.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {linksList.map((m) => (
                      <a
                        key={m.id}
                        href={`https://${m.link?.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all text-left group cursor-pointer"
                      >
                        <span className="w-7 h-7 rounded-lg bg-white/10 text-white/70 grid place-items-center shrink-0 mt-0.5">
                          <ExternalLink className="w-3.5 h-3.5 group-hover:text-white" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-white truncate group-hover:underline">
                            {m.link?.title}
                          </p>
                          <p className="text-[11px] text-white/40 truncate">
                            {m.link?.url}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
