import { TestBed } from '@angular/core/testing';

import { ComponentsNavService } from './components-nav.service';

describe('ComponentsNavService', () => {
  let service: ComponentsNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentsNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
