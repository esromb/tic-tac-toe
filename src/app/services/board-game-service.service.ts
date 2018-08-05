import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class BoardGameServiceService {

  private refreshEvent = new Subject<boolean>();
  private paintBoardEvent = new Subject<any>();
  private paintWiningCellEvent = new Subject<any>();
  refreshEventEmitter = this.refreshEvent.asObservable();
  paintBoardEventEmitter = this.paintBoardEvent.asObservable();
  paintWiningCellEventEmitter = this.paintWiningCellEvent.asObservable();

  constructor() { }

  emitRefreshEvent() {
    this.refreshEvent.next(true);
  }
  public paintBoard(row, column, symbol) {
    this.paintBoardEvent.next({paint: true, row: row, column: column, symbol: symbol});
  }
  public paintWinningCells(direction) {
    this.paintWiningCellEvent.next(direction);
  }

}
