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
}
