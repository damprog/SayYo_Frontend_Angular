import { Component, OnInit } from '@angular/core';
import { CommunicatorService } from '../../services/communicator.service';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrl: './main-window.component.css',
})
export class MainWindowComponent implements OnInit {
  constructor(
    private communicator: CommunicatorService,
    private _accountService: AccountService,
    private _router: Router
  ) {}

  ngOnInit() {
    if (!this._accountService.isLoggedIn) {
      this._router.navigate(['/start/login']);
    }
  }
}
