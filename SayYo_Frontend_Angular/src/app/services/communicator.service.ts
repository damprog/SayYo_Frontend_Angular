import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class CommunicatorService {
  constructor(private http: HttpClient, private accountService: AccountService) {
    this.User = this.accountService.account;
    this.SY_UserGuid = "d9d4b0ce-82cc-4e14-ae2d-007b51cbe4c9";
}

httpOptions: any = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'X-Custom-Header',
      'Access-Control-Allow-Origin': 'http://localhost:7203'
  })
};
// Url to communicator (SayYo) api - local
// SY - SayYo
readonly APIUrl = "https://localhost:7203/";
User: any;
SY_UserGuid: any;

SY_ListOfChatMemberDTO: any;
SY_ListOfMessageDTO: any;
SY_ListOfFriendshipDTO: any

SY_AddChatDTO: any;
SY_AddChatMemberDTO: any;
SY_UpdateChatMemberDTO: any;
SY_ChatDTO: any;
SY_SendMessageDTO: any;
SY_FindFriendshipDTO: any;
SY_UpdateFriendshipDTO: any;
SY_AddFriendshipDTO: any;
SY_UserDTO: any;
SY_LoginDTO: any;
SY_RegisterDTO: any;

// searchTemplate: string;


// TODO: find out way to keep cache

// ----------------------------------------------------------------------------------------------------------------------------------------------
// Events

// ----------------------------------------------------------------------------------------------------------------------------------------------
// UsersManipulate - NOTE ! moved to contacts.service - can be deleted
//
// FriendsChats: chatId, chatType, chatName, friend(id, userName, email,chatRole, friendshipStatus)
// getStrangers() {
//   return this.http.get(this.APIUrl + "sayyo/misc/getStrangers?userGuid=" + this.SY_UserGuid, this.httpOptions);
// }
// //  data is processed on server side - use this function to get private chats
// getFriendsChats() {
//   return this.http.get(this.APIUrl + "sayyo/misc/getFriendsChats?userGuid=" + this.SY_UserGuid, this.httpOptions);
// }
// getGroupChats() {
//   return this.http.get(this.APIUrl + "sayyo/misc/getGroupChats?userGuid=" + this.SY_UserGuid, this.httpOptions);
// }

// ----------------------------------------------------------------------------------------------------------------------------------------------
// ChatController
//
// .. some info..
// ChatMemberRoleEnum: 0 - normal, 1 - admin, 2 - owner
// ChatTypeEnum: 0 - private, 1 - group

// Returns ChatDTO
getChat(chatId: string) {
  return this.http.get(this.APIUrl + "sayyo/chat/id?chatId=" + chatId);
}

// List of ChatMemberDTO // instead of this is use getFriendsChats
// getChatsForUser():Observable<any[]>{
//     return this.http.get<any[]>(this.APIUrl+"sayyo/chat/getChatsForUser?userId="+this.SY_UserGuid);
// }

// // List of ChatMemberDTO
// getUsersForChat(chatId: string): Observable<any[]> {
//   return this.http.get<any[]>(this.APIUrl + "sayyo/chat/getUsersForChat?chatId=" + chatId);
// }

// // Returns Created and chatGuid
// createChat(chatType: number, chatName: string) {
//   this.SY_AddChatDTO = {
//       ChatType: chatType,
//       Name: chatName
//   }
//   return this.http.post(this.APIUrl + "sayyo/chat/createChat/", this.SY_AddChatDTO);
// }

// // Returns Created and chat member guid
// addChatMember(chatGuid: string, userId: string, memberRole: number = 0) {
//   this.SY_AddChatMemberDTO = {
//       ChatId: chatGuid,
//       UserId: userId,
//       Role: memberRole
//   }
//   return this.http.post(this.APIUrl + "sayyo/chat/addChatMember/", this.SY_AddChatMemberDTO);
// }

// // Returns no content
// updateChatMember(memberId: string, userId: string, chatId: string, chatRole: number = 0) {
//   this.SY_UpdateChatMemberDTO = {
//       Id: memberId,
//       ChatId: chatId,
//       UserId: userId,
//       Role: chatRole
//   }
//   return this.http.put(this.APIUrl + "sayyo/chat/updateChatMember/", this.SY_UpdateChatMemberDTO);
// }

