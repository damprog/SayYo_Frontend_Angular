// --------------------------------------
// GENERAL
// --------------------------------------

export interface SY_ResponseStatus {
  success: boolean;
  message: string;
}

// --------------------------------------
// ACCOUNT SERVICE
// --------------------------------------

export interface SY_UserDTO {
  guid: string;
  userName: string;
  email: string;
  isAdmin: boolean;
}

export interface SY_LoginDTO {
  email: string;
  password: string;
}

export interface SY_RegisterDTO {
  username: string;
  password: string;
  email: string;
}

export interface SY_RegisterResponseDTO {
  success: boolean;
  message: string;
  guid: string;
}

export interface SY_LoginResponseDTO {
  token: string;
  refreshToken: string;
  user: SY_UserDTO;
}

// --------------------------------------
// CONTACTS SERVICE
// --------------------------------------

export interface SY_FriendChatDTO {
  chatGuid: string;
  chatType: number;
  chatName: string;
  friend: SY_FriendMemberDTO;
}

export interface SY_FriendMemberDTO {
  guid: string;
  chatMemberGuid: string;
  chatRole: number;
  friendshipGuid: string;
  friendshipStatus: number;
  iBlockedUser: number;
  userBlockedMe: number;
  iInvited: boolean;
}

export interface SY_GroupChatDTO {
  chatGuid: string;
  chatType: number;
  chatName: string;
  members: Array<SY_FriendMemberDTO>;
}

export interface SY_AddChatDTO {
  chatType: number;
  name: string;
}

export interface SY_AddChatMemberDTO {
  chatGuid: string;
  userGuid: string;
  role: number;
}

export interface SY_UpdateChatMemberDTO {
  memberGuid: string;
  chatGuid: string;
  userGuid: string;
  role: number;
}

export interface SY_StrangerDTO {
  guid: string;
  userName: string;
}

// --------------------------------------
// MESSEGES SERVICE
// --------------------------------------

export interface SY_SendMessageDTO {
  ChatGuid: string;
  SenderGuid: string;
  Message: string;
}

export interface SY_MessageDTO {
  guid: string;
  chatGuid: string;
  senderGuid: string;
  content: string;
  sentAt: string;
}

// --------------------------------------
// FRIENDSHIP SERVICE
// --------------------------------------

export interface SY_AddFriendshipDTO {
  userGuid: string,
  friendGuid: string,
  status: number
}

export interface SY_UpdateFriendshipDTO {
  userGuid: string;
  friendGuid: string;
  status: number;
  iBlockedUser: number;
  userBlockedMe: number;
}

export interface SY_FindFriendshipDTO {
  userGuid: string;
  friendGuid: string;
}
