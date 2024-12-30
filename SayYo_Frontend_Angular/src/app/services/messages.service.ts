import { Injectable } from '@angular/core';
import { ConnectionService } from './connection.service';
import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
// import { SY_SendMessageDTO } from '../models/model';
import { SY_SendMessageDTO, SY_MessageDTO, SY_ResponseStatus } from '../models/dto';
import { AccountService } from './account.service';


@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    private _conn: ConnectionService,
    private _account: AccountService,
    private _http: HttpClient
  ) { }

sendMessage(chatGuid: string, content: string): Observable<SY_ResponseStatus>{
  const send: SY_SendMessageDTO = {
    ChatGuid: chatGuid,
    SenderGuid: this._account.account.userGuid,
    Message: content
  }
  return this._sendMessage_EDP(send).pipe(
    map(() => ({
      success: true,
      message: 'Message sent successfully',
    } as SY_ResponseStatus)),
    catchError((error: HttpErrorResponse) => {
      console.error('Failed to send message:', error);
      return of({
        success: false,
        message: error.error,
      } as SY_ResponseStatus);
    })
  );
}

getMessages(chatGuid: string): Observable<Array<SY_MessageDTO>> {
  return this._getMesseges_EDP(chatGuid);
}

// ----------------------------------------------------------------------------------------------------------------------------------------------
// ENDPOINTS
//
// EDP - endpoint

// Returns no content
_sendMessage_EDP(send: SY_SendMessageDTO) {
  return this._http.post(
    this._conn.API_URL + "sayyo/message/send/",
    send,
    this._conn.httpOptions
  );
}

// Returns list of MessageDTO
  _getMesseges_EDP(chatGuid: string): Observable<Array<SY_MessageDTO>> {
    return this._http.get<Array<SY_MessageDTO>>(
      this._conn.API_URL + "sayyo/message/messagesForChat?chatGuid=" + chatGuid
    );
  }
}
