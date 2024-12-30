import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { SY_MessageDTO } from '../models/dto';
import { ConnectionService } from './connection.service';

@Injectable({
  providedIn: 'root',
})
export class MessageHubService {
  constructor(private _conn: ConnectionService) {}

  private hubConnection!: signalR.HubConnection;

  stopConnection(){
    this.hubConnection.stop();
    console.log('SignalR connection stopped.');
  }

  startConnection(userGuid: string) {
    const token = localStorage.getItem('authToken');
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      console.log('SignalR connection already established.');
      return;
    }

    console.log("token from local storage:" + token);

    // Create connection config
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this._conn.API_URL + 'messageHub', {
        accessTokenFactory: () => token || "", // Token automatically added as access_token in query like: "messagehub?my_token=${token}`"
      })
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
    this.hubConnection.off('ReceiveMessage');
  this.hubConnection.on('ReceiveMessage', callback);
  }
}
