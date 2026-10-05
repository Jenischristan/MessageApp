import React, { useState, useMemo } from 'react';
import { Search, UserPlus, ArrowLeft, MessageSquare } from 'lucide-react';
import { PEOPLE } from '../../data/mockData';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { PersonContact } from '../../types';

interface ContactsViewProps {
  onBack: () => void;
  onMessageContact: (name: string) => void;
  onOpenProfile: (name: string) => void;
  onAddNewContact: () => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  onBack,
  onMessageContact,
  onOpenProfile,
  onAddNewContact,
}) => {
  const [query, setQuery] = useState('');

  const filteredPeople = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = Object.entries(PEOPLE).map(([name, data]) => ({ name, ...data }));

    if (!q) return list;
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.u.toLowerCase().includes(q) ||
        p.bio.toLowerCase().includes(q)
    );
  }, [query]);

  // Group by first letter
  const grouped = useMemo(() => {
    const map: Record<string, Array<{ name: string } & PersonContact>> = {};
    const sorted = [...filteredPeople].sort((a, b) => a.name.localeCompare(b.name));
    sorted.forEach((p) => {
      const letter = p.name[0].toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(p);
    });
    return map;
  }, [filteredPeople]);

  const onlineCount = Object.values(PEOPLE).filter((p) => p.on).length;

  return (
    <div className="h-full flex flex-col bg-[#0f1114] select-none">
      {/* Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#202230] shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-white/70"
            onClick={onBack}
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-base font-semibold text-white">Contacts</h2>
            <p className="text-xs text-white/50">{onlineCount} online now</p>
          </div>
        </div>

        <Button size="sm" onClick={onAddNewContact} className="gap-1.5">
          <UserPlus className="w-3.5 h-3.5" />
          <span>New Contact</span>
        </Button>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-[#202230]">
        <Input
          placeholder="Search contacts by name, handle, or bio…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="h-9 text-xs bg-[#14161a]"
        />
      </div>

      {/* Contacts List */}
      <div className="flex-1 scr p-3 space-y-4">
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-12 text-white/40 text-sm">
            No contacts found matching &ldquo;{query}&rdquo;
          </div>
        ) : (
          Object.entries(grouped).map(([letter, contacts]) => (
            <div key={letter} className="space-y-1">
              <span className="px-3 text-[11px] font-semibold tracking-wider text-white/40 uppercase block">
                {letter}
              </span>
              <div className="space-y-1">
                {contacts.map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#1a1c27] transition-colors group"
                  >
                    <button
                      type="button"
                      onClick={() => onOpenProfile(c.name)}
                      className="flex items-center gap-3 min-w-0 flex-1 text-left"
                    >
                      <Avatar
                        name={c.name}
                        size={40}
                        online={!!c.on}
                        index={c.i}
                        imgUrl={c.imgUrl}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white truncate">
                            {c.name}
                          </span>
                          <span className="text-xs text-white/40 font-mono">
                            @{c.u}
                          </span>
                        </div>
                        <p className="text-xs text-white/50 truncate mt-0.5">
                          {c.bio}
                        </p>
                      </div>
                    </button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMessageContact(c.name)}
                      className="ml-2 shrink-0 gap-1.5 opacity-90 group-hover:opacity-100"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
