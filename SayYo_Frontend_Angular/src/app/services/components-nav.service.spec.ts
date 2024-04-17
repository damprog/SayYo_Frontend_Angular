import { TestBed } from '@angular/core/testing';

import { ComponentsStateService } from './components-state.service';

describe('ComponentsNavService', () => {
  let service: ComponentsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentsStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
