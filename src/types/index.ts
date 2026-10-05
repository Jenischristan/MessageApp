export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export type MessageKind = 'text' | 'img' | 'file' | 'link' | 'emoji' | 'voice';

export interface FileAttachment {
  name: string;
  size: string;
  type?: string;
  url?: string;
}

export interface LinkAttachment {
  url: string;
  title: string;
  desc?: string;
  img?: string;
}

export interface MessageReply {
  id?: number;
  who: string;
  text: string;
}

export interface Message {
  id: number;
  me: boolean;
  t: string;
  time: string;
  day: string;
  st?: MessageStatus;
  rx: Record<string, string[]>; // emoji -> names
  kind?: MessageKind;
  file?: FileAttachment;
  link?: LinkAttachment;
  v?: number; // visual seed for abstract imagery
  imgUrl?: string;
  reply?: MessageReply;
  fwd?: boolean;
  sys?: boolean;
  del?: boolean;
  who?: string;
  pinned?: boolean;
  voiceDuration?: string;
}

export interface Conversation {
  id: number;
  name: string;
  pin?: boolean;
  fav?: boolean;
  mute?: boolean;
  unread: number;
  group?: boolean;
  members?: string[];
  i?: number;
  imgUrl?: string;
  typing?: boolean;
  msgs: Message[];
}

export interface UserProfile {
  name: string;
  user: string;
  bio: string;
  email: string;
  status: 'Available' | 'Busy' | 'Away';
  vis: boolean;
  av: number;
  imgUrl?: string;
}

export interface PersonContact {
  u: string;
  on: number;
  seen: string;
  i: number;
  bio: string;
  email?: string;
  phone?: string;
  imgUrl?: string;
}

export interface NotificationItem {
  id: number;
  ic: 'msg' | 'star' | 'reply' | 'user' | 'users' | 'bell';
  t: string;
  w: string;
  u: number;
  gone?: boolean;
  cid?: number;
}

export interface AppSettings {
  seen: boolean;
  receipts: boolean;
  online: boolean;
  photo: boolean;
  notif: boolean;
  sound: boolean;
  preview: boolean;
  mention: boolean;
  react: boolean;
  vib: boolean;
  enter: boolean;
  media: boolean;
  links: boolean;
  archive: boolean;
  wifi: boolean;
  cell: boolean;
  '2fa': boolean;
}

export type ViewType = 'chats' | 'contacts' | 'notifs' | 'settings' | 'profile';

export type FilterTab = 'all' | 'unread' | 'fav' | 'groups';
