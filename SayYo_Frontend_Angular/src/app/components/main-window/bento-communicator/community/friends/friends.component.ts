import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../../../../../services/contacts.service';
import { SpinnerService } from '../../../../../services/spinner.service';
import { SY_FriendChatDTO, SY_ResponseStatus } from '../../../../../models/dto';
import { ComponentsStateService } from '../../../../../services/components-state.service';


@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css'
})
export class FriendsComponent implements OnInit {

  // templateList:any  = [1,2,3,1,2,2,2,2,2,2,2,0,223,12,312,312,3,123,123,123,12,312,312,31,23,1212,3];
  friendsChats: Array<SY_FriendChatDTO> = [];
  friendsStatusComp$ = this._stateService.friendsStatus$;

  constructor(
    private _contacts: ContactsService,
    private _stateService: ComponentsStateService,
    public spinnerService: SpinnerService
  ) { }

  showFriends_StatusOk() {
    this._stateService.showFriends_StatusOk();
  }

  showFriends_StatusInvitations() {
    this._stateService.showFriends_StatusInvitations();
  }

  showFriends_StatusBlocked() {
    this._stateService.showFriends_StatusBlocked();
  }

  ngOnInit() {
    this.spinnerService.show();
    this.friendsChats = [];
    this._contacts.getFriendsChats().subscribe({
      next: (result: SY_ResponseStatus) => {
        if (result.success) {
          this.friendsChats = this._contacts.friendsChats.items;
        } else {
          alert(result.message);
        }
      },
      error: (error) => {
        alert('Wystąpił błąd podczas ładowania czatów.');
        console.error('Error during loading chats: ', error);
        this.spinnerService.hide();
      },
      complete: () => {
        this.spinnerService.hide();
      }
    });
  }
}
