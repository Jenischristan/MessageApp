import React from 'react';
import { Dialog } from '../common/Dialog';
import { Avatar } from '../common/Avatar';
import { Conversation, Message } from '../../types';
import { PEOPLE } from '../../data/mockData';

interface ForwardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message: Message | null;
  currentConversationId: number;
  conversations: Conversation[];
  onForwardTo: (targetConversationId: number) => void;
}

export const ForwardDialog: React.FC<ForwardDialogProps> = ({
  isOpen,
  onClose,
  message,
  currentConversationId,
  conversations,
  onForwardTo,
}) => {
  const targetList = conversations.filter((c) => c.id !== currentConversationId);

  return (
    <Dialog
      isOpen={isOpen}
      title="Forward Message"
      description="Choose a chat or group to send this message to"
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <div className="space-y-3">
        {/* Message snippet preview */}
        {message && (
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-white/70 italic truncate">
            {message.t ||
              (message.kind === 'img'
                ? 'Photo attachment'
                : message.file?.name || 'File attachment')}
          </div>
        )}

        <div className="max-h-64 scr space-y-1">
          {targetList.map((conv) => {
            const isGroup = conv.group;
            const person = !isGroup ? PEOPLE[conv.name] : null;

            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => {
                  onForwardTo(conv.id);
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#1a1c27] transition-colors text-left"
              >
                <Avatar
                  name={conv.name}
                  size={38}
                  online={isGroup ? undefined : !!person?.on}
                  index={conv.i ?? person?.i ?? 0}
                  imgUrl={conv.imgUrl || person?.imgUrl}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">
                    {conv.name}
                  </p>
                  <p className="text-xs text-white/40 truncate">
                    {isGroup
                      ? `${conv.members?.length || 0} members`
                      : person?.seen || 'Offline'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Dialog>
  );
};
