import { TestBed, inject } from '@angular/core/testing';

import { BoardGameServiceService } from './board-game-service.service';

describe('BoardGameServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BoardGameServiceService]
    });
  });

  it('should be created', inject([BoardGameServiceService], (service: BoardGameServiceService) => {
    expect(service).toBeTruthy();
  }));
});
