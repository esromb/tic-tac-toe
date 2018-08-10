import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Board} from './board';
import {BoardGameServiceService} from '../../services/board-game-service.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

   boardCells: Board[][];
   isEmpty = true;

  constructor(boardGameServiceService: BoardGameServiceService) {
    boardGameServiceService.refreshEventEmitter.subscribe( isRefreshed => {
       if (isRefreshed) {
         this.refresh();
       }
    });
    boardGameServiceService.paintBoardEventEmitter.subscribe (cellTobePainted => {
      if (cellTobePainted.paint && cellTobePainted.symbol) {
        this.paint(cellTobePainted);
      }
    });
    boardGameServiceService.paintWiningCellEventEmitter.subscribe( paintingDirection => {
       if (paintingDirection.direction && paintingDirection.direction !== '') {
         this.paintWinningCells(paintingDirection);
       }
    });
  }

  @Input()
  tableSize: number;

  @Output()
  clickedElement = new EventEmitter<any>();

  ngOnInit() {
    this.initializeBoard();
  }
  initializeBoard() {
    console.log('size ', this.tableSize);
    this.boardCells = new Array();
    for (let i = 0; i < this.tableSize; i++) {
      this.boardCells[i] = new Array();
      for (let j = 0; j < this.tableSize; j++) {
          const board = new Board();
          board.index = i +  ':' + j;
          this.boardCells[i].push(board);
      }
    }
  }

  clickedCell(board: Board) {
    this.clickedElement.emit({selectedCell: board, cells: this.boardCells});
  }
  refresh() {
    this.initializeBoard();
  }

  private paint(cellTobePainted: any) {
    if (this.tableSize > 0) {
      this.boardCells[cellTobePainted.row][cellTobePainted.column].symbol = cellTobePainted.symbol;
      this.boardCells[cellTobePainted.row][cellTobePainted.column].selected = true;
    }
  }

  private paintWinningCells(paintingDirection) {
     if (paintingDirection.direction === 'VERTICAL' && paintingDirection.winningRowOrColumn >= 0) {
       for (let i = 0; i < this.tableSize; i++) {
         this.boardCells[i][paintingDirection.winningRowOrColumn].winningCell = true;
       }
     } else if (paintingDirection.direction === 'HORIZONTAL' && paintingDirection.winningRowOrColumn >= 0) {
       for (let i = 0; i < this.tableSize; i++) {
         this.boardCells[paintingDirection.winningRowOrColumn][i].winningCell = true;
       }
     } else if (paintingDirection.direction === 'DIAGONALLEFTTORIGHT') {
       for (let i = 0; i < this.tableSize; i++) {
         this.boardCells[i][i].winningCell = true;
       }
     } else if (paintingDirection.direction === 'DIAGONALRIGHTTOLEFT') {
       let downwardLoopCount = 0;
       for (let i = this.tableSize - 1; i >= 0 && downwardLoopCount < this.tableSize; i--) {
         this.boardCells[downwardLoopCount][i].winningCell = true;
         downwardLoopCount++;
       }
     }
  }
}
