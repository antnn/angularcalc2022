import { TestBed, inject } from '@angular/core/testing';

import { FormControlToggleService } from './form-control-toggle.service';

describe('FormControlToggleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormControlToggleService]
    });
  });

  it('should be created', inject([FormControlToggleService], (service: FormControlToggleService) => {
    expect(service).toBeTruthy();
  }));
});
