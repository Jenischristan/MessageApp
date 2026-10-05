import React from 'react';
import { Dialog } from '../common/Dialog';
import { Button } from '../common/Button';
import { Laptop, Smartphone, Monitor, ShieldAlert } from 'lucide-react';

interface InfoDialogProps {
  isOpen: boolean;
  type: 'blocked' | 'sessions' | null;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const InfoDialog: React.FC<InfoDialogProps> = ({
  isOpen,
  type,
  onClose,
  onToast,
}) => {
  const [blockedList, setBlockedList] = React.useState([
    { handle: '@spam_bot_09', reason: 'Automated advertising' },
    { handle: '@unknown_marketer', reason: 'Unsolicited outbound' },
  ]);

  const [sessionsList, setSessionsList] = React.useState([
    {
      id: 1,
      device: 'MacBook Pro 16" — This device',
      location: 'San Francisco, CA',
      time: 'Active now',
      isCurrent: true,
      icon: Laptop,
    },
    {
      id: 2,
      device: 'iPhone 15 Pro',
      location: 'San Francisco, CA',
      time: 'Last active 25 min ago',
      isCurrent: false,
      icon: Smartphone,
    },
    {
      id: 3,
      device: 'Brave on Linux Workstation',
      location: 'Seattle, WA',
      time: 'Last active yesterday',
      isCurrent: false,
      icon: Monitor,
    },
  ]);

  const handleUnblock = (handle: string) => {
    setBlockedList((prev) => prev.filter((b) => b.handle !== handle));
    onToast(`Unblocked ${handle}`);
  };

  const handleRevokeSession = (id: number) => {
    setSessionsList((prev) => prev.filter((s) => s.id !== id));
    onToast('Session terminated');
  };

  if (!type) return null;

  return (
    <Dialog
      isOpen={isOpen}
      title={type === 'blocked' ? 'Blocked Contacts' : 'Active Sessions'}
      description={
        type === 'blocked'
          ? 'These users cannot send you messages or view your status'
          : 'Devices currently authorized with cryptographic access'
      }
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <div className="space-y-3">
        {type === 'blocked' ? (
          blockedList.length === 0 ? (
            <p className="text-center py-8 text-xs text-white/40">
              No blocked contacts.
            </p>
          ) : (
            <div className="space-y-2">
              {blockedList.map((item) => (
                <div
                  key={item.handle}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                >
                  <div>
                    <p className="text-xs font-semibold text-white font-mono">
                      {item.handle}
                    </p>
                    <p className="text-[11px] text-white/40">{item.reason}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnblock(item.handle)}
                  >
                    Unblock
                  </Button>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="space-y-2">
            {sessionsList.map((session) => {
              const Icon = session.icon;
              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 h-8 rounded-lg bg-white/10 grid place-items-center shrink-0 text-white/80">
                      <Icon className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {session.device}
                      </p>
                      <p className="text-[11px] text-white/40">
                        {session.location} · {session.time}
                      </p>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeSession(session.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Revoke
                    </Button>
                  )}
                  {session.isCurrent && (
                    <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10">
                      Current
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Dialog>
  );
};
