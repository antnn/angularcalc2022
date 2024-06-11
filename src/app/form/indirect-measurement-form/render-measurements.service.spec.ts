import { TestBed } from '@angular/core/testing';

import { RendererMeasurementsService } from './renderer-measurements.service';

describe('RendererMeasurementsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RendererMeasurementsService = TestBed.get(RendererMeasurementsService);
    expect(service).toBeTruthy();
  });
});
