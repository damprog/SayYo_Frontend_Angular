import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginWindowComponent } from './components/login-window/login-window.component';
import { RegistrationWindowComponent } from './components/registration-window/registration-window.component';

export const routes: Routes = [
  { path: '', redirectTo: '/main-page', pathMatch: 'full' },
  {path: 'login', component: LoginWindowComponent},
  {path: 'registration', component: RegistrationWindowComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
