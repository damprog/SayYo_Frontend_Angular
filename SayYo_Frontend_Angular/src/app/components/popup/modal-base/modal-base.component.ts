import { AfterViewInit, Component, TemplateRef } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal-base',
  templateUrl: './modal-base.component.html',
  styleUrl: './modal-base.component.css',
})
export class ModalBaseComponent implements AfterViewInit {
  // Modal base
  visibleBase = false;
  content: string = '';
  // Modal confirm
  visibleConfirm = false;
  private confirmationSubject = new Subject<boolean>();
  // Modal with template
  visibleTemplate = false;
  modalTemplate!: TemplateRef<any>;
  templateContext: any;

  constructor(private _modalService: ModalService) {}

  showWithTemplate(template: TemplateRef<any>, context?: any) {
    this.modalTemplate = template;
    this.templateContext = context;
    this.visibleTemplate = true;
  }

  showConfirm(question: string): Subject<boolean> {
    this.content = question;
    this.visibleConfirm = true;
    return this.confirmationSubject;
  }

  confirm(result: boolean) {
    this.visibleConfirm = false;
    this.content = "";
    this.confirmationSubject.next(result);
    this.confirmationSubject.complete();
  }

  show(content: string) {
    this.content = content;
    this.visibleBase = true;
    console.log('Modal show');
  }

  hide() {
    this.visibleTemplate = false;
    this.visibleBase = false;
    this.visibleConfirm = false;
    this.content = "";
    this.templateContext = {};
  }

  ngAfterViewInit(): void {
    this._modalService.registerModal(this);
    console.log('Modal init');
  }
}
