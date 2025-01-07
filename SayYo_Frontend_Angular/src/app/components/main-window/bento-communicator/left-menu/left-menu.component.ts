import { Component } from '@angular/core';
import { ComponentsStateService } from '../../../../services/components-state.service';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrl: './left-menu.component.css'
})
export class LeftMenuComponent {
// ManagementComponent
  constructor(private _stateService: ComponentsStateService){}
  showAccount(){
    this._stateService.showAccount();
  }

  showFriends(){
    this._stateService.showFriends();
  }

  showGroups(){
    this._stateService.showGroups();
  }

  get isAccountActive(): boolean {
    return this._stateService.communitySubject.getValue().account;
  }

  get isFriendsActive(): boolean {
    return this._stateService.communitySubject.getValue().friends;
  }

  get isGroupsActive(): boolean {
    return this._stateService.communitySubject.getValue().groups;
  }

}
