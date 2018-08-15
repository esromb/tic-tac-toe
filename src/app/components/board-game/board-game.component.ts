import {Component, OnInit} from '@angular/core';
import {BoardGameServiceService} from '../../services/board-game-service.service';
import {Player} from './player';
import {Board} from '../board/board';

@Component({
  selector: 'app-board-game',
  templateUrl: './board-game.component.html',
  styleUrls: ['./board-game.component.css']
})
export class BoardGameComponent implements OnInit {

  selectedPlayers = 1 ;
  selectedBoard =  -1;
  isAgainstComputer = false;
  gameOver = false;
  message = null;
  player2 = new Player();
  player1 = new Player(); /**player one is computer if the user choose 1 player **/


  constructor(private boardGameServiceService: BoardGameServiceService) {
    this.player1.playing = true;
  }

  ngOnInit() {
  }

  refresh() {
    this.selectedPlayers = 1 ;
    this.selectedBoard =  -1;
    this.gameOver = false;
    this.isAgainstComputer = false;
    this.boardGameServiceService.emitRefreshEvent();
  }

  initTheGame(event) {
    if (this.selectedPlayers > 0 && this.selectedBoard > -1) {
      if (this.player1.playing) {
        this.player2.playing = true;
        this.player1.playing = false;
        this.player1.symbol = 'X';
        this.player2.symbol = 'O';
      } else {
        this.player2.playing = false;
        this.player1.playing = true;
        this.player1.symbol = 'O';
        this.player2.symbol = 'X';
      }
      /** Make the first player a computer **/
      if (Number(this.selectedPlayers) === 1 ) {
        console.log('this.selectedPlayers === 1', true);
        this.player1.isComputer = true;
        this.isAgainstComputer = true;
        if (this.player1.playing) {
          this.playComputerRandomTicTacToe((Number(this.selectedBoard) === 0 ? 3 : 4), this.player1.symbol);
          this.togglePlayer();
        }
      }
    }
  }
  play(event) {
    let winner = null;
    if (!this.gameOver && !event.selectedCell.selected) {
      const currentPlayer = this.getCurrentPlayer();
      console.log('isAgainstComputer', this.isAgainstComputer);
      if (this.isAgainstComputer && !this.player1.playing && !event.selectedCell.selected) {
        event.selectedCell.selected = true;
        event.selectedCell.symbol = currentPlayer.symbol;
        this.togglePlayer();
        winner = this.determineGameIsOver(event.cells);
        if (winner) {
          this.displayGameOverMessage(winner);
        }
      }
      if (this.isAgainstComputer && this.player1.playing && !this.gameOver) {
        setTimeout( () => {
          this.choosePlayForComputer(event.cells);
          winner = this.determineGameIsOver(event.cells);
          if (winner) {
            this.displayGameOverMessage(winner);
          }
          this.togglePlayer();
        }, 200);
      } else if (!this.gameOver) {
        event.selectedCell.selected = true;
        event.selectedCell.symbol = currentPlayer.symbol;
        this.togglePlayer();
        winner = this.determineGameIsOver(event.cells);
        if (winner) {
          this.displayGameOverMessage(winner);
        }
      }
    }
  }

  private displayGameOverMessage(winner: any) {
    this.gameOver = true;
    if (winner !== this.player1 && winner !== this.player2) {
      this.message = 'Ties! Restart the game';
    } else if (this.isAgainstComputer && winner === this.player1) {
      this.message = 'You lost. Game Over!';
    } else if (winner === this.player1) {
      this.message = 'Player one won. Game Over!';
    } else {
      this.message = 'Player two won. Game Over!';
    }
  }

  private getCurrentPlayer() {
    if (this.player1.playing) {
      console.log('playing player 1');
      return this.player1;
    } else {
      console.log('playing player 2');
      return this.player2;
    }
  }

  private playComputerRandomTicTacToe(selectedBoard: number, symbol: string) {
    const row = Math.floor(Math.random() * Math.floor(selectedBoard));
    const column = Math.floor(Math.random() * Math.floor(selectedBoard));
    setTimeout( () => {
      this.boardGameServiceService.paintBoard(row, column, symbol);
      }, 200);
  }

