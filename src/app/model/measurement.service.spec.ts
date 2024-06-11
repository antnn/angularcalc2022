import { TestBed, inject } from '@angular/core/testing';

import { MeasurementMathService } from './measurement-math.service';

describe('MeasurementMathService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeasurementMathService]
    });
  });

  it('should be created', inject([MeasurementMathService], (service: MeasurementMathService) => {
    expect(service).toBeTruthy();
  }));
});
