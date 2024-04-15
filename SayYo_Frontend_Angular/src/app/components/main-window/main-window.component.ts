import { Component, OnInit } from '@angular/core';
import { CommunicatorService } from '../../services/communicator.service';
import { forkJoin } from 'rxjs';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrl: './main-window.component.css'
})
export class MainWindowComponent implements OnInit {
  constructor(
    private communicator: CommunicatorService,
    private _accountService: AccountService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

}

