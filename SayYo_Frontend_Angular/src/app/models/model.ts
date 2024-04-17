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
