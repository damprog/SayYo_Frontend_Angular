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
  friendshipStatus: number;
  blockFromUser: number;
  blockFromFriend: number;
}

export interface SY_GroupChatDTO {
  chatGuid: string;
  chatType: number;
  chatName: string;
  members: Array<SY_FriendMemberDTO>;
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
