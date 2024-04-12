import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MainWindowComponent } from './components/main-window/main-window.component';

import { AccountService } from './services/account.service';
import { CommunicatorService } from './services/communicator.service';
import { LoginWindowComponent } from './components/login-window/login-window.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { BackgroundComponent } from './components/background/background.component';
import { RegistrationWindowComponent } from './components/registration-window/registration-window.component';
import { AppRoutingModule } from './app.routes';

@NgModule({
    declarations: [
        AppComponent,
        MainWindowComponent,
        BackgroundComponent,
        NavigationComponent,
        LoginWindowComponent,
        RegistrationWindowComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        CommonModule,
        HttpClientModule
    ],
    providers: [
        CommunicatorService,
        AccountService
    ],
    schemas: [NO_ERRORS_SCHEMA],
    bootstrap: [AppComponent]
})
export class AppModule {}
