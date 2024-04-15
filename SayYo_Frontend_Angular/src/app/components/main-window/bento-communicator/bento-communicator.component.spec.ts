import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BentoCommunicatorComponent } from './bento-communicator.component';

describe('BentoCommunicatorComponent', () => {
  let component: BentoCommunicatorComponent;
  let fixture: ComponentFixture<BentoCommunicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BentoCommunicatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BentoCommunicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
