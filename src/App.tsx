import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Conversation,
  Message,
  UserProfile,
  NotificationItem,
  AppSettings,
  ViewType,
  FilterTab,
} from './types';
import {
  getInitialConversations,
  INITIAL_USER,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS,
  createMessage,
  now,
  PEOPLE,
} from './data/mockData';
import { NavigationRail } from './components/sidebar/NavigationRail';
import { Sidebar } from './components/sidebar/Sidebar';
import { ChatArea } from './components/chat/ChatArea';
import { ConversationDetails } from './components/details/ConversationDetails';
import { ContactsView } from './components/views/ContactsView';
import { NotificationsView } from './components/views/NotificationsView';
import { ProfileView } from './components/views/ProfileView';
import { SettingsView } from './components/views/SettingsView';
import { AuthScreen } from './components/auth/AuthScreen';
import { NewChatDialog } from './components/dialogs/NewChatDialog';
import { EditProfileDialog } from './components/dialogs/EditProfileDialog';
import { ForwardDialog } from './components/dialogs/ForwardDialog';
import { InfoDialog } from './components/dialogs/InfoDialog';
import { ConfirmDialog } from './components/dialogs/ConfirmDialog';
import { UserProfileModal } from './components/dialogs/UserProfileModal';
import { MobileNavDrawer } from './components/dialogs/MobileNavDrawer';
import { ImageLightbox } from './components/chat/ImageLightbox';
import { ReportModal } from './components/dialogs/ReportModal';
import { AddMembersDialog } from './components/dialogs/AddMembersDialog';
import { playReceiveSound } from './utils/audio';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('chats');
  const [conversations, setConversations] = useState<Conversation[]>(getInitialConversations);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(1);
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isLoadingSidebar, setIsLoadingSidebar] = useState(false);

  // User and Settings
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dialog states
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [infoDialogType, setInfoDialogType] = useState<'blocked' | 'sessions' | null>(null);
  const [isLogOutOpen, setIsLogOutOpen] = useState(false);
  const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);

  // Profile modal
  const [inspectProfileName, setInspectProfileName] = useState<string | null>(null);

  // Report modal state
  const [reportState, setReportState] = useState<{
    isOpen: boolean;
    targetName: string;
    isMessageReport?: boolean;
    messageSnippet?: string;
  }>({
    isOpen: false,
    targetName: '',
  });

  // Forward message modal
  const [forwardMessageTarget, setForwardMessageTarget] = useState<{
    message: Message;
    conversation: Conversation;
  } | null>(null);

  // Global Image Lightbox
  const [globalLightbox, setGlobalLightbox] = useState<{
    isOpen: boolean;
    v?: number;
    src?: string;
    caption?: string;
  }>({ isOpen: false });

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2200);
  }, []);

  // Update a single conversation in state
  const handleUpdateConversation = useCallback(
    (id: number, updater: (c: Conversation) => Conversation) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? updater(c) : c))
      );
    },
    []
  );

  // Select conversation
  const handleSelectConversation = useCallback(
    (id: number) => {
      setActiveConversationId(id);
      setCurrentView('chats');
      // Mark as read
      handleUpdateConversation(id, (c) => ({ ...c, unread: 0 }));
    },
    [handleUpdateConversation]
  );

  // Active conversation object
  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId) || null,
    [conversations, activeConversationId]
  );

  // Unread counters
  const totalUnreadChats = useMemo(
    () => conversations.reduce((acc, c) => acc + c.unread, 0),
    [conversations]
  );

  const totalUnreadNotifications = useMemo(
    () => notifications.filter((n) => n.u > 0).length,
    [notifications]
  );

  // Keyboard shortcut listener (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsNewChatOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Message a contact directly
  const handleMessageContact = (contactName: string) => {
    const existing = conversations.find(
      (c) => !c.group && c.name.toLowerCase() === contactName.toLowerCase()
    );

    if (existing) {
      handleSelectConversation(existing.id);
    } else {
      // Create new DM conversation
      const personData = PEOPLE[contactName];
      const newId = Date.now();
      const newConv: Conversation = {
        id: newId,
        name: contactName,
        unread: 0,
        i: personData?.i ?? 0,
        imgUrl: personData?.imgUrl,
        msgs: [
          createMessage(
            false,
            `Hey there! Glad we connected on nook.`,
            now()
          ),
        ],
      };
      setConversations((prev) => [newConv, ...prev]);
      handleSelectConversation(newId);
    }
  };

  // Create new Group conversation
  const handleCreateGroup = (name: string, members: string[], avatarIndex: number) => {
    const allMembers = Array.from(new Set([...members, currentUser.name]));
    const newGroupId = Date.now();
    const newGroup: Conversation = {
      id: newGroupId,
      name,
      group: true,
      members: allMembers,
      i: avatarIndex,
      unread: 0,
      msgs: [
        {
          id: Date.now(),
          me: false,
          sys: true,
          t: `You created group "${name}" with ${members.length} members`,
          time: now(),
          day: 'Today',
          rx: {},
        },
      ],
    };

    setConversations((prev) => [newGroup, ...prev]);
    handleSelectConversation(newGroupId);
    showToast(`Created group "${name}"`);
  };

  // Add members to existing active group
  const handleAddMembersToGroup = (newMembers: string[]) => {
    if (!activeConversation || !activeConversation.group) return;

    handleUpdateConversation(activeConversation.id, (c) => ({
      ...c,
      members: Array.from(new Set([...(c.members || []), ...newMembers])),
      msgs: [
        ...c.msgs,
        {
          id: Date.now(),
          me: false,
          sys: true,
          t: `You added ${newMembers.join(', ')} to the group`,
          time: now(),
          day: 'Today',
          rx: {},
        },
      ],
    }));

    showToast(`Added ${newMembers.length} member(s) to ${activeConversation.name}`);
  };

  // Open Report Contact
  const handleOpenReportContact = (targetName?: string) => {
    const nameToReport = targetName || activeConversation?.name || 'Contact';
    setReportState({
      isOpen: true,
      targetName: nameToReport,
      isMessageReport: false,
    });
  };

  // Open Report Message
  const handleOpenReportMessage = (message: Message) => {
    const author = message.who || activeConversation?.name || 'User';
    setReportState({
      isOpen: true,
      targetName: author,
      isMessageReport: true,
      messageSnippet: message.t || 'Attachment message',
    });
  };

  // Submit Report
  const handleSubmitReport = (reason: string, details: string) => {
    showToast(`Report received for ${reportState.targetName}. Thank you.`);
  };

  // Forward message execution
  const handleForwardTo = (targetConvId: number) => {
    if (!forwardMessageTarget) return;

    const forwardedMsg: Message = {
      ...forwardMessageTarget.message,
      id: Date.now(),
      me: true,
      time: now(),
      day: 'Today',
      fwd: true,
      st: 'sent',
      rx: {},
      reply: undefined,
    };

    handleUpdateConversation(targetConvId, (c) => ({
      ...c,
      msgs: [...c.msgs, forwardedMsg],
    }));

    const targetConv = conversations.find((c) => c.id === targetConvId);
    showToast(`Forwarded to ${targetConv?.name || 'chat'}`);
    setForwardMessageTarget(null);
  };

  if (!isAuthenticated) {
    return <AuthScreen onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="h-full flex flex-col md:flex-row bg-[#08090a] text-[#eeeff1] overflow-hidden relative font-sans select-none">
      {/* 1. Leftmost Navigation Rail (Desktop) */}
      <NavigationRail
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
        }}
        unreadChats={totalUnreadChats}
        unreadNotifications={totalUnreadNotifications}
        currentUser={currentUser}
        onNewMessage={() => setIsNewChatOpen(true)}
        onOpenFavorites={() => {
          setCurrentView('chats');
          setFilterTab('fav');
        }}
      />

      {/* 2. Middle Panel: Sidebar (Chats, Contacts, Notifications, Settings, Profile) */}
      <div
        className={`h-full min-h-0 min-w-0 flex flex-col ${
          currentView === 'chats' && activeConversation
            ? 'hidden md:flex'
            : 'flex flex-1 md:flex-none'
        }`}
      >
        {currentView === 'chats' && (
          <Sidebar
            conversations={conversations}
            activeId={activeConversationId}
            onSelectConversation={handleSelectConversation}
            filterTab={filterTab}
            onFilterTabChange={setFilterTab}
            onOpenNewChat={() => setIsNewChatOpen(true)}
            onOpenMobileMenu={() => setIsMobileNavOpen(true)}
            isLoading={isLoadingSidebar}
          />
        )}

        {currentView === 'contacts' && (
          <div className="w-full md:w-[320px] lg:w-[340px] h-full border-r border-white/8">
            <ContactsView
              onBack={() => setCurrentView('chats')}
              onMessageContact={handleMessageContact}
              onOpenProfile={(name) => setInspectProfileName(name)}
              onAddNewContact={() => setIsNewChatOpen(true)}
            />
          </div>
        )}

        {currentView === 'notifs' && (
          <div className="w-full md:w-[320px] lg:w-[340px] h-full border-r border-white/8">
            <NotificationsView
              notifications={notifications}
              onBack={() => setCurrentView('chats')}
              onMarkAllAsRead={() =>
                setNotifications((list) => list.map((n) => ({ ...n, u: 0 })))
              }
              onToggleRead={(id) =>
                setNotifications((list) =>
                  list.map((n) => (n.id === id ? { ...n, u: n.u ? 0 : 1 } : n))
                )
              }
              onDismiss={(id) =>
                setNotifications((list) => list.filter((n) => n.id !== id))
              }
              onOpenConversation={(cid) => handleSelectConversation(cid)}
            />
          </div>
        )}

        {currentView === 'profile' && (
          <div className="w-full md:w-[320px] lg:w-[340px] h-full border-r border-white/8">
            <ProfileView
              currentUser={currentUser}
              onBack={() => setCurrentView('chats')}
              onEditProfile={() => setIsEditProfileOpen(true)}
              onUpdateStatus={(status) =>
                setCurrentUser((u) => ({ ...u, status }))
              }
              onToggleVisibility={() =>
                setCurrentUser((u) => ({ ...u, vis: !u.vis }))
              }
            />
          </div>
        )}

        {currentView === 'settings' && (
          <div className="w-full md:w-[320px] lg:w-[340px] h-full border-r border-white/8">
            <SettingsView
              settings={settings}
              currentUser={currentUser}
              onBack={() => setCurrentView('chats')}
              onUpdateSetting={(key, val) =>
                setSettings((prev) => ({ ...prev, [key]: val }))
              }
              onOpenBlockedUsers={() => setInfoDialogType('blocked')}
              onOpenActiveSessions={() => setInfoDialogType('sessions')}
              onOpenLogOutDialog={() => setIsLogOutOpen(true)}
              onToast={showToast}
            />
          </div>
        )}
      </div>

      {/* 3. Main Center Workspace: Chat Area */}
      <div
        className={`flex-1 min-w-0 min-h-0 flex flex-col bg-[#08090a] ${
          currentView === 'chats' && activeConversation
            ? 'flex'
            : 'hidden md:flex'
        }`}
      >
        {activeConversation ? (
          <ChatArea
            key={activeConversation.id}
            conversation={activeConversation}
            currentUser={currentUser}
            soundEnabled={settings.sound}
            enterToSend={settings.enter}
            isDetailsOpen={isDetailsOpen}
            onBack={() => setActiveConversationId(null)}
            onToggleDetails={() => setIsDetailsOpen((prev) => !prev)}
            onUpdateConversation={handleUpdateConversation}
            onOpenProfile={(name) => setInspectProfileName(name)}
            onToast={showToast}
            onForwardMessageToDialog={(message, conversation) =>
              setForwardMessageTarget({ message, conversation })
            }
            onReportContact={() => handleOpenReportContact()}
            onReportMessage={handleOpenReportMessage}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center select-none text-white/50 bg-[#08090a]">
            <div className="w-16 h-16 rounded-3xl bg-[#121316] border border-white/10 flex items-center justify-center text-white/40 mb-4 shadow-md">
              <svg width={32} height={32} viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="9" fill="#ffffff" />
                <path
                  d="M10 23V9.5M10 15.5a6 6 0 0 1 12 0V19"
                  stroke="#0b0c0e"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                />
                <circle cx="22" cy="23.5" r="2.6" fill="#0b0c0e" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-white/90">
              No conversation selected
            </h3>
            <p className="text-xs text-white/40 mt-1 max-w-xs leading-relaxed">
              Select a conversation from the sidebar or press{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[11px] text-white">
                Cmd+K
              </kbd>{' '}
              to start a new message or group.
            </p>
          </div>
        )}
      </div>

      {/* 4. Right Side: Conversation Details Panel (Desktop) */}
      <AnimatePresence>
        {activeConversation && isDetailsOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="hidden xl:flex shrink-0 h-full overflow-hidden"
          >
            <ConversationDetails
              conversation={activeConversation}
              currentUser={currentUser}
              onClose={() => setIsDetailsOpen(false)}
              onToggleFavorite={() =>
                handleUpdateConversation(activeConversation.id, (c) => ({
                  ...c,
                  fav: !c.fav,
                }))
              }
              onToggleMute={() =>
                handleUpdateConversation(activeConversation.id, (c) => ({
                  ...c,
                  mute: !c.mute,
                }))
              }
              onOpenProfile={(name) => setInspectProfileName(name)}
              onOpenImage={(v, src, caption) =>
                setGlobalLightbox({ isOpen: true, v, src, caption })
              }
              onReportContact={() => handleOpenReportContact(activeConversation.name)}
              onAddGroupMembers={
                activeConversation.group
                  ? () => setIsAddMembersOpen(true)
                  : undefined
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Modals & Dialogs */}
      {/* New Chat / Create Group Modal */}
      <NewChatDialog
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        onSelectContact={(name) => handleMessageContact(name)}
        onCreateGroup={handleCreateGroup}
      />

      {/* Add Members to Group Modal */}
      {activeConversation && activeConversation.group && (
        <AddMembersDialog
          isOpen={isAddMembersOpen}
          groupName={activeConversation.name}
          existingMembers={activeConversation.members || []}
          onClose={() => setIsAddMembersOpen(false)}
          onAddMembers={handleAddMembersToGroup}
        />
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={reportState.isOpen}
        targetName={reportState.targetName}
        isMessageReport={reportState.isMessageReport}
        messageSnippet={reportState.messageSnippet}
        onClose={() => setReportState((prev) => ({ ...prev, isOpen: false }))}
        onSubmitReport={handleSubmitReport}
      />

      {/* Edit Profile Modal */}
      <EditProfileDialog
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentUser={currentUser}
        onSave={(updated) => {
          setCurrentUser(updated);
          showToast('Profile updated');
        }}
      />

      {/* Forward Message Modal */}
      <ForwardDialog
        isOpen={!!forwardMessageTarget}
        onClose={() => setForwardMessageTarget(null)}
        message={forwardMessageTarget?.message || null}
        currentConversationId={forwardMessageTarget?.conversation.id || 0}
        conversations={conversations}
        onForwardTo={handleForwardTo}
      />

      {/* Info Dialog (Blocked Users & Active Sessions) */}
      <InfoDialog
        isOpen={!!infoDialogType}
        type={infoDialogType}
        onClose={() => setInfoDialogType(null)}
        onToast={showToast}
      />

      {/* Log Out Confirm Modal */}
      <ConfirmDialog
        isOpen={isLogOutOpen}
        title="Log Out of nook?"
        description="Your encryption session on this device will terminate. You will need your credentials to sign back in."
        confirmLabel="Log Out"
        confirmVariant="danger"
        onConfirm={() => {
          setIsAuthenticated(false);
          setActiveConversationId(null);
          showToast('Signed out of vault');
        }}
        onClose={() => setIsLogOutOpen(false)}
      />

      {/* Contact / User Profile Modal */}
      <UserProfileModal
        isOpen={!!inspectProfileName}
        name={inspectProfileName}
        activeConversationName={activeConversation?.name}
        currentUser={currentUser}
        conversations={conversations}
        onClose={() => setInspectProfileName(null)}
        onStartMessage={(name) => handleMessageContact(name)}
        onOpenImage={(v, src, caption) =>
          setGlobalLightbox({ isOpen: true, v, src, caption })
        }
        onToggleFavorite={(id) =>
          handleUpdateConversation(id, (c) => ({ ...c, fav: !c.fav }))
        }
        onToggleMute={(id) =>
          handleUpdateConversation(id, (c) => ({ ...c, mute: !c.mute }))
        }
        onReportUser={(name) => handleOpenReportContact(name)}
      />

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        currentView={currentView}
        onSelectView={(view) => setCurrentView(view)}
        currentUser={currentUser}
        unreadChats={totalUnreadChats}
        unreadNotifications={totalUnreadNotifications}
        onOpenLogOut={() => setIsLogOutOpen(true)}
      />

      {/* Global Image Lightbox */}
      <ImageLightbox
        isOpen={globalLightbox.isOpen}
        v={globalLightbox.v}
        src={globalLightbox.src}
        caption={globalLightbox.caption}
        onClose={() => setGlobalLightbox({ isOpen: false })}
      />

      {/* Global Toast Notification */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 400 }}
              className="px-4 py-2 rounded-full bg-white text-[#08090a] text-xs font-semibold shadow-xl flex items-center gap-2"
            >
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
