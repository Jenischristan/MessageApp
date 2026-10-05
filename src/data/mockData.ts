import { Conversation, Message, PersonContact, UserProfile, NotificationItem, AppSettings } from '../types';

import alexAvatar from '../assets/images/avatar_alex_morgan_1791128354728.jpg';
import sarahAvatar from '../assets/images/avatar_sarah_wilson_1791128367420.jpg';
import floorplanImg from '../assets/images/chat_showcase_floorplan_1791128379843.jpg';
import studioImg from '../assets/images/chat_showcase_studio_1791128392558.jpg';

let msgCounter = 200;

export const now = (): string =>
  new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

export const createMessage = (
  me: boolean,
  t: string,
  time = now(),
  options: Partial<Message> = {}
): Message => ({
  id: msgCounter++,
  me,
  t,
  time,
  day: 'Today',
  st: me ? 'read' : undefined,
  rx: {},
  ...options,
});

export const PEOPLE: Record<string, PersonContact> = {
  'Jenny Doe': {
    u: 'jennyd',
    on: 1,
    seen: 'Online now',
    i: 2,
    bio: 'Product support & customer experience lead.',
    email: 'jennifer@gmail.com',
    phone: '+1 (555) 987-6543',
  },
  'Alex Morgan': {
    u: 'alexm',
    on: 1,
    seen: 'Online now',
    i: 0,
    bio: 'Product designer. Coffee first, Figma second.',
    email: 'alex@nook.app',
    phone: '+1 (555) 234-5678',
    imgUrl: alexAvatar,
  },
  'Sarah Wilson': {
    u: 'sarahw',
    on: 1,
    seen: 'Online now',
    i: 1,
    bio: 'Illustrator and icon obsessive.',
    email: 'sarah@nook.app',
    phone: '+1 (555) 345-6789',
    imgUrl: sarahAvatar,
  },
  'Daniel Thomas': {
    u: 'dthomas',
    on: 0,
    seen: 'Last seen yesterday at 8:14 PM',
    i: 2,
    bio: 'Freelance accountant. Invoices on time.',
    email: 'daniel@finance-craft.io',
    phone: '+1 (555) 456-7890',
  },
  'Emma Davis': {
    u: 'emmad',
    on: 0,
    seen: 'Last seen Oct 2 at 4:30 PM',
    i: 3,
    bio: 'Reading everything, finishing nothing.',
    email: 'emma.d@arc-studio.design',
    phone: '+1 (555) 567-8901',
  },
  'Maya Chen': {
    u: 'mayac',
    on: 1,
    seen: 'Online now',
    i: 1,
    bio: 'Product lead at nook.',
    email: 'maya@nook.app',
    phone: '+1 (555) 678-9012',
  },
  'Priya Patel': {
    u: 'priyap',
    on: 0,
    seen: 'Last seen 2 h ago',
    i: 2,
    bio: 'Design systems and tokens architect.',
    email: 'priya@tokens-infra.dev',
    phone: '+1 (555) 789-0123',
  },
  'Liam Brooks': {
    u: 'liamb',
    on: 0,
    seen: 'Last seen yesterday',
    i: 3,
    bio: 'Backend engineer. Tabs over spaces.',
    email: 'liam@distributed-systems.org',
    phone: '+1 (555) 890-1234',
  },
  'Chloe Park': {
    u: 'chloep',
    on: 1,
    seen: 'Online now',
    i: 0,
    bio: 'Motion designer & micro-interactions.',
    email: 'chloe@motioncraft.co',
    phone: '+1 (555) 901-2345',
  },
  'Grace Lee': {
    u: 'gracel',
    on: 1,
    seen: 'Online now',
    i: 1,
    bio: 'UX researcher & cognitive systems.',
    email: 'grace@humanfactor.labs',
    phone: '+1 (555) 012-3456',
  },
};

export const INITIAL_USER: UserProfile = {
  name: 'Jordan Reyes',
  user: 'jordan',
  bio: 'Designing quiet software.',
  email: 'jordan@nook.app',
  status: 'Available',
  vis: true,
  av: 1,
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 1, ic: 'msg', t: 'Alex Morgan sent you a new message', w: '2 min ago', u: 1, cid: 1 },
  { id: 2, ic: 'star', t: 'Sarah reacted 🔥 to your message', w: '8 min ago', u: 1, cid: 2 },
  { id: 3, ic: 'reply', t: 'Maya replied to your roadmap message', w: '1 h ago', u: 1, cid: 5 },
  { id: 4, ic: 'user', t: 'Daniel mentioned you in Product Team', w: 'Yesterday', u: 0, cid: 5 },
  { id: 5, ic: 'users', t: 'Liam Brooks sent a contact request', w: 'Yesterday', u: 0 },
];

export const INITIAL_SETTINGS: AppSettings = {
  seen: true,
  receipts: true,
  online: true,
  photo: true,
  notif: true,
  sound: true,
  preview: true,
  mention: true,
  react: true,
  vib: false,
  enter: true,
  media: true,
  links: true,
  archive: false,
  wifi: true,
  cell: false,
  '2fa': false,
};

