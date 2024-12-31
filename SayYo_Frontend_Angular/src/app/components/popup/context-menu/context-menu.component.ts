import { ContextMenuService } from '../../../services/context-menu.service';
import { ContextMenu, MenuItem } from '../../../models/model';
import { Component, AfterViewInit, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.css',
})
export class ContextMenuComponent implements AfterViewInit {
  // @Input() menuItems: { label: string; action: () => void }[] = [];
  visible = false;
  contextMenu: ContextMenu = {
    name: '-',
    menuItems: [],
  };

  constructor(
    private _contextMenuService: ContextMenuService
  ) {}

  ngAfterViewInit(): void {
    this._contextMenuService.setContextMenu(this);
  }

  executeAction(item: MenuItem){
    item.action().subscribe(
      () => {},
      () => {},
    );
  }

  showMenu(event: MouseEvent, menuInfo: ContextMenu): void {
    event.preventDefault();
    this.contextMenu = menuInfo;

    const menuElement = document.querySelector('.context-menu') as HTMLElement;
    if (menuElement) {
      menuElement.style.top = `${event.clientY}px`;
      menuElement.style.left = `${event.clientX}px`;
    }

    this.visible = true;
  }

  hideMenu(): void {
    this.visible = false;
    console.log('hide context menu');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    this.hideMenu();
  }
}
