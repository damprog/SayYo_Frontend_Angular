import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartWindowComponent } from '../components/start-window/start-window.component';
import { MainWindowComponent } from '../components/main-window/main-window.component';
import { LoginWindowComponent } from '../components/start-window/login-window/login-window.component';
import { RegistrationWindowComponent } from '../components/start-window/registration-window/registration-window.component';
import { CommunicatorWindowComponent } from '../components/communicator-window/communicator-window.component';

export const routes: Routes = [
  {
    path: 'start',
    component: StartWindowComponent,
    children: [
      {
        path: 'login',
        component: LoginWindowComponent,
      },
      {
        path: 'registration',
        component: RegistrationWindowComponent,
      },
    ]
  },
  { path: 'comm', component: CommunicatorWindowComponent },
  { path: 'main', component: MainWindowComponent },
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: '**', component: StartWindowComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
