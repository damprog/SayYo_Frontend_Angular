import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../../../../../services/contacts.service';
import { SpinnerService } from '../../../../../services/spinner.service';
import { SY_GroupChatDTO, SY_ResponseStatus } from '../../../../../models/dto';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent implements OnInit{
  //templateList:any  = [1,2,3,1,2,2,2,2,2,2,2,0,223,12,312,312,3,123,123,123,12,312,312,31,23,1212,3];
  groupsChats: Array<SY_GroupChatDTO> = [];

  constructor(
    private _contacts: ContactsService,
    public spinnerService: SpinnerService
  ) {

  }

  ngOnInit() {
    this.spinnerService.show();
    this.groupsChats = [];
    this._contacts.getGroupsChats().subscribe({
      next: (result: SY_ResponseStatus) => {
        if (result.success) {
          this.groupsChats = this._contacts.groupsChats.items;
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