  private togglePlayer() {
    if (this.player1.playing) {
         this.player1.playing = false;
         this.player2.playing = true;
    } else {
         this.player2.playing = false;
         this.player1.playing = true;
    }
  }

  private determineGameIsOver(cells: Board[][]) {
    let found = false;
    let winner = null;
    let winningRow = 0;
    let winningColumn = 0;
    let direction = '';
    /** row based search **/
    const loopUntil = Number(this.selectedBoard) === 0 ? 3 : 4;
    if (cells && this.selectedPlayers > 0 && this.selectedBoard > -1) {
      const player1Symbol = this.player1.symbol;
      //TODO: refactor duplicate code
      /** row based horizontal search **/
      for (let i = 0; i < loopUntil; i++) {
        let playerOneSelectedValue = 0;
        let playerTwoSelectedValue = 0;
        for (let j = 0; j < loopUntil; j++) {
           if (cells[i][j].selected) {
             if (cells[i][j].symbol === player1Symbol) {
               playerOneSelectedValue++;
             } else {
               playerTwoSelectedValue++;
             }
             winningRow = i;
           }
        }
        if (playerOneSelectedValue === loopUntil) {
          found = true;
          winner = this.player1;
          direction = 'HORIZONTAL';
          break;
        } else if (playerTwoSelectedValue === loopUntil) {
          found = true;
          winner = this.player2;
          direction = 'HORIZONTAL';
          break;
        }
        playerOneSelectedValue = 0;
        playerTwoSelectedValue = 0;
        /** colomn based vertical search **/
        for (let j = 0; j < loopUntil; j++) {
          if (cells[j][i].selected) {
            if (cells[j][i].symbol === player1Symbol) {
              playerOneSelectedValue++;
            } else {
              playerTwoSelectedValue++;
            }
            winningColumn = i;
          }
        }
        if (playerOneSelectedValue === loopUntil) {
          found = true;
          winner = this.player1;
          direction = 'VERTICAL';
          break;
        } else if (playerTwoSelectedValue === loopUntil) {
          found = true;
          winner = this.player2;
          direction = 'VERTICAL';
          break;
        }
      }
      if (!found) {
        /** diagonal based downward search **/
        let playerOneSelectedValue = 0;
        let playerTwoSelectedValue = 0;
        for (let i = 0; i < loopUntil; i++) {
          if (cells[i][i].selected) {
            if (cells[i][i].symbol === player1Symbol) {
              playerOneSelectedValue++;
            } else {
              playerTwoSelectedValue++;
            }
          }
          if (playerOneSelectedValue === loopUntil) {
            found = true;
            winner = this.player1;
            direction = 'DIAGONALLEFTTORIGHT';
          } else if (playerTwoSelectedValue === loopUntil) {
            found = true;
            winner = this.player2;
            direction = 'DIAGONALLEFTTORIGHT';
          }
        }
        if (!found) {
          playerOneSelectedValue = 0;
          playerTwoSelectedValue = 0;
          /** diagonal based upward search **/
          let downwardLoopCount = 0;
          for (let j = loopUntil - 1; j >= 0 && downwardLoopCount < loopUntil; j--) {
            if (cells[downwardLoopCount][j].selected) {
              if (cells[downwardLoopCount][j].symbol === player1Symbol) {
                playerOneSelectedValue++;
              } else {
                playerTwoSelectedValue++;
              }
              downwardLoopCount++;
            }
          }
          if (playerOneSelectedValue === loopUntil) {
            found = true;
            winner = this.player1;
            direction = 'DIAGONALRIGHTTOLEFT';
          } else if (playerTwoSelectedValue === loopUntil) {
            found = true;
            winner = this.player2;
            direction = 'DIAGONALRIGHTTOLEFT';
          }
        }
      }

    }
    if (!found || !winner) {
      let totalSelectedCells = 0;
      for (let i = 0; i < loopUntil; i++) {
        for (let j = 0; j < loopUntil; j++) {
            if (cells[i][j].selected) {
              totalSelectedCells++;
            }

          }
          if (totalSelectedCells === loopUntil * loopUntil) {
            return new Player();
          }
      }
      return null;
    }
    if (direction && direction !== '') {
      let winningRowOrColumn = 0;
      if (direction === 'HORIZONTAL' ) {
        winningRowOrColumn =  winningRow;
      } else if (direction === 'VERTICAL') {
        winningRowOrColumn = winningColumn;
      }
      this.boardGameServiceService.paintWinningCells({direction: direction, winningRowOrColumn: winningRowOrColumn});
    }
    return winner;
  }

