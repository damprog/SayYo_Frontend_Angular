import { SpinnerService } from './services/spinner.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SayYo';

  constructor(public spinnerService: SpinnerService) {}

}
