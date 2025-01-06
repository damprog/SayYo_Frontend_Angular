import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { SY_ChatDTO } from "./dto";
import { Observable } from 'rxjs';


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
  //action: () => void | Observable<any>;
}