  private choosePlayForComputer(cells: Board[][]) {
    /** this is the tic tac toe from computer */
    if (cells && this.selectedPlayers > 0 && this.selectedBoard > -1) {
      const loopUntil = Number(this.selectedBoard) === 0 ? 3 : 4;
      const winningPosition = this.chooseWinningStrategy(cells, loopUntil);
      const loosingPosition = this.getLoosingPosition(cells, loopUntil);
      if (winningPosition == null && loosingPosition && loosingPosition.direction !== '') {
        switch (loosingPosition.direction) {
          case 'HORIZONTAL':
            this.markHorizontalForComputer(cells, loosingPosition.row, loopUntil);
            break;
          case 'VERTICAL':
            this.markVerticalForComputer(cells, loosingPosition.column, loopUntil);
            break;
          case 'DIAGONALLEFTTORIGHT':
            this.markDIAGONALLEFTTORIGHTForComputer(cells, loopUntil);
            break;
          case 'DIAGONALRIGHTTOLEFT':
            this.markDiagonalUpWardForComputer(cells, loopUntil);
            break;

        }
        return;
      }
      if (winningPosition && winningPosition.direction !== '') {
        switch (winningPosition.direction) {
          case 'HORIZONTAL':
            this.markHorizontalForComputer(cells, winningPosition.row, loopUntil);
            break;
          case 'VERTICAL':
            this.markVerticalForComputer(cells, winningPosition.column, loopUntil);
            break;
          case 'DIAGONALLEFTTORIGHT':
            this.markDIAGONALLEFTTORIGHTForComputer(cells, loopUntil);
            break;
          case 'DIAGONALRIGHTTOLEFT':
            this.markDiagonalUpWardForComputer(cells, loopUntil);
            break;

        }
        return;
      }
      for (let i = 0; i < loopUntil; i++) {
        for (let j = 0; j < loopUntil; j++) {
          if (cells[i][j].selected &&
            cells[i][j].symbol === this.player1.symbol &&
            j + 1 < loopUntil &&
            !cells[i][j + 1].selected) {
            cells[i][j + 1].selected = true;
            cells[i][j + 1].symbol = this.player1.symbol;
            return;
          }
          if (!cells[j][i].selected &&
            cells[j][i].symbol === this.player1.symbol &&
            i + 1 < loopUntil &&
            !cells[j][i + 1].selected) {
            cells[j][i + 1].symbol = this.player1.symbol;
            return;
          }
        }
      }
      for (let i = 0; i < loopUntil; i++) {
        for (let j = 0; j < loopUntil; j++) {
          if (!cells[i][j].selected) {
            cells[i][j].selected = true;
            cells[i][j].symbol = this.player1.symbol;
            return;
          }
        }
      }
      return;
    }
  }

