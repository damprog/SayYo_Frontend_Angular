import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { SY_MessageDTO } from '../models/dto';
import { ConnectionService } from './connection.service';

@Injectable({
  providedIn: 'root'
})
export class MessageHubService {
  constructor(
    private _conn: ConnectionService
  ) { }

  private hubConnection!: signalR.HubConnection;

  startConnection(userGuid: string) {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      console.log('SignalR connection already established.');
      return;
    }

    // Create connection config
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this._conn.API_URL+'messagehub?userGuid='+userGuid)
      .build();

    // Start connetion
    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR Connected.');
      })
      .catch((err) => {
        console.error('SignalR Error: ', err);
        // setTimeout(() => this.startConnection(), 5000);
      });

      this.hubConnection.onclose((error) => {
        console.warn('SignalR Connection Closed. Reconnecting...', error);
        // setTimeout(() => this.startConnection(), 5000);
    });
  }

  onReceiveMessage(callback: (message: SY_MessageDTO) => void) {
    this.hubConnection.on('ReceiveMessage', callback);
  }


}
