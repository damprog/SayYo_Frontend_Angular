import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicatorWindowComponent } from './communicator-window.component';

describe('CommunicatorWindowComponent', () => {
  let component: CommunicatorWindowComponent;
  let fixture: ComponentFixture<CommunicatorWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunicatorWindowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommunicatorWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
