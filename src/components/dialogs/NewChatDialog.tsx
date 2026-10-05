import React, { useState, useMemo } from 'react';
import { Search, Users, MessageSquare, Check, X } from 'lucide-react';
import { Dialog } from '../common/Dialog';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { PEOPLE } from '../../data/mockData';

interface NewChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContact: (name: string) => void;
  onCreateGroup: (name: string, members: string[], avatarIndex: number) => void;
}

export const NewChatDialog: React.FC<NewChatDialogProps> = ({
  isOpen,
  onClose,
  onSelectContact,
  onCreateGroup,
}) => {
  const [mode, setMode] = useState<'dm' | 'group'>('dm');
  const [query, setQuery] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupAvatarIndex, setGroupAvatarIndex] = useState(0);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const contactEntries = useMemo(() => Object.entries(PEOPLE), []);

  const filteredPeople = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contactEntries;
    return contactEntries.filter(
      ([name, data]) =>
        name.toLowerCase().includes(q) ||
        data.u.toLowerCase().includes(q) ||
        data.bio.toLowerCase().includes(q)
    );
  }, [query, contactEntries]);

  const toggleMemberSelection = (name: string) => {
    setSelectedMembers((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]
    );
  };

  const handleCreateGroupSubmit = () => {
    if (!groupName.trim() || selectedMembers.length === 0) return;
    onCreateGroup(groupName.trim(), selectedMembers, groupAvatarIndex);
    // Reset form
    setGroupName('');
    setSelectedMembers([]);
    setGroupAvatarIndex(0);
    setMode('dm');
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      title={mode === 'dm' ? 'New Message' : 'Create New Group'}
      description={
        mode === 'dm'
          ? 'Start a private encrypted direct conversation'
          : 'Create a group for team projects and collaborative discussions'
      }
      onClose={onClose}
      maxWidth="sm:max-w-md"
    >
      <div className="space-y-4">
        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#12131a] rounded-xl border border-[#262838]">
          <button
            type="button"
            onClick={() => setMode('dm')}
            className={`flex items-center justify-center gap-2 py-2 sm:py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'dm'
                ? 'bg-[#6956e5] text-white shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-[#1a1c27]'
            }`}
          >
            <MessageSquare className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            Direct Message
          </button>
          <button
            type="button"
            onClick={() => setMode('group')}
            className={`flex items-center justify-center gap-2 py-2 sm:py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'group'
                ? 'bg-[#6956e5] text-white shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-[#1a1c27]'
            }`}
          >
            <Users className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            New Group
          </button>
        </div>

        {/* DM MODE */}
        {mode === 'dm' && (
          <div className="space-y-3">
            <div className="relative">
              <Input
                placeholder="Search contacts by name, handle, or bio…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
                rightElement={
                  query ? (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="p-1 rounded-md text-white/40 hover:text-white transition-colors"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : undefined
                }
                className="h-10 sm:h-9 text-xs bg-[#12131a]"
              />
            </div>

            <div className="max-h-[50dvh] sm:max-h-72 scr space-y-1 pr-1 overscroll-contain">
              {filteredPeople.length === 0 ? (
                <div className="text-center py-8 text-xs text-white/40">
                  No contacts found matching &ldquo;{query}&rdquo;
                </div>
              ) : (
                filteredPeople.map(([name, data]) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      onSelectContact(name);
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 p-3 sm:p-2.5 rounded-xl hover:bg-[#1a1c28] active:bg-[#222434] transition-colors text-left cursor-pointer group"
                  >
                    <Avatar
                      name={name}
                      size={40}
                      online={!!data.on}
                      index={data.i}
                      imgUrl={data.imgUrl}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white truncate group-hover:text-white transition-colors">
                          {name}
                        </span>
                        <span className="text-[11px] text-white/40 font-mono ml-2 shrink-0">
                          @{data.u}
                        </span>
                      </div>
                      <p className="text-xs text-white/50 truncate mt-0.5">
                        {data.bio}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* GROUP MODE */}
        {mode === 'group' && (
          <div className="space-y-4">
            {/* Group Name & Avatar Icon */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Group Name
                </label>
                <Input
                  placeholder="e.g. Design Tokens Squad, Mobile Team..."
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="h-10 sm:h-9 bg-[#12131a]"
                />
              </div>

              {/* Color theme for group avatar */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#13141e] border border-[#262838]">
                <div className="flex items-center gap-2.5">
                  <Avatar
                    name={groupName || 'Group'}
                    size={36}
                    index={groupAvatarIndex}
                  />
                  <span className="text-xs text-white/70 font-medium">Group avatar style</span>
                </div>
                <div className="flex items-center gap-2">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setGroupAvatarIndex(i)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        groupAvatarIndex === i
                          ? 'ring-2 ring-[#6956e5] ring-offset-2 ring-offset-[#14151e] scale-110'
                          : 'opacity-65 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <Avatar name="G" size={24} index={i} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected members chips */}
            {selectedMembers.length > 0 && (
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block">
                  Selected Members ({selectedMembers.length})
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 scr overscroll-contain">
                  {selectedMembers.map((m) => (
                    <span
                      key={m}
                      className="inline-flex items-center gap-1.5 text-xs bg-[#222434] border border-[#313348] px-2.5 py-1 rounded-full text-white"
                    >
                      <span>{m}</span>
                      <button
                        type="button"
                        onClick={() => toggleMemberSelection(m)}
                        className="hover:text-red-400 cursor-pointer p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Member picker list */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white/70">
                  Select Members
                </span>
                <span className="text-[11px] text-white/40">
                  Click contact to add/remove
                </span>
              </div>

              <div className="max-h-[38dvh] sm:max-h-48 scr space-y-1 pr-1 border border-[#232536] rounded-xl p-1 bg-[#12131a] overscroll-contain">
                {contactEntries.map(([name, data]) => {
                  const isSelected = selectedMembers.includes(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggleMemberSelection(name)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-colors cursor-pointer text-left ${
                        isSelected
                          ? 'bg-[#222434] text-white'
                          : 'hover:bg-[#191a26] active:bg-[#202230] text-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar
                          name={name}
                          size={30}
                          online={!!data.on}
                          index={data.i}
                          imgUrl={data.imgUrl}
                        />
                        <span className="text-xs font-medium truncate">{name}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#6956e5] text-white border-[#6956e5]'
                            : 'border-[#3b3e54]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 h-10 sm:h-9"
                onClick={() => setMode('dm')}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 font-semibold h-10 sm:h-9"
                disabled={!groupName.trim() || selectedMembers.length === 0}
                onClick={handleCreateGroupSubmit}
              >
                Create Group
              </Button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};