export const getInitialConversations = (): Conversation[] => [
  {
    id: 1,
    name: 'Jenny Doe',
    pin: true,
    fav: true,
    unread: 0,
    msgs: [
      createMessage(false, 'Hi I need assistance for my order 📦', '12:00 PM', { day: 'Today' }),
      createMessage(true, 'Hi John! We are happy to help you.', '12:01 PM', { day: 'Today' }),
      createMessage(true, 'Please give us your order ID', '12:01 PM', { day: 'Today' }),
      createMessage(false, '#ORD1238871645', '12:02 PM', { day: 'Today' }),
      createMessage(true, 'An Executive will call you regarding your query in 10 mins', '12:03 PM', { day: 'Today' }),
      createMessage(true, 'Please rate your experience', '12:03 PM', { day: 'Today' }),
    ],
  },
  {
    id: 2,
    name: 'Alex Morgan',
    pin: false,
    fav: true,
    unread: 2,
    imgUrl: alexAvatar,
    msgs: [
      createMessage(false, 'Are we meeting today?', '9:02 AM', { day: 'Yesterday' }),
      createMessage(true, 'Yes, at 6 PM — same place?', '9:05 AM', { day: 'Yesterday' }),
      createMessage(false, 'Sending the venue notes.', '9:06 AM', {
        day: 'Yesterday',
        kind: 'file',
        file: { name: 'venue-notes.pdf', size: '482 KB', type: 'pdf' },
      }),
      createMessage(false, 'And the budget breakdown for Q4', '9:07 AM', {
        day: 'Yesterday',
        kind: 'file',
        file: { name: 'budget-q4.xlsx', size: '91 KB', type: 'xlsx' },
      }),
      createMessage(true, 'Got them 👍', '10:12 AM', { rx: { '👍': ['Alex'] } }),
      createMessage(false, 'Onboarding prototype is live here', '10:30 AM', {
        kind: 'link',
        link: {
          url: 'figma.com/proto/nook',
          title: 'Nook — onboarding prototype & spring curves',
          desc: 'High-fidelity mobile flows and micro-interaction sandbox',
        },
      }),
      createMessage(false, 'Floor plan draft for the offsite', '10:35 AM', {
        kind: 'img',
        imgUrl: floorplanImg,
      }),
      createMessage(false, 'Are we still good for 6 PM? Can review the deck too.', '10:42 AM', {
        reply: { who: 'You', text: 'Yes, at 6 PM — same place?' },
      }),
    ],
  },
  {
    id: 3,
    name: 'Sarah Wilson',
    fav: true,
    unread: 0,
    imgUrl: sarahAvatar,
    msgs: [
      createMessage(false, 'The new icons look so clean', '8:50 AM'),
      createMessage(true, 'Thanks! Exporting the final set now with crisp vector paths.', '8:52 AM'),
      createMessage(false, 'Here is the brand cover shot', '8:55 AM', {
        kind: 'img',
        imgUrl: studioImg,
      }),
      createMessage(false, 'Dark room studio capture', '8:55 AM', { kind: 'img', v: 3 }),
      createMessage(false, 'icons-v3.zip', '8:57 AM', {
        kind: 'file',
        file: { name: 'icons-v3.zip', size: '3.1 MB', type: 'zip' },
      }),
      createMessage(true, '🔥🔥', '8:58 AM', { kind: 'emoji' }),
    ],
  },
  {
    id: 4,
    name: 'Daniel Thomas',
    mute: true,
    unread: 5,
    msgs: [
      createMessage(false, 'Invoice is attached, ping me if anything looks off.', '8:10 PM', {
        day: 'Yesterday',
        kind: 'file',
        file: { name: 'invoice-0412.pdf', size: '204 KB', type: 'pdf' },
      }),
      createMessage(false, 'Also — happy to jump on a call Thursday if helpful.', '8:14 PM', {
        day: 'Yesterday',
      }),
    ],
  },
  {
    id: 5,
    name: 'Emma Davis',
    unread: 0,
    msgs: [
      createMessage(false, 'Thanks for the book recommendation!', '4:20 PM', { day: 'Oct 2' }),
      createMessage(true, 'Anytime. Let me know how chapter 3 lands.', '4:30 PM', {
        day: 'Oct 2',
        st: 'delivered',
      }),
    ],
  },
  {
    id: 6,
    name: 'Product Team',
    group: true,
    i: 1,
    unread: 1,
    members: ['Maya Chen', 'Priya Patel', 'Alex Morgan', 'Liam Brooks', 'Jordan Reyes'],
    msgs: [
      {
        id: 199,
        me: false,
        sys: true,
        t: 'Maya added Liam to the group',
        time: 'Yesterday',
        day: 'Yesterday',
        rx: {},
      },
      createMessage(false, 'Roadmap review moved to Friday at 11 AM.', '11:15 AM', {
        who: 'Maya Chen',
      }),
      createMessage(false, 'Latest draft specifications', '11:16 AM', {
        who: 'Maya Chen',
        kind: 'file',
        file: { name: 'roadmap-q4.pdf', size: '1.2 MB', type: 'pdf' },
      }),
      createMessage(false, 'Mockups for the new quiet inbox layout', '11:18 AM', {
        who: 'Priya Patel',
        kind: 'img',
        v: 0,
      }),
      createMessage(true, 'Works for me. I will update the spec doc.', '11:20 AM', {
        fwd: true,
      }),
      createMessage(false, 'API notes & real-time socket events', '11:24 AM', {
        who: 'Liam Brooks',
        kind: 'link',
        link: {
          url: 'docs.nook.app/api',
          title: 'Messaging API & Invariants — draft',
          desc: 'End-to-end encrypted payload specifications',
        },
      }),
    ],
  },
  {
    id: 7,
    name: 'Design Group',
    group: true,
    i: 3,
    unread: 0,
    members: ['Priya Patel', 'Sarah Wilson', 'Grace Lee', 'Chloe Park', 'Jordan Reyes'],
    msgs: [
      createMessage(false, 'Dark mode tokens are merged into main.', 'Mon', {
        day: 'Oct 1',
        who: 'Priya Patel',
      }),
      createMessage(false, 'Moodboard exploration for haptic states', 'Mon', {
        day: 'Oct 1',
        who: 'Grace Lee',
        kind: 'img',
        v: 3,
      }),
    ],
  },
];
