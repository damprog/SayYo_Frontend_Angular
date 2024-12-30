import { AfterViewInit, Component, Input } from '@angular/core';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-modal-base',
  templateUrl: './modal-base.component.html',
  styleUrl: './modal-base.component.css',
})
export class ModalBaseComponent implements AfterViewInit {
  // @Input() isOpen = false;
  visible = false;
  content: string = '';

  constructor(private _modalService: ModalService) {}

  ngAfterViewInit(): void {
    this._modalService.setModal(this);
    console.log('Modal init');
  }

  hide() {
    this.visible = false;
  }

  show(content: string) {
    this.content = content;
    this.visible = true;
    console.log('Modal show');
  }
}
