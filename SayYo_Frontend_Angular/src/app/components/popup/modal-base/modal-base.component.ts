import { AfterViewInit, Component, Input, TemplateRef } from '@angular/core';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-modal-base',
  templateUrl: './modal-base.component.html',
  styleUrl: './modal-base.component.css',
})
export class ModalBaseComponent implements AfterViewInit {
  // Modal base
  visibleBase = false;
  content: string = '';
  // Modal with template
  visible = false;
  modalTemplate!: TemplateRef<any>;
  templateContext: any;

  constructor(private _modalService: ModalService) {}

  showWithTemplate(template: TemplateRef<any>, context?: any) {
    this.modalTemplate = template;
    this.templateContext = context;
    this.visible = true;
  }

  show(content: string) {
    this.content = content;
    this.visibleBase = true;
    console.log('Modal show');
  }

  hide() {
    this.visible = false;
    this.visibleBase = false;
    this.content = "";
    this.templateContext = {};
  }

  ngAfterViewInit(): void {
    this._modalService.registerModal(this);
    console.log('Modal init');
  }
}
