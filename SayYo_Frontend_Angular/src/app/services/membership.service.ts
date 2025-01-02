import { Injectable } from '@angular/core';
import { ConnectionService } from './connection.service';
import { AccountService } from './account.service';
import { HttpClient } from '@angular/common/http';
import { SY_AddChatMemberDTO, SY_CreateGroupChatDTO } from '../models/dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MembershipService {
  constructor(
    private _conn: ConnectionService,
    private _account: AccountService,
    private _http: HttpClient
  ) {}

    // Returns Created and chat member guid
    addChatMember(chatGuid: string, userGuid: string, memberRole: number = 0) {
      const addChatMember: SY_AddChatMemberDTO = {
        chatGuid: chatGuid,
        userGuid: userGuid,
        role: memberRole,
      };
      return this._http.post(
        this._conn.API_URL + 'sayyo/chat/addChatMember/',
        addChatMember
      );
    }

  deleteChatMember(membershipGuid: string){
    return this._http.delete(
      `${this._conn.API_URL}sayyo/chat/deleteChatMember?membershipGuid=${membershipGuid}`
    );
  }
}
