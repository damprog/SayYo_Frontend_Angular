import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { ModalBaseComponent } from '../components/popup/modal-base/modal-base.component';
import { ContextMenuComponent } from '../components/popup/context-menu/context-menu.component';

@NgModule({
  declarations: [
    NavigationComponent,
    SpinnerComponent,
    ModalBaseComponent,
    ContextMenuComponent
  ],
  imports: [CommonModule, FormsModule, RouterModule, BrowserModule],
  exports: [NavigationComponent, SpinnerComponent, ModalBaseComponent, ContextMenuComponent]
})
export class SharedModule {}