  private getLoosingPosition(cells: Board[][], dimension: number) {
    let skippedDiagonalCell = null;
    let opponentSimilarStepDiagonal = 0;
    for (let i = 0; i < dimension; i++) {
      let opponentSimilarStepHorizontal = 0;
      let opponentSimilarStepVertical = 0;
      let skippedHorizontalCell = null;
      let skippedVerticalCell = null;
      skippedDiagonalCell = null;
      let columnCounter = 0;
      for (let j = 0; j < dimension; j++) {
          if (cells[i][j].selected && cells[i][j].symbol !== this.player1.symbol) {
            opponentSimilarStepHorizontal++;
          } else {
            skippedHorizontalCell = cells[i][j];
          }
          if (opponentSimilarStepHorizontal === dimension - 1 && skippedHorizontalCell && !skippedHorizontalCell.selected) {
            return {row: i, column: j, direction: 'HORIZONTAL'};
          } else if (opponentSimilarStepHorizontal === dimension - 1 && skippedHorizontalCell == null
            && j + 1 < dimension && !cells[i][j + 1].selected) {
            return {row: i, column: j, direction: 'HORIZONTAL'};
          }
          if (cells[j][i].selected && cells[j][i].symbol !== this.player1.symbol) {
            opponentSimilarStepVertical++;
          } else if (!cells[j][i].selected) {
            skippedVerticalCell = cells[j][i];
          }
          if (opponentSimilarStepVertical === dimension - 1  && skippedVerticalCell && !skippedVerticalCell.selected) {
            return {row: j, column: i, direction: 'VERTICAL'};
          } else if (opponentSimilarStepVertical === dimension - 1 && skippedVerticalCell == null
            && j + 1 < dimension && !cells[j + 1][i].selected) {
            return {row: j + 1, column: i, direction: 'VERTICAL'};
          }
        columnCounter++;
      }
      /** diagonal search downward**/
      if (cells[i][i].selected && cells[i][i].symbol !== this.player1.symbol) {
        opponentSimilarStepDiagonal++;
      } else if (!cells[i][i].selected) {
        skippedDiagonalCell = cells[i][i];
      }
      if (opponentSimilarStepDiagonal === dimension - 1 && skippedDiagonalCell && !skippedDiagonalCell.selected) {
        return {row: i, column: i, direction: 'DIAGONALLEFTTORIGHT'};
      } else if (opponentSimilarStepDiagonal === dimension - 1 && skippedDiagonalCell == null
        && i + 1 < dimension && !cells[i + 1][i + 1].selected) {
        return {row: i, column: i, direction: 'DIAGONALLEFTTORIGHT'};
      }
    }

    return this.getDownWardLoosingOrWinningRightToLeftPosition(cells, dimension, this.player1);
  }
  private getDownWardLoosingOrWinningRightToLeftPosition(cells: Board[][], loopUntil: number, player: Player) {
    let opponentSimilarStepVertical = 0;
    let skippedDiagonalCell = null;
    let skippedRow = 0, skippedColumn = 0;
    for (let i = 0, j = loopUntil - 1; i < loopUntil && j >= 0;  j--, i++) {
        if (cells[i][j].selected && cells[i][j].symbol !== player.symbol) {
          opponentSimilarStepVertical++;
        } else if (!cells[i][j].selected) {
          skippedDiagonalCell = cells[i][j];
          skippedRow = i;
          skippedColumn = j;
        }
        if (opponentSimilarStepVertical === loopUntil - 1 && skippedDiagonalCell == null
           && i + 1 < loopUntil && j - 1 > 0 && !cells[i +  1][j - 1].selected) {
          return {row: i + 1, column: j - 1, direction: 'DIAGONALRIGHTTOLEFT'};
        } else if (opponentSimilarStepVertical === loopUntil - 1 && skippedDiagonalCell && !skippedDiagonalCell.selected) {
          return {row: skippedRow, column: skippedColumn, direction: 'DIAGONALRIGHTTOLEFT'};
        }
    }
    return null;
  }
  private markHorizontalForComputer(cells: Board[][], row: number, loopUntil: number) {
    for (let i = 0; i < loopUntil; i++) {
      if (!cells[row][i].selected) {
        cells[row][i].symbol = this.player1.symbol;
        cells[row][i].selected = true;
        break;
      }
    }
  }

  private markVerticalForComputer(cells: Board[][], column: number , loopUntil: number | number) {
    for (let i = 0; i < loopUntil; i++) {
      if (!cells[i][column].selected) {
        cells[i][column].symbol = this.player1.symbol;
        cells[i][column].selected = true;
        break;
      }
    }
  }

  private markDIAGONALLEFTTORIGHTForComputer(cells: Board[][], loopUntil: number) {
    for (let i = 0; i < loopUntil; i++) {
      if (!cells[i][i].selected) {
        cells[i][i].symbol = this.player1.symbol;
        cells[i][i].selected = true;
        break;
      }
    }
  }