// // Returns no content
// deleteChatMember(id:string){
//   return this.http.delete(this.APIUrl + "sayyo/chat/deleteChatMember?id=" + id);
// }

// // ----------------------------------------------------------------------------------------------------------------------------------------------
// // FriendshipController
// //
// // .. some info ..
// // FriendshipStatusEnum: 0 - awaiting, 1 - friend, 2 - blocked, 3 - unknown (this one is not in sql _ but if group member is not known)
// // blockFromUser/blockFromFriend - 0 - none, 1 - active
// // invitation - 0 - awaiting, 1 - accepted, 2 - rejected, 4 - unknown (not in sql)

// // Returns Created and friendship guid
// inviteFriend(friendGuid: string) {
//   // I use SY_UserGuid because it's default variable to store GUID from api
//   this.SY_AddFriendshipDTO = {
//       UserId: this.SY_UserGuid,
//       FriendId: friendGuid,
//       Status: 0
//   }
//   return this.http.post(this.APIUrl + "sayyo/friendship/add/", this.SY_AddFriendshipDTO);
// }

// // Returns no content
// updateFriendshipStatus(friendhipGuid: string, friendGuid: string, status: number, blockFromUser: number, blockFromFriend: number) {
//   // Friendship status is unknown - backend set proper value
//   this.SY_UpdateFriendshipDTO = {
//       Guid: friendhipGuid,
//       UserId: this.SY_UserGuid,
//       FriendId: friendGuid,
//       Status: status,
//       BlockFromUser: blockFromUser,
//       BlockFromFriend: blockFromFriend
//   }
//   return this.http.put(this.APIUrl + "sayyo/friendship/update/", this.SY_UpdateFriendshipDTO);
// }

// deleteFriendship(friendshipGuid: string) {
//   return this.http.delete(this.APIUrl + "sayyo/friendship/delete?friendshipGuid=" + friendshipGuid);
// }

// // Returns list of FriendshipDTO
// getFriendsList(): Observable<any[]> {
//   return this.http.get<any[]>(this.APIUrl + `sayyo/friendship/findAllForUser?userId=${this.SY_UserGuid}`);
// }

// // Returns specific FriendshipDTO
// getFriendship(friendGuid: string) {
//   this.SY_FindFriendshipDTO = {
//       UserId: this.SY_UserGuid,
//       FriendId: friendGuid
//   }
//   return this.http.get(this.APIUrl + "sayyo/friendship/find/", this.SY_FindFriendshipDTO);
// }

// ----------------------------------------------------------------------------------------------------------------------------------------------
// MessageController
//
// MessageDTO: id, chatId, senderId, content, sentAt

// // Returns no content
// sendMessage(chatGuid: string, content: string) {
//   this.SY_SendMessageDTO = {
//       ChatId: chatGuid,
//       SenderId: this.SY_UserGuid,
//       Message: content
//   }
//   return this.http.post(this.APIUrl + "sayyo/message/send/", this.SY_SendMessageDTO, this.httpOptions);
// }

// // Returns list of MessageDTO
// getMesseges(chatGuid: string): Observable<any[]> {
//   return this.http.get<any[]>(this.APIUrl + "sayyo/message/messagesForChat?chatId=" + chatGuid);
// }

// ----------------------------------------------------------------------------------------------------------------------------------------------
// SearchFriendController

// Returns list of UserDTO
getUsersSearchList(val: string): Observable<any[]> {
  if (val.length == 0) {
      return this.http.get<any[]>(this.APIUrl + "sayyo/searchfriend/searchAll/");
  }
  return this.http.get<any[]>(this.APIUrl + "sayyo/searchfriend/searchByUsername?username=" + val);
}

// ----------------------------------------------------------------------------------------------------------------------------------------------
// Other

generateGuidFromInt(inputInt: number): string {
  // Convert integer to hex string
  const hexString: string = inputInt.toString(16);
  // Pad the hexadecimal string with leading zeros to make 32 characters
  const paddedHexString: string = hexString.padStart(32, '0');
  // Create GUID based on hex string
  const generateGuid: string =
      `${paddedHexString.substring(0, 8)}-${paddedHexString.substring(8, 4)}-${paddedHexString.substring(12, 4)}-${paddedHexString.substring(16, 4)}-${paddedHexString.substr(20)}`;
  return generateGuid;
}
}


