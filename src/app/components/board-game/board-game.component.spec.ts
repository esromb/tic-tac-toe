import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardGameComponent } from './board-game.component';
import {BoardGameServiceService} from '../../services/board-game-service.service';
import {BoardComponent} from '../board/board.component';
import {AppModule} from '../../app.module';

describe('BoardGameComponent', () => {
  let component: BoardGameComponent;
  let fixture: ComponentFixture<BoardGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [],
      providers: [BoardGameServiceService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
