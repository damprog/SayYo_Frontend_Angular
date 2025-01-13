import { Router } from '@angular/router';
import { AccountService } from './services/account.service';
import { SpinnerService } from './services/spinner.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'SayYo';

  constructor(
    private _account: AccountService,
    private _router: Router,
    public spinnerService: SpinnerService
  ) {}

  ngOnInit() {}
}
