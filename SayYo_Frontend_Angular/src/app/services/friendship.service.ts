import { Injectable } from '@angular/core';
import { ConnectionService } from './connection.service';
import { AccountService } from './account.service';
import { HttpClient } from '@angular/common/http';
import {
  SY_AddFriendshipDTO,
  SY_FindFriendshipDTO,
  SY_UpdateFriendshipDTO,
} from '../models/dto';
import { Observable } from 'rxjs';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root',
})
export class FriendshipService {
  constructor(
    private _conn: ConnectionService,
    private _account: AccountService,
    private _http: HttpClient
  ) {}

  // ----------------------------------------------------------------------------------------------------------------------------------------------
  // FriendshipController
  //
  // .. some info ..
  // FriendshipStatusEnum: 0 - awaiting, 1 - friend, 2 - blocked, 3 - unknown (this one is not in sql _ but if group member is not known)
  // iBlockedUser/userBlockedMe - 0 - none, 1 - active
  // invitation - 0 - awaiting, 1 - accepted, 2 - rejected, 4 - unknown (not in sql)

  // Returns ok
  inviteFriend(friendGuid: string) {
    const invitation: SY_AddFriendshipDTO = {
      userGuid: this._account.account.userGuid,
      friendGuid: friendGuid,
      status: 0,
    };

    return this._http.post(
      this._conn.API_URL + 'sayyo/friendship/add/',
      invitation,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Returns no content
  updateFriendshipStatus(
    friendGuid: string,
    status: number,
    iBlockedUser: number,
    userBlockedMe: number
  ) {
    const updateFriendship: SY_UpdateFriendshipDTO = {
      userGuid: this._account.account.userGuid,
      friendGuid: friendGuid,
      status: status,
      iBlockedUser: iBlockedUser,
      userBlockedMe: userBlockedMe,
    };

    console.log(
      'Zaktualizowao znajomość: ' +
        this._account.account.userGuid +
        ' z ' +
        friendGuid
    );

    return this._http.put(
      this._conn.API_URL + 'sayyo/friendship/update/',
      updateFriendship
    );
  }

  deleteFriendship(friendshipGuid: string) {
    console.log('Usunięto znajomość: ' + friendshipGuid);
    return this._http.delete(
      this._conn.API_URL +
        'sayyo/friendship/delete?friendshipGuid=' +
        friendshipGuid
    );
  }

  // // Returns list of FriendshipDTO
  // getFriendsList(): Observable<any[]> {
  //   return this._http.get<any[]>(
  //     this._conn.API_URL +
  //       `sayyo/friendship/findAllForUser?userId=${this._account.TEST_UserGuid}`
  //   );
  // }

  // // Returns specific FriendshipDTO
  // getFriendship(friendGuid: string) {
  //   const findFriendship: SY_FindFriendshipDTO = {
  //     userGuid: this._account.TEST_UserGuid,
  //     friendGuid: friendGuid,
  //   };
  //   return this._http.get(
  //     this._conn.API_URL + 'sayyo/friendship/find/',
  //     findFriendship
  //   );
  // }
}
