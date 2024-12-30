import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuComponent } from './context-menu.component';

describe('ChatBarContextMenuComponent', () => {
  let component: ContextMenuComponent;
  let fixture: ComponentFixture<ContextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContextMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
