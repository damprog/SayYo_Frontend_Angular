import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent implements OnDestroy{
  isLoading = false;
  private subscription: Subscription;

  constructor(private spinnerService: SpinnerService){
    this.subscription = this.spinnerService.isLoading$.subscribe(isLoading=>{
      this.isLoading = isLoading;
    })
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }
}
