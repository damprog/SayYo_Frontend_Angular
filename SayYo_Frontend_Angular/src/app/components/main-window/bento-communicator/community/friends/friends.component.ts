import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../../../../../services/contacts.service';
import { SpinnerService } from '../../../../../services/spinner.service';
import { SY_FriendChatDTO, SY_ResponseStatus } from '../../../../../models/dto';


@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css'
})
export class FriendsComponent implements OnInit {

  // templateList:any  = [1,2,3,1,2,2,2,2,2,2,2,0,223,12,312,312,3,123,123,123,12,312,312,31,23,1212,3];
  friendsChats: Array<SY_FriendChatDTO> = [];

  constructor(
    private _contacts: ContactsService,
    public spinnerService: SpinnerService
  ) {

  }

  ngOnInit() {
    this.spinnerService.show();
    this.friendsChats = [];
    this._contacts.getFriendsChats().subscribe({
      next: (result: SY_ResponseStatus) => {
        if (result.success) {
          console.log("Pobrano czaty");
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
