import { TestBed, inject } from '@angular/core/testing';

import { LSMQuestionsService } from './lsmquestions.service';

describe('LSMQuestionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LSMQuestionsService]
    });
  });

  it('should be created', inject([LSMQuestionsService], (service: LSMQuestionsService) => {
    expect(service).toBeTruthy();
  }));
});
