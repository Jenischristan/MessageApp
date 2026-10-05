import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, Menu, Plus, MessageSquare } from 'lucide-react';
import { Conversation, FilterTab } from '../../types';
import { Input } from '../common/Input';
import { Tabs } from '../common/Tabs';
import { Button } from '../common/Button';
import { ConversationItem } from './ConversationItem';

interface SidebarProps {
  conversations: Conversation[];
  activeId: number | null;
  onSelectConversation: (id: number) => void;
  filterTab: FilterTab;
  onFilterTabChange: (tab: FilterTab) => void;
  onOpenNewChat: () => void;
  onOpenMobileMenu: () => void;
  isLoading?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeId,
  onSelectConversation,
  filterTab,
  onFilterTabChange,
  onOpenNewChat,
  onOpenMobileMenu,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter conversations
  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return conversations.filter((c) => {
      // Tab filter
      if (filterTab === 'unread' && c.unread <= 0) return false;
      if (filterTab === 'fav' && !c.fav) return false;
      if (filterTab === 'groups' && !c.group) return false;

      // Query filter
      if (q) {
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesAnyMessage = c.msgs.some(
          (m) => !m.del && !m.sys && m.t.toLowerCase().includes(q)
        );
        return matchesName || matchesAnyMessage;
      }

      return true;
    });
  }, [conversations, filterTab, searchQuery]);

  // Group into Team Messages and Direct Messages
  const teamMessages = useMemo(
    () => filteredList.filter((c) => c.group),
    [filteredList]
  );

  const directMessages = useMemo(
    () => filteredList.filter((c) => !c.group),
    [filteredList]
  );

  // Search hits in messages
  const messageSearchHits = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return conversations
      .flatMap((c) =>
        c.msgs
          .filter((m) => !m.del && !m.sys && m.t && m.t.toLowerCase().includes(q))
          .map((m) => ({ conversation: c, message: m }))
      )
      .slice(0, 5);
  }, [conversations, searchQuery]);

  // Badge counts for tabs
  const tabCounts = useMemo(() => {
    return {
      all: undefined,
      unread: conversations.filter((c) => c.unread > 0).length,
      fav: conversations.filter((c) => c.fav).length,
      groups: conversations.filter((c) => c.group).length,
    };
  }, [conversations]);

  const tabsConfig = [
    { id: 'all', label: 'All', count: undefined },
    { id: 'unread', label: 'Unread', count: tabCounts.unread },
    { id: 'fav', label: 'Favorites', count: tabCounts.fav },
    { id: 'groups', label: 'Groups', count: tabCounts.groups },
  ];

  return (
    <aside
      aria-label="Conversations list"
      className="relative flex flex-col h-full w-full md:w-[320px] lg:w-[340px] shrink-0 bg-[#0f1114] border-r border-white/5 select-none"
    >
      {/* Search Header */}
      <div className="flex items-center gap-2 px-3 pt-3.5 pb-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-10 w-10 text-white/70"
          onClick={onOpenMobileMenu}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="flex-1">
          <Input
            placeholder="Search conversations…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="h-9 text-xs rounded-xl bg-[#14161a]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-3 pb-2">
        <Tabs
          items={tabsConfig}
          value={filterTab}
          onChange={(tab) => onFilterTabChange(tab as FilterTab)}
          label="Filter conversations"
        />
      </div>

      {/* List Container */}
      <div className="flex-1 scr min-h-0 px-2 pb-20">
        {isLoading ? (
          /* Skeleton Loader */
          <div className="space-y-3 p-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <div className="w-11 h-11 rounded-full skeleton-shimmer shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/5 rounded skeleton-shimmer" />
                  <div className="h-2.5 w-4/5 rounded skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          /* Empty State */
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-white/50">
            <div className="w-12 h-12 rounded-2xl bg-[#17191d] border border-white/5 flex items-center justify-center text-white/40 mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-white/80">
              {searchQuery ? 'No conversations found' : 'No conversations'}
            </p>
            <p className="text-xs text-white/40 mt-1 max-w-[200px]">
              {searchQuery
                ? 'Try a different search term or check spelling.'
                : filterTab === 'unread'
                ? "You're all caught up!"
                : filterTab === 'fav'
                ? 'Star a conversation to keep it here.'
                : 'Start a new conversation to get going.'}
            </p>
            {filterTab !== 'all' && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => onFilterTabChange('all')}
              >
                View all chats
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Team Messages Group */}
            {teamMessages.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => toggleSection('team')}
                  className="w-full flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold tracking-wider text-white/40 hover:text-white/70 uppercase transition-colors"
                >
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      !collapsedSections.team ? 'rotate-90' : ''
                    }`}
                  />
                  <span>Team Messages</span>
                  <span className="font-mono text-white/60">
                    ({teamMessages.length})
                  </span>
                </button>

                {!collapsedSections.team && (
                  <div className="mt-1 space-y-0.5">
                    {teamMessages.map((c) => (
                      <ConversationItem
                        key={c.id}
                        conversation={c}
                        isActive={activeId === c.id}
                        onSelect={() => onSelectConversation(c.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Direct Messages Group */}
            {directMessages.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => toggleSection('direct')}
                  className="w-full flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold tracking-wider text-white/40 hover:text-white/70 uppercase transition-colors"
                >
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      !collapsedSections.direct ? 'rotate-90' : ''
                    }`}
                  />
                  <span>Direct Messages</span>
                  <span className="font-mono text-white/60">
                    ({directMessages.length})
                  </span>
                </button>

                {!collapsedSections.direct && (
                  <div className="mt-1 space-y-0.5">
                    {directMessages.map((c) => (
                      <ConversationItem
                        key={c.id}
                        conversation={c}
                        isActive={activeId === c.id}
                        onSelect={() => onSelectConversation(c.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Message Body Search Hits */}
            {messageSearchHits.length > 0 && (
              <div className="pt-2 border-t border-white/5">
                <span className="px-3 text-[11px] font-semibold tracking-wider text-white/40 uppercase block mb-1.5">
                  Matching Messages
                </span>
                <div className="space-y-1">
                  {messageSearchHits.map((hit, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSelectConversation(hit.conversation.id)}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <p className="text-xs font-semibold text-white truncate">
                        {hit.conversation.name}
                      </p>
                      <p className="text-xs text-white/50 truncate mt-0.5">
                        {hit.message.t}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button on Mobile */}
      <Button
        size="icon"
        className="md:hidden absolute right-4 bottom-5 h-12 w-12 rounded-2xl bg-white hover:bg-neutral-200 text-[#08090a] shadow-xl font-bold cursor-pointer"
        aria-label="New conversation"
        onClick={onOpenNewChat}
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </Button>
    </aside>
  );
};
