import { Component } from '@angular/core';
import { ComponentsStateService } from '../../../../services/components-state.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrl: './management.component.css'
})
export class ManagementComponent {

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
