import { Component } from '@angular/core';
import { ComponentsStateService } from '../../../../services/components-state.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrl: './community.component.css'
})
export class CommunityComponent {
  community$ = this._stateService.community$;

  constructor(private _stateService: ComponentsStateService){}

}
