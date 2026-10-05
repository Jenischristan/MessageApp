import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  CheckCheck,
  MessageSquare,
  Star,
  CornerDownRight,
  User,
  Users,
  Bell,
  X,
  Mail,
} from 'lucide-react';
import { NotificationItem } from '../../types';
import { Button } from '../common/Button';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onBack: () => void;
  onMarkAllAsRead: () => void;
  onToggleRead: (id: number) => void;
  onDismiss: (id: number) => void;
  onOpenConversation?: (cid: number) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onBack,
  onMarkAllAsRead,
  onToggleRead,
  onDismiss,
  onOpenConversation,
}) => {
  const unreadCount = notifications.filter((n) => n.u > 0).length;

  const getIcon = (ic: string) => {
    switch (ic) {
      case 'msg':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'star':
        return <Star className="w-4 h-4 text-amber-400 fill-amber-400" />;
      case 'reply':
        return <CornerDownRight className="w-4 h-4 text-purple-400" />;
      case 'user':
        return <User className="w-4 h-4 text-emerald-400" />;
      case 'users':
        return <Users className="w-4 h-4 text-cyan-400" />;
      default:
        return <Bell className="w-4 h-4 text-white/70" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0f1114] select-none">
      {/* Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-white/5 shrink-0">
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
            <h2 className="text-base font-semibold text-white">Notifications</h2>
            <p className="text-xs text-white/50">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={unreadCount === 0}
          onClick={onMarkAllAsRead}
          className="gap-1.5"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark all read</span>
        </Button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 scr p-3 space-y-2">
        {notifications.length === 0 ? (
          <div className="text-center py-16 text-white/40 text-sm">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="font-medium text-white/70">No notifications yet</p>
            <p className="text-xs text-white/40 mt-1">
              Mentions, replies, and reactions will appear here.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#14161a] border border-white/5 divide-y divide-white/5 overflow-hidden">
            <AnimatePresence initial={false}>
              {notifications.map((n) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center justify-between p-3.5 hover:bg-white/[0.03] transition-colors group"
                >
                  <div
                    onClick={() => n.cid && onOpenConversation?.(n.cid)}
                    className={`flex items-start gap-3 min-w-0 flex-1 ${
                      n.cid ? 'cursor-pointer' : ''
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                        n.u ? 'bg-white' : 'bg-transparent'
                      }`}
                    />
                    <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      {getIcon(n.ic)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm leading-snug ${
                          n.u ? 'text-white font-medium' : 'text-white/60'
                        }`}
                      >
                        {n.t}
                      </p>
                      <span className="text-[11px] text-white/40 mt-0.5 block font-mono">
                        {n.w}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-2 shrink-0">
                    <button
                      type="button"
                      title={n.u ? 'Mark read' : 'Mark unread'}
                      onClick={() => onToggleRead(n.id)}
                      className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Dismiss notification"
                      onClick={() => onDismiss(n.id)}
                      className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
