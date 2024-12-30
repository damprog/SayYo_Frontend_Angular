import { Injectable } from '@angular/core';
import { ModalBaseComponent } from '../components/popup/modal-base/modal-base.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  private modalBaseComponent!: ModalBaseComponent;

 setModal(component: ModalBaseComponent): void {
    this.modalBaseComponent = component;
  }

  showModal(content: string){
    if(this.modalBaseComponent){
      this.modalBaseComponent.show(content);
    }
  }

  hideModal(){
    if(this.modalBaseComponent){
      this.modalBaseComponent.hide();
    }
  }
}
