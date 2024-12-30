import { Injectable } from '@angular/core';
import { ConnectionService } from './connection.service';
import { AccountService } from './account.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { SY_FriendChatDTO, SY_GroupChatDTO, SY_ResponseStatus, SY_UserDTO } from '../models/dto';
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
    this.friendsChats_Awaiting.items = new Array<SY_FriendChatDTO>();
    this.friendsChats_Blocked.items = new Array<SY_FriendChatDTO>();
    this.groupChats.items = new Array<SY_GroupChatDTO>();
  }

  friendsChats_Ok: FriendsChats = {
    items: [],
  };

  friendsChats_Awaiting: FriendsChats = {
    items: [],
  };

  friendsChats_Blocked: FriendsChats = {
    items: [],
  };

  groupChats: GroupChats = {
    items: [],
  };

  // ActiveFriends: Array<SY_UserDTO> = [];
  // AwaitingFriends: Array<SY_UserDTO> = [];
  // BlockedFriends: Array<SY_UserDTO> = [];

  getStrangers(): Observable<SY_ResponseStatus> {
    return of({
      success: false,
      message: 'Strangers',
    } as SY_ResponseStatus);
  }

  getFriendChats_Ok(): Observable<SY_ResponseStatus> {
    if (this.friendsChats_Ok.items.length == 0) {
      console.log('getFriendChats_ok');

      return this._getFriendChats_Ok_EDP().pipe(
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
    } else {
      return of({
        success: true,
        message: '',
      } as SY_ResponseStatus);
    }
  }

  getFriendChats_Awaiting(): Observable<SY_ResponseStatus> {
    if (this.friendsChats_Awaiting.items.length == 0) {
      console.log('getFriendChats_Awaiting');

      return this._getFriendChats_Awaiting_EDP().pipe(
        map((response: Array<SY_FriendChatDTO>) => {
          response.forEach((x) => {
            const newChat: SY_FriendChatDTO = {
              chatGuid: x.chatGuid,
              chatType: x.chatType,
              chatName: x.chatName,
              friend: x.friend,
            };
            this.friendsChats_Awaiting.items.push(newChat);
          });
          return {
            success: true,
            message: '',
          } as SY_ResponseStatus;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('While getting awaiting friends chats: ', error.message);
          return of({
            success: false,
            message: error.error,
          } as SY_ResponseStatus);
        })
      );
    } else {
      return of({
        success: true,
        message: '',
      } as SY_ResponseStatus);
    }
  }

  getFriendChats_Blocked(): Observable<SY_ResponseStatus> {
    if (this.friendsChats_Blocked.items.length == 0) {
      console.log('getFriendChats_Blocked');

      return this._getFriendChats_Blocked_EDP().pipe(
        map((response: Array<SY_FriendChatDTO>) => {
          response.forEach((x) => {
            const newChat: SY_FriendChatDTO = {
              chatGuid: x.chatGuid,
              chatType: x.chatType,
              chatName: x.chatName,
              friend: x.friend,
            };
            this.friendsChats_Blocked.items.push(newChat);
          });
          return {
            success: true,
            message: '',
          } as SY_ResponseStatus;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('While getting blocked friends chats: ', error.message);
          return of({
            success: false,
            message: error.error,
          } as SY_ResponseStatus);
        })
      );
    } else {
      return of({
        success: true,
        message: '',
      } as SY_ResponseStatus);
    }
  }


  // getActiveFriends(): Observable<SY_ResponseStatus> {
  //   if (this.ActiveFriends.length == 0) {
  //     console.log('getActiveFriends');

  //     return this._getActiveFriendsEDP().pipe(
  //       map((response: Array<SY_UserDTO>) => {
  //         response.forEach((x) => {
  //           const friend: SY_UserDTO = {
  //             guid: x.guid,
  //             userName: x.userName,
  //             email: x.email,
  //             isAdmin: x.isAdmin,
  //           };
  //           this.ActiveFriends.push(friend);
  //         });
  //         return {
  //           success: true,
  //           message: '',
  //         } as SY_ResponseStatus;
  //       }),
  //       catchError((error: HttpErrorResponse) => {
  //         console.error('While getting active friends: ', error.message);
  //         return of({
  //           success: false,
  //           message: error.error,
  //         } as SY_ResponseStatus);
  //       })
  //     );
  //   } else {
  //     return of({
  //       success: true,
  //       message: '',
  //     } as SY_ResponseStatus);
  //   }
  // }

  // getAwaitingFriends(): Observable<SY_ResponseStatus> {
  //   if (this.AwaitingFriends.length == 0) {
  //     console.log('getAwaitingFriends');

  //     return this._getAwaitingFriendsEDP().pipe(
  //       map((response: Array<SY_UserDTO>) => {
  //         response.forEach((x) => {
  //           const friend: SY_UserDTO = {
  //             guid: x.guid,
  //             userName: x.userName,
  //             email: x.email,
  //             isAdmin: x.isAdmin,
  //           };
  //           this.AwaitingFriends.push(friend);
  //         });
  //         return {
  //           success: true,
  //           message: '',
  //         } as SY_ResponseStatus;
  //       }),
  //       catchError((error: HttpErrorResponse) => {
  //         console.error('While getting awaiting friends: ', error.message);
  //         return of({
  //           success: false,
  //           message: error.error,
  //         } as SY_ResponseStatus);
  //       })
  //     );
  //   } else {
  //     return of({
  //       success: true,
  //       message: '',
  //     } as SY_ResponseStatus);
  //   }
  // }

  // getBlockedFriends(): Observable<SY_ResponseStatus> {
  //   if (this.BlockedFriends.length == 0) {
  //     console.log('getBlockedFriends');
  //     return this._getBlockedFriendsEDP().pipe(
  //       map((response: Array<SY_UserDTO>) => {
  //         response.forEach((x) => {
  //           const friend: SY_UserDTO = {
  //             guid: x.guid,
  //             userName: x.userName,
  //             email: x.email,
  //             isAdmin: x.isAdmin,
  //           };
  //           this.BlockedFriends.push(friend);
  //         });
  //         return {
  //           success: true,
  //           message: '',
  //         } as SY_ResponseStatus;
  //       }),
  //       catchError((error: HttpErrorResponse) => {
  //         console.error('While getting blocked friends: ', error.message);
  //         return of({
  //           success: false,
  //           message: error.error,
  //         } as SY_ResponseStatus);
  //       })
  //     );
  //   } else {
  //     return of({
  //       success: true,
  //       message: '',
  //     } as SY_ResponseStatus);
  //   }
  // }

  getGroupChats(): Observable<SY_ResponseStatus> {
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

        return {
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
  // private _getActiveFriendsEDP(): Observable<Array<SY_UserDTO>> {
  //   return this._http.get<Array<SY_UserDTO>>(
  //     this._conn.API_URL +
  //       'sayyo/misc/getActiveFriends?userGuid=' +
  //       this._account.TEST_UserGuid
  //   );
  // }

  // private _getAwaitingFriendsEDP(): Observable<Array<SY_UserDTO>> {
  //   return this._http.get<Array<SY_UserDTO>>(
  //     this._conn.API_URL +
  //       'sayyo/misc/getAwaitingFriends?userGuid=' +
  //       this._account.TEST_UserGuid
  //   );
  // }

  // private _getBlockedFriendsEDP(): Observable<Array<SY_UserDTO>> {
  //   return this._http.get<Array<SY_UserDTO>>(
  //     this._conn.API_URL +
  //       'sayyo/misc/getBlockedFriends?userGuid=' +
  //       this._account.TEST_UserGuid
  //   );
  // }

  private _getFriendChats_Ok_EDP(): Observable<Array<SY_FriendChatDTO>> {
    return this._http.get<Array<SY_FriendChatDTO>>(
      this._conn.API_URL +
        'sayyo/misc/getActiveFriendChats?userGuid=' +
        this._account.account.userGuid
    );
  }

  private _getFriendChats_Awaiting_EDP(): Observable<Array<SY_FriendChatDTO>> {
    return this._http.get<Array<SY_FriendChatDTO>>(
      this._conn.API_URL +
        'sayyo/misc/getAwaitingFriendChats?userGuid=' +
        this._account.account.userGuid
    );
  }

  private _getFriendChats_Blocked_EDP(): Observable<Array<SY_FriendChatDTO>> {
    return this._http.get<Array<SY_FriendChatDTO>>(
      this._conn.API_URL +
        'sayyo/misc/getBlockedFriendChats?userGuid=' +
        this._account.account.userGuid
    );
  }

  private _getGroupChatsEDP(): Observable<Array<SY_GroupChatDTO>> {
    return this._http.get<Array<SY_GroupChatDTO>>(
      this._conn.API_URL +
        'sayyo/misc/getGroupChats?userGuid=' +
        this._account.account.userGuid
    );
  }

}
