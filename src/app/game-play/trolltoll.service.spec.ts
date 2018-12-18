import { TestBed } from '@angular/core/testing';

import { TrolltollService } from './trolltoll.service';

describe('TrolltollService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrolltollService = TestBed.get(TrolltollService);
    expect(service).toBeTruthy();
  });
});
