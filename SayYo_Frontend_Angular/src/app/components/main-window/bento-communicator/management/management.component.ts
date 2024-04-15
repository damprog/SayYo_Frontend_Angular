import { Component } from '@angular/core';
import { ComponentsNavService } from '../../../../services/components-nav.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrl: './management.component.css'
})
export class ManagementComponent {
  community:any;

  constructor(private _cmpNav: ComponentsNavService){
    this.community = _cmpNav.community;
  }

  showAccount(){
    this._cmpNav.community.account = true;
    this._cmpNav.community.friends = false;
    this._cmpNav.community.groups = false;
  }

  showFriends(){
    this._cmpNav.community.account = false;
    this._cmpNav.community.friends = true;
    this._cmpNav.community.groups = false;
  }

  showGroups(){
    this._cmpNav.community.account = false;
    this._cmpNav.community.friends = false;
    this._cmpNav.community.groups = true;
  }
}
