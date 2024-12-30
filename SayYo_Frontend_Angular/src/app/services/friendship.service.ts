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
  // blockFromUser/blockFromFriend - 0 - none, 1 - active
  // invitation - 0 - awaiting, 1 - accepted, 2 - rejected, 4 - unknown (not in sql)

  // Returns Created and friendship guid
  inviteFriend(friendGuid: string) {
    const invitation: SY_AddFriendshipDTO = {
      userGuid: this._account.account.userGuid,
      friendGuid: friendGuid,
      status: 0,
    };
    return this._http.post(
      this._conn.API_URL + 'sayyo/friendship/add/',
      invitation
    );
  }

  // Returns no content
  updateFriendshipStatus(
    friendGuid: string,
    status: number,
    blockFromUser: number,
    blockFromFriend: number
  ) {
    // Friendship status is unknown - backend set proper value
    const updateFriendship: SY_UpdateFriendshipDTO = {
      userGuid: this._account.account.userGuid,
      friendGuid: friendGuid,
      status: status,
      blockFromUser: blockFromUser,
      blockFromFriend: blockFromFriend,
    };
    return this._http.put(
      this._conn.API_URL + 'sayyo/friendship/update/',
      updateFriendship
    );
  }

  deleteFriendship(friendshipGuid: string) {
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
