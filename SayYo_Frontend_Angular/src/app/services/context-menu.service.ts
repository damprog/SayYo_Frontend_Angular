import { Injectable } from '@angular/core';
import { ContextMenuComponent } from '../components/popup/context-menu/context-menu.component';
import { ContextMenu } from '../models/model';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {

  constructor() { }

  private contextMenuComponent!: ContextMenuComponent;

  setContextMenu(component: ContextMenuComponent): void {
    this.contextMenuComponent = component;
  }

  showMenu(event: MouseEvent, contextMenu: ContextMenu): void {
    if (this.contextMenuComponent) {
      this.contextMenuComponent.showMenu(event, contextMenu);
    }
  }

  hideMenu(): void {
    if (this.contextMenuComponent) {
      this.contextMenuComponent.hideMenu();
    }
  }
}
