import { EventEmitter, Injectable } from '@angular/core';
import { ConnectionService } from './connection.service';
import { AccountService } from './account.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  Observable,
  Subscription,
  catchError,
  forkJoin,
  map,
  of,
  switchMap,
} from 'rxjs';
import {
  SY_ChatDTO,
  SY_ChatMemberDTO,
  SY_ResponseStatus,
  SY_StrangerDTO,
  SY_UserDTO,
} from '../models/dto';
import { Chats } from '../models/model';
import { SignalRService } from './signalR.service';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  constructor(
    private _conn: ConnectionService,
    private _account: AccountService,
    private _http: HttpClient,
    private _signalRService: SignalRService,
    private sanitizer: DomSanitizer
  ) {
    this.friendsChats_Ok.items = new Array<SY_ChatDTO>();
    this.friendsChats_Ok.refreshNeeded = true;
    this.friendsChats_Awaiting.items = new Array<SY_ChatDTO>();
    this.friendsChats_Awaiting.refreshNeeded = true;
    this.friendsChats_Blocked.items = new Array<SY_ChatDTO>();
    this.friendsChats_Blocked.refreshNeeded = true;
    this.groupChats.items = new Array<SY_ChatDTO>();
    this.groupChats.refreshNeeded = true;
  }

  public onRefreshActiveFriends: EventEmitter<void> = new EventEmitter<void>();
  public onRefreshAwaitingFriends: EventEmitter<void> =
    new EventEmitter<void>();
  public onRefreshBlockedFriends: EventEmitter<void> = new EventEmitter<void>();
  public onRefreshGroups: EventEmitter<void> = new EventEmitter<void>();

  private cleanup_Subscription!: Subscription;

  friendsChats_Ok: Chats = {
    refreshNeeded: true,
    items: [],
  };

  friendsChats_Awaiting: Chats = {
    refreshNeeded: true,
    items: [],
  };

  friendsChats_Blocked: Chats = {
    refreshNeeded: true,
    items: [],
  };

  groupChats: Chats = {
    refreshNeeded: true,
    items: [],
  };

  setupContactsService() {
    // Add subscription for cleaning chat
    if (this.cleanup_Subscription) {
      this.cleanup_Subscription.unsubscribe();
    }
    this.cleanup_Subscription = this._account.cleanup_Emitter.subscribe(() => {
      this.cleanup();
    });

    // Register events
    this._signalRService.onRefreshActiveFriends(() => {
      this.friendsChats_Ok.refreshNeeded = true;
      this.onRefreshActiveFriends.emit();
    });

    this._signalRService.onRefreshAwaitingFriends(() => {
      this.friendsChats_Awaiting.refreshNeeded = true;
      this.onRefreshAwaitingFriends.emit();
    });

    this._signalRService.onRefreshBlockedFriends(() => {
      this.friendsChats_Blocked.refreshNeeded = true;
      this.onRefreshBlockedFriends.emit();
    });

    this._signalRService.onRefreshGroups(() => {
      this.groupChats.refreshNeeded = true;
      this.onRefreshGroups.emit();
    });
  }

  cleanup() {
    console.log(
      'Before Released FriendChats',
      this.friendsChats_Ok.items,
      this.friendsChats_Awaiting.items,
      this.friendsChats_Blocked.items
    );

    this.friendsChats_Ok.items = [];
    this.friendsChats_Awaiting.items = [];
    this.friendsChats_Blocked.items = [];

    console.log(
      'Released FriendChats',
      this.friendsChats_Ok.items,
      this.friendsChats_Awaiting.items,
      this.friendsChats_Blocked.items
    );

    this.friendsChats_Ok.items = [];
    this.friendsChats_Ok.refreshNeeded = true;
    this.friendsChats_Awaiting.items = [];
    this.friendsChats_Awaiting.refreshNeeded = true;
    this.friendsChats_Blocked.items = [];
    this.friendsChats_Blocked.refreshNeeded = true;
    this.groupChats.items = [];
    this.groupChats.refreshNeeded = true;
  }

  getStrangers(amount: number): Observable<Array<SY_StrangerDTO>> {
    return this._http
      .get<Array<SY_StrangerDTO>>(
        `${this._conn.API_URL}sayyo/misc/getStrangers?userGuid=${this._account.account.userGuid}&amount=${amount}`
      )
      .pipe(
        map((response: Array<SY_StrangerDTO>) => {
          return response.map((item) => ({
            guid: item.guid,
            userName: item.userName,
          }));
        })
      );
  }

  getStrangersWithFilter(search: string): Observable<Array<SY_StrangerDTO>> {
    const filter: string = 'filter:' + search;
    return this._http
      .get<Array<SY_StrangerDTO>>(
        `${this._conn.API_URL}sayyo/misc/getStrangersWithFilter?userGuid=${
          this._account.account.userGuid
        }&amount=${50}&search=${filter}`
      )
      .pipe(
        map((response: Array<SY_StrangerDTO>) => {
          return response.map((item) => ({
            guid: item.guid,
            userName: item.userName,
          }));
        })
      );
  }

  loadProfilePictureForUsers(users: Array<SY_ChatMemberDTO>): Observable<Array<SY_ChatMemberDTO>> {
    const observables = users.map((user) => {
      if (!user.guid) {
        console.error('Brak userGuid dla użytkownika:', user);
        return of(user);
      }

      return this._account.getProfilePicture(user.guid).pipe(
        map((blob) => {
          const url = URL.createObjectURL(blob);
          user.profilePicture = this.sanitizer.bypassSecurityTrustUrl(url);
          return user;
        }),
        catchError((error) => {
          console.error('Błąd pobierania zdjęcia:', error);
          return of(user);
        })
      );
    });

    return forkJoin(observables);
  }

  getFriendChats_Ok(): Observable<SY_ResponseStatus> {
    console.log(
      'getFriendChats_ok - before if: ' + this.friendsChats_Ok.refreshNeeded
    );

    if (this.friendsChats_Ok.refreshNeeded) {
      this.friendsChats_Ok.items = [];
      this.friendsChats_Ok.refreshNeeded = false;
      console.log('getFriendChats_ok');

      return this._getFriendChats_Ok_EDP().pipe(
        switchMap((response: Array<SY_ChatDTO>) => {
          const chatObservables = response.map((chat) =>
            this.loadProfilePictureForUsers(chat.members).pipe(
              map((membersWithPictures) => {
                const newChat: SY_ChatDTO = {
                  chatGuid: chat.chatGuid,
                  chatType: chat.chatType,
                  chatName: chat.chatName,
                  members: membersWithPictures,
                };
                this.friendsChats_Ok.items.push(newChat);
              })
            )
          );

          return forkJoin(chatObservables).pipe(
            map(() => ({
              success: true,
              message: '',
            } as SY_ResponseStatus))
          );
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
    if (this.friendsChats_Awaiting.refreshNeeded) {
      this.friendsChats_Awaiting.items = [];
      this.friendsChats_Awaiting.refreshNeeded = false;

      console.log('getFriendChats_Awaiting');

      return this._getFriendChats_Awaiting_EDP().pipe(
        switchMap((response: Array<SY_ChatDTO>) => {
          const chatObservables = response.map((chat) =>
            this.loadProfilePictureForUsers(chat.members).pipe(
              map((membersWithPictures) => {
                const newChat: SY_ChatDTO = {
                  chatGuid: chat.chatGuid,
                  chatType: chat.chatType,
                  chatName: chat.chatName,
                  members: membersWithPictures,
                };
                this.friendsChats_Awaiting.items.push(newChat);
              })
            )
          );

          return forkJoin(chatObservables).pipe(
            map(() => ({
              success: true,
              message: '',
            } as SY_ResponseStatus))
          );
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

  getFriendChats_Blocked(): Observable<SY_ResponseStatus> {
    if (this.friendsChats_Blocked.refreshNeeded) {
      this.friendsChats_Blocked.items = [];
      this.friendsChats_Blocked.refreshNeeded = false;

      console.log('getFriendChats_Blocked');

      return this._getFriendChats_Blocked_EDP().pipe(
        switchMap((response: Array<SY_ChatDTO>) => {
          const chatObservables = response.map((chat) =>
            this.loadProfilePictureForUsers(chat.members).pipe(
              map((membersWithPictures) => {
                const newChat: SY_ChatDTO = {
                  chatGuid: chat.chatGuid,
                  chatType: chat.chatType,
                  chatName: chat.chatName,
                  members: membersWithPictures,
                };
                this.friendsChats_Blocked.items.push(newChat);
              })
            )
          );

          return forkJoin(chatObservables).pipe(
            map(() => ({
              success: true,
              message: '',
            } as SY_ResponseStatus))
          );
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

  getGroupChats(): Observable<SY_ResponseStatus> {
    if (this.groupChats.refreshNeeded) {
      this.groupChats.items = [];
      this.groupChats.refreshNeeded = false;

      console.log('loading groupChats');

      return this._getGroupChatsEDP().pipe(
        map((response: Array<SY_ChatDTO>) => {
          response.forEach((x) => {
            const newChat: SY_ChatDTO = {
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
    } else {
      return of({
        success: true,
        message: '',
      } as SY_ResponseStatus);
    }
  }

  private _getFriendChats_Ok_EDP(): Observable<Array<SY_ChatDTO>> {
    return this._http.get<Array<SY_ChatDTO>>(
      this._conn.API_URL +
        'sayyo/misc/getActiveFriendChats?userGuid=' +
        this._account.account.userGuid
    );
  }

  private _getFriendChats_Awaiting_EDP(): Observable<Array<SY_ChatDTO>> {
    return this._http.get<Array<SY_ChatDTO>>(
      this._conn.API_URL +
        'sayyo/misc/getAwaitingFriendChats?userGuid=' +
        this._account.account.userGuid
    );
  }

  private _getFriendChats_Blocked_EDP(): Observable<Array<SY_ChatDTO>> {
    return this._http.get<Array<SY_ChatDTO>>(
      this._conn.API_URL +
        'sayyo/misc/getBlockedFriendChats?userGuid=' +
        this._account.account.userGuid
    );
  }

  private _getGroupChatsEDP(): Observable<Array<SY_ChatDTO>> {
    return this._http.get<Array<SY_ChatDTO>>(
      this._conn.API_URL +
        'sayyo/misc/getGroupChats?userGuid=' +
        this._account.account.userGuid
    );
  }
}
