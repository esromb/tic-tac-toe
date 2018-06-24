import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { BoardGameComponent } from './components/board-game/board-game.component';
import {FormsModule} from '@angular/forms';
import {BoardGameServiceService} from './services/board-game-service.service';


@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    BoardGameComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [BoardGameServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
