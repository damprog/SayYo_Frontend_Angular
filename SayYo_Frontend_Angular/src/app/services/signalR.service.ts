import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { SY_MessageDTO } from '../models/dto';
import { ConnectionService } from './connection.service';
import { Subscription } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  constructor(
    private _conn: ConnectionService,
    private _account: AccountService,
  ) {}

  private cleanup_Subscription!: Subscription;
  private hubConnection!: signalR.HubConnection;

  setupSignalR() {
    this.startConnection(this._account.account.userGuid);

    // Add subscription for cleaning
    if (this.cleanup_Subscription) {
      this.cleanup_Subscription.unsubscribe();
    }
    this.cleanup_Subscription = this._account.cleanup_Emitter.subscribe(() => {
      this.stopConnection();
    });
  }

  stopConnection() {
    this.hubConnection.stop();
    console.log('SignalR connection stopped.');
  }

  startConnection(userGuid: string) {
    const token = localStorage.getItem('authToken');
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      console.log('SignalR connection already established.');
      return;
    }

    console.log('SignalR: start connection with token:' + token);

    // Create connection config
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this._conn.API_URL + 'messageHub', {
        accessTokenFactory: () => token || '', // Token automatically added as access_token in query like: "messagehub?my_token=${token}`"
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

  onRefreshActiveFriends(callback: () => void){
    this.hubConnection.off('RefreshActiveFriends');
    this.hubConnection.on('RefreshActiveFriends', callback);
  };

  onRefreshAwaitingFriends(callback: () => void){
    this.hubConnection.off('RefreshAwaitingFriends');
    this.hubConnection.on('RefreshAwaitingFriends', callback);
  };

  onRefreshBlockedFriends(callback: () => void){
    this.hubConnection.off('RefreshBlockedFriends');
    this.hubConnection.on('RefreshBlockedFriends', callback);
  };

  onRefreshGroups(callback: () => void){
    this.hubConnection.off('RefreshGroups');
    this.hubConnection.on('RefreshGroups', callback);
  };
}
