import { NgModule, APP_INITIALIZER, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AccountService } from '../services/account.service';
import { CommunicatorService } from '../services/communicator.service';
import { ConnectionService } from '../services/connection.service';
import { SharedModule } from './shared.module';
import { AppRoutingModule } from '../routes/app.routes';

import { AppComponent } from '../app.component';
import { StartWindowComponent } from '../components/start-window/start-window.component';
import { MainWindowComponent } from '../components/main-window/main-window.component';
import { LoginWindowComponent } from '../components/start-window/login-window/login-window.component';
import { RegistrationWindowComponent } from '../components/start-window/registration-window/registration-window.component';
import { BentoCommunicatorComponent } from '../components/main-window/bento-communicator/bento-communicator.component';
import { ChatComponent } from '../components/main-window/bento-communicator/chat/chat.component';
import { CommunityComponent } from '../components/main-window/bento-communicator/community/community.component';
import { LeftMenuComponent } from '../components/main-window/bento-communicator/left-menu/left-menu.component';
import { FriendsComponent } from '../components/main-window/bento-communicator/community/friends/friends.component';
import { GroupsComponent } from '../components/main-window/bento-communicator/community/groups/groups.component';
import { AccountComponent } from '../components/main-window/bento-communicator/community/account/account.component';
import { JwtInterceptor } from '../inceptors/jwt.inceptor';

export function initializeApp(accountService: AccountService) {
  return () => accountService.tryLoginWithToken_Promise();
}

@NgModule({
  declarations: [
    AppComponent,
    StartWindowComponent,
    MainWindowComponent,
    LoginWindowComponent,
    RegistrationWindowComponent,
    BentoCommunicatorComponent,
    ChatComponent,
    CommunityComponent,
    AccountComponent,
    FriendsComponent,
    GroupsComponent,
    LeftMenuComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    SharedModule,
    RouterModule,
    AppRoutingModule,
  ],
  providers: [
    ConnectionService,
    AccountService,
    CommunicatorService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AccountService],
      multi: true,
    },
  ],
  schemas: [NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