  private markDiagonalUpWardForComputer(cells: Board[][], loopUntil: number ) {
    let downwardCount = 0;
    for (let j = loopUntil - 1; j >= 0 && downwardCount < loopUntil; j--) {
      if (!cells[downwardCount][j].selected ) {
        cells[downwardCount][j].symbol = this.player1.symbol;
        cells[downwardCount][j].selected = true;
      }
      downwardCount++;
    }
  }

  private chooseWinningStrategy(cells: Board[][], dimension: number) {
    let computerSimilarStepDiagonal = 0;
    let skippedHorizontalCell = null;
    let skippedVerticalCell = null;
    let skippedDiagonalCell = null;
    for (let i = 0; i < dimension; i++) {
      let computerSimilarStepHorizontal = 0;
      let computerSimilarStepVertical = 0;
      skippedHorizontalCell = null;
      for (let j = 0; j < dimension; j++) {
        if (cells[i][j].selected && cells[i][j].symbol === this.player1.symbol) {
          computerSimilarStepHorizontal++;
        } else {
          skippedHorizontalCell = cells[i][j];
        }
        if (computerSimilarStepHorizontal === dimension - 1 && skippedHorizontalCell && !skippedHorizontalCell.selected) {
          return {row: i, column: j, direction: 'HORIZONTAL'};
        } else if (computerSimilarStepHorizontal === dimension - 1
          && skippedHorizontalCell == null && j + 1 < dimension && !cells[i][j + 1].selected) {
          return {row: i, column: j, direction: 'HORIZONTAL'};
        }
        if (cells[j][i].selected && cells[j][i].symbol === this.player1.symbol) {
          computerSimilarStepVertical++;
        } else if (!cells[j][i].selected) {
          skippedVerticalCell = cells[j][i];
        }
        if (computerSimilarStepVertical === dimension - 1 && skippedVerticalCell && !skippedVerticalCell.selected) {
          return {row: j, column: i, direction: 'VERTICAL'};
        } else if (computerSimilarStepVertical === dimension - 1
          && skippedVerticalCell == null && j + 1 < dimension && !cells[j + 1][i].selected) {
          return {row: j, column: i, direction: 'VERTICAL'};
        }
      }
      /** diagonal search downward**/
      if (cells[i][i].selected && cells[i][i].symbol !== this.player1.symbol) {
        computerSimilarStepDiagonal++;
      } else if (!cells[i][i].selected) {
        skippedDiagonalCell = cells[i][i];
      }
      if (computerSimilarStepDiagonal === dimension - 1 && skippedDiagonalCell && !skippedDiagonalCell.selected) {
        return {row: i, column: i, direction: 'DIAGONALLEFTTORIGHT'};
      } else if (computerSimilarStepDiagonal === dimension - 1
        && skippedDiagonalCell == null && i + 1 < dimension && !cells[i + 1][i + 1].selected) {
        return {row: i, column: i, direction: 'DIAGONALLEFTTORIGHT'};
      }
    }
    let downwardLoopCount = 0;
    computerSimilarStepDiagonal = 0;
    skippedDiagonalCell = null;
    for (let j = dimension - 1; j >= 0 && downwardLoopCount < dimension; j--) {
      if (cells[downwardLoopCount][j].selected && cells[downwardLoopCount][j].symbol === this.player1.symbol) {
        computerSimilarStepDiagonal++;
      } else {
        skippedDiagonalCell = cells[downwardLoopCount][j];
      }
      if (computerSimilarStepDiagonal === dimension - 1 && skippedDiagonalCell && !skippedDiagonalCell.selected) {
        return {row: downwardLoopCount, column: j, direction: 'DIAGONALRIGHTTOLEFT'};
      } else if (computerSimilarStepDiagonal === dimension - 1
        && skippedDiagonalCell == null && downwardLoopCount + 1 < dimension
        && j - 1 < dimension
        && !cells[j - 1][j - 1].selected) {
        return {row: downwardLoopCount, column: j, direction: 'DIAGONALLEFTTORIGHT'};
      }
      downwardLoopCount++;
    }
  }
}
