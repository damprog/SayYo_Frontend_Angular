import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationWindowComponent } from './registration-window.component';

describe('RegistrationWindowComponent', () => {
  let component: RegistrationWindowComponent;
  let fixture: ComponentFixture<RegistrationWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationWindowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrationWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
