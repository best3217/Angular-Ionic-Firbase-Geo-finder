import { TestBed } from '@angular/core/testing';

import { DataEventsService } from './data-events.service';

describe('DataEventsService', () => {
  let service: DataEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
