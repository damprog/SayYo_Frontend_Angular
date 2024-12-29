import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { SY_FriendChatDTO, SY_GroupChatDTO } from "./dto";


// --------------------------------------
// ACCOUNT SERVICE
// --------------------------------------

export interface UserAccount {
  userGuid: string;
  userName: string;
  email: string;
  isAdmin: boolean;
  photoFileName: any;
}

// --------------------------------------
// CONTACTS SERVICE
// --------------------------------------

export interface FriendsChats {
  items: Array<SY_FriendChatDTO>;
}

export interface GroupChats {
  items: Array<SY_GroupChatDTO>;
}

// --------------------------------------
// CHAT SERVICE
// --------------------------------------

export interface ChatMessage {
  guid: string;
  chatGuid: string;
  senderGuid: string;
  content: string;
  sentAt: string;
  date: string;
  time: string;
  otherDate: number;
}

export interface Chat {
  chatInfo: SY_FriendChatDTO;
  messages: Array<ChatMessage>;
  currentMessage?: string;
}
