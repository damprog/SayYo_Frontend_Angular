import { Injectable } from '@angular/core';
import { ConnectionService } from './connection.service';
import { AccountService } from './account.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { SY_FriendChatDTO, SY_FriendMemberDTO, SY_ResponseStatus } from '../models/dto';
import { FriendsChats } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  constructor(
    private _conn: ConnectionService,
    private _account: AccountService,
    private _http: HttpClient
  ) {
    this.friendsChats.items = new Array<SY_FriendChatDTO>();
  }

  friendsChats: FriendsChats = {
    items: [],
  };

  getFriendsChats(): Observable<SY_ResponseStatus> {
    return this._getFriendsChatsEDP().pipe(
      map((response: Array<SY_FriendChatDTO>) => {
        response.forEach((x) => {
          const newChat: SY_FriendChatDTO = {
            chatGuid: x.chatGuid,
            chatType: x.chatType,
            chatName: x.chatName,
            friend: x.friend,
          };

          this.friendsChats.items.push(newChat);
        });

        return {
          success: true,
          message: '',
        } as SY_ResponseStatus;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('While getting friends chats:', error.message);
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
        'sayyo/misc/getFriendsChats?userId=' +
        this._account.TEST_UserGuid
    );
  }
}
