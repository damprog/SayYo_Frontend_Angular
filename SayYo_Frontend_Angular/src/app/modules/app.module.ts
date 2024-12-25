import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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
import { CommunicatorComponent } from './../components/main-window/communicator/communicator.component';
import { BentoCommunicatorComponent } from '../components/main-window/bento-communicator/bento-communicator.component';
import { ChatComponent } from '../components/main-window/bento-communicator/chat/chat.component';
import { CommunityComponent } from '../components/main-window/bento-communicator/community/community.component';
import { LeftMenuComponent } from '../components/main-window/bento-communicator/left-menu/left-menu.component';
import { FriendsComponent } from '../components/main-window/bento-communicator/community/friends/friends.component';
import { GroupsComponent } from '../components/main-window/bento-communicator/community/groups/groups.component';
import { CommunicatorWindowComponent } from '../components/communicator-window/communicator-window.component';
import { AccountComponent } from '../components/main-window/bento-communicator/community/account/account.component';

@NgModule({
  declarations: [
    AppComponent,
    StartWindowComponent,
    MainWindowComponent,
    LoginWindowComponent,
    RegistrationWindowComponent,
    CommunicatorComponent,
    BentoCommunicatorComponent,
    ChatComponent,
    CommunityComponent,
    AccountComponent,
    FriendsComponent,
    GroupsComponent,
    LeftMenuComponent,
    CommunicatorWindowComponent
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
  providers: [ConnectionService, AccountService, CommunicatorService],
  schemas: [NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
