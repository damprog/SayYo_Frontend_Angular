import { Component } from '@angular/core';
import { AccountService } from '../../../../../services/account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent {
  selectedFile: File | null = null;

  constructor(protected _account: AccountService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadProfilePicture(): void {
    if (!this.selectedFile) {
      alert('Wybierz zdjęcie przed przesłaniem.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this._account.uploadProfilePicture(formData);
  }
}
