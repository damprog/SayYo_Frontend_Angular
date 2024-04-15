import { SY_FriendChatDTO } from "./dto";


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
