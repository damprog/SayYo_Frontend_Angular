import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal-base',
  templateUrl: './modal-base.component.html',
  styleUrl: './modal-base.component.css'
})
export class ModalBaseComponent {
  @Input() isOpen = false;

  constructor() { }

  close() {
    this.isOpen = false;
  }

  open() {
    this.isOpen = true;
  }
}
