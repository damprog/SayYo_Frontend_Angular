import { Component } from '@angular/core';
import { ComponentsNavService } from '../../../../services/components-nav.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrl: './community.component.css'
})
export class CommunityComponent {
  community:any;

  constructor(private _cmpNav: ComponentsNavService){
    this.community = _cmpNav.community;
  }



}
