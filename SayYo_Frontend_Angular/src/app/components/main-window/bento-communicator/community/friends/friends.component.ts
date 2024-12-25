import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../../../../../services/contacts.service';
import { SpinnerService } from '../../../../../services/spinner.service';
import { SY_FriendChatDTO, SY_ResponseStatus, SY_UserDTO } from '../../../../../models/dto';
import { ComponentsStateService } from '../../../../../services/components-state.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css',
})
export class FriendsComponent implements OnInit {
  searchOpen: boolean = false;
  searchPattern: string = "";
  emptyGuid: string = "00000000-0000-0000-0000-000000000000";

  // activeFriends: Array<SY_UserDTO> = [];
  // awaitingFriends: Array<SY_UserDTO> = [];
  // blockedFriends: Array<SY_UserDTO> = [];

  friendsChats_Ok: Array<SY_FriendChatDTO> = [];
  friendsChats_Awaiting: Array<SY_FriendChatDTO> = [];
  friendsChats_Blocked: Array<SY_FriendChatDTO> = [];

  friendsStatusComp$ = this._stateService.friendsStatus$;

  constructor(
    private _contacts: ContactsService,
    private _stateService: ComponentsStateService,
    public spinnerService: SpinnerService
  ) {}

  showChat(friendChat: SY_FriendChatDTO ){
    console.log('showChat(): ' + friendChat.chatGuid + " chatName: " + friendChat.chatName);
  }

  showFriends_StatusOk() {
    this.loadActiveFriends();
    this._stateService.showFriends_StatusOk();
  }

  showFriends_StatusInvitations() {
    this.loadAwaitingFriends();
    this._stateService.showFriends_StatusInvitations();
  }

  showFriends_StatusBlocked() {
    this.loadBlockedFriends();
    this._stateService.showFriends_StatusBlocked();
  }

  toggleSearch() {
    this.searchOpen = !this.searchOpen;
    this.searchPattern="";
  }

  ngOnInit() {
    this.showFriends_StatusOk();
  }

  loadActiveFriends(){
    console.log("loadActiveFriends");

    this.spinnerService.show();
    this.friendsChats_Ok = [];

    this._contacts.getFriendChats_Ok().subscribe({
      next: (result: SY_ResponseStatus) => {
        if (result.success) {
          this.friendsChats_Ok = this._contacts.friendsChats_Ok.items;
        } else {
          alert(result.message);
        }
      },
      error: (error) => {
        alert('Wystąpił błąd podczas ładowania znajomych.');
        console.error('Error during loading active friends: ', error);
        this.spinnerService.hide();
      },
      complete: () => {
        this.spinnerService.hide();
      },
    });
  }

  loadAwaitingFriends(){
    console.log("loadAwaitingFriends");

    this.spinnerService.show();
    this.friendsChats_Awaiting = [];

    this._contacts.getFriendChats_Awaiting().subscribe({
      next: (result: SY_ResponseStatus) => {
        if (result.success) {
          this.friendsChats_Awaiting = this._contacts.friendsChats_Awaiting.items;
        } else {
          alert(result.message);
        }
      },
      error: (error) => {
        alert('Wystąpił błąd podczas ładowania oczekujących znajomych.');
        console.error('Error during loading awaiting friends: ', error);
        this.spinnerService.hide();
      },
      complete: () => {
        this.spinnerService.hide();
      },
    });
  }

  loadBlockedFriends(){
    console.log("loadBlockedFriends");

    this.spinnerService.show();
    this.friendsChats_Blocked = [];

    this._contacts.getFriendChats_Blocked().subscribe({
      next: (result: SY_ResponseStatus) => {
        if (result.success) {
          this.friendsChats_Blocked= this._contacts.friendsChats_Blocked.items;
        } else {
          alert(result.message);
        }
      },
      error: (error) => {
        alert('Wystąpił błąd podczas ładowania zablokowanych znajomych.');
        console.error('Error during loading blocked friends: ', error);
        this.spinnerService.hide();
      },
      complete: () => {
        this.spinnerService.hide();
      },
    });
  }

}
