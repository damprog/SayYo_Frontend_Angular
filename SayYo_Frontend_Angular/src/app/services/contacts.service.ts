import { Injectable } from '@angular/core';
import { ConnectionService } from './connection.service';
import { AccountService } from './account.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { SY_FriendChatDTO, SY_GroupChatDTO, SY_ResponseStatus } from '../models/dto';
import { FriendsChats, GroupChats } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  constructor(
    private _conn: ConnectionService,
    private _account: AccountService,
    private _http: HttpClient
  ) {
    this.friendsChats_Ok.items = new Array<SY_FriendChatDTO>();
  }

  friendsChats_Ok: FriendsChats = {
    items: [],
  };

  groupChats: GroupChats = {
    items: [],
  };

  getStrangers(): Observable<SY_ResponseStatus> {
    return of({
      success: false,
      message: "Strangers",
    } as SY_ResponseStatus);
  }

  getFriendsChats(): Observable<SY_ResponseStatus> {
    this.friendsChats_Ok.items = [];
    return this._getFriendsChatsEDP().pipe(
      map((response: Array<SY_FriendChatDTO>) => {
        response.forEach((x) => {
          const newChat: SY_FriendChatDTO = {
            chatGuid: x.chatGuid,
            chatType: x.chatType,
            chatName: x.chatName,
            friend: x.friend,
          };

          this.friendsChats_Ok.items.push(newChat);
        });

        return {
          success: true,
          message: '',
        } as SY_ResponseStatus;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('While getting friends chats: ', error.message);
        return of({
          success: false,
          message: error.error,
        } as SY_ResponseStatus);
      })
    );
  }

  getGroupChats(): Observable<SY_ResponseStatus>{
    this.groupChats.items = [];
    return this._getGroupChatsEDP().pipe(
      map((response: Array<SY_GroupChatDTO>) => {
        response.forEach((x) => {
          const newChat: SY_GroupChatDTO = {
            chatGuid: x.chatGuid,
            chatType: x.chatType,
            chatName: x.chatName,
            members: x.members,
          };

          this.groupChats.items.push(newChat);
        });

        return{
          success: true,
          message: '',
        } as SY_ResponseStatus;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('While getting groups chats: ', error.message);
        return of({
          success: false,
          message: error.error,
        } as SY_ResponseStatus);
      })
    );
  }

  // ----------------------------------------------------------------------------------------------------------------------------------------------
  // ENDPOINTS
  //
  // EDP - endpoint

  // httpOptions not used
  private _getFriendsChatsEDP(): Observable<Array<SY_FriendChatDTO>> {
    return this._http.get<Array<SY_FriendChatDTO>>(
      this._conn.API_URL +
        'sayyo/misc/getFriendsChats?userGuid=' +
        this._account.TEST_UserGuid
    );
  }

  private _getGroupChatsEDP(): Observable<Array<SY_GroupChatDTO>> {
    return this._http.get<Array<SY_GroupChatDTO>>(
      this._conn.API_URL +
      "sayyo/misc/getGroupChats?userGuid=" +
      this._account.TEST_UserGuid);
  }

  // NOTE! - moved from comunicator.service

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

}
