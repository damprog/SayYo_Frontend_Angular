import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MainWindowComponent } from './main-window/main-window.component';

import { AccountService } from './account.service';
import { CommunicatorService } from './communicator.service';

@NgModule({
    declarations: [
        AppComponent,
        MainWindowComponent,
    ],
    imports: [
        BrowserModule,
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
