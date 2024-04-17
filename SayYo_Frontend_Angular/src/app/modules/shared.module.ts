import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SpinnerComponent } from '../components/spinner/spinner.component';

@NgModule({
  declarations: [
    NavigationComponent,
    SpinnerComponent
  ],
  imports: [CommonModule, FormsModule, RouterModule, BrowserModule],
  exports: [NavigationComponent, SpinnerComponent]
})
export class SharedModule {}
