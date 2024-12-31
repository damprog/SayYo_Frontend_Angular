import { Injectable, TemplateRef } from '@angular/core';
import { ModalBaseComponent } from '../components/popup/modal-base/modal-base.component';

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

  showModal(content: string){
    if(this.modalComponent){
      this.modalComponent.show(content);
    }
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
