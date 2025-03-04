import { SY_ChatDTO } from "./dto";
import { SafeUrl } from '@angular/platform-browser';


// --------------------------------------
// ACCOUNT SERVICE
// --------------------------------------

export interface UserAccount {
  userGuid: string;
  userName: string;
  email: string;
  isAdmin: boolean;
  profilePicture: SafeUrl | null;
}

// --------------------------------------
// CONTACTS SERVICE
// --------------------------------------

export interface Chats {
  refreshNeeded: boolean;
  items: Array<SY_ChatDTO>;
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
  chatInfo: SY_ChatDTO;
  messages: Array<ChatMessage>;
  currentMessage?: string;
}

// --------------------------------------
// CONTEXT MENU
// --------------------------------------

export interface ContextMenu {
  name: string;
  menuItems: Array<MenuItem>
}

export interface MenuItem {
  label: string;
  action: any;
}
