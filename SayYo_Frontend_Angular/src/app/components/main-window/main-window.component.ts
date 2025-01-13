import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { SignalRService } from '../../services/signalR.service';
import { ContactsService } from '../../services/contacts.service';

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrl: './main-window.component.css',
})
export class MainWindowComponent implements OnInit {
  constructor(
    private _accountService: AccountService,
    private _router: Router,
    private _signalRService: SignalRService,
    private _contactsService: ContactsService,
  ) {}

  ngOnInit() {
    if (!this._accountService.isLoggedIn) {
      this._router.navigate(['/start/login']);
    }else{
      this._signalRService.setupSignalR();
      this._contactsService.setupContactsService();
    }
  }
}
