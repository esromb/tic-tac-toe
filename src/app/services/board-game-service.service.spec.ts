import { TestBed, inject } from '@angular/core/testing';

import { BoardGameServiceService } from './board-game-service.service';
import {AppModule} from '../app.module';

describe('BoardGameServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [BoardGameServiceService]
    });
  });

  it('should be created', inject([BoardGameServiceService], (service: BoardGameServiceService) => {
    expect(service).toBeTruthy();
  }));
});
