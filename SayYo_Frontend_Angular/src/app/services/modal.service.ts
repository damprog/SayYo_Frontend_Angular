import { Injectable, TemplateRef } from '@angular/core';
import { ModalBaseComponent } from '../components/popup/modal-base/modal-base.component';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  public modalComponent!: ModalBaseComponent;

  showWithTemplate(template: TemplateRef<any>, context?: any): void {
    if (this.modalComponent) {
      this.modalComponent.showWithTemplate(template, context);
    }
  }

  inform(content: string){
    if(this.modalComponent){
      this.modalComponent.show(content);
    }
  }

  confirmPopup(question: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.modalComponent.showConfirm(question).subscribe((confirmed) => {
        observer.next(confirmed);
        observer.complete();
      });
    });
  }

  hideModal(){
    if(this.modalComponent){
      this.modalComponent.hide();
    }
  }

  registerModal(component: ModalBaseComponent): void {
    this.modalComponent = component;
  }
}
