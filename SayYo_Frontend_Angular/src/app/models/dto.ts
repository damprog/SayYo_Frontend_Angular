
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
  chatType: Int16Array;
  chatName: string;
  friend: SY_FriendMemberDTO;
}

export interface SY_FriendMemberDTO {
  memberGuid: string;
  chatRole: Int16Array;
  friendshipStatus: Int16Array;
  blockFromUser: Int16Array;
  blockFromFriend: Int16Array;
}

export interface SY_GroupChatDTO {
  chatGuid: string;
  chatType: Int16Array;
  chatName: string;
  members: Array<SY_FriendMemberDTO>;
}


