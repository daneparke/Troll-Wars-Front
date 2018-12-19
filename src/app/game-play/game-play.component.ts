import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TrolltollService } from './trolltoll.service';
//import { TrollToll } from '@angular/core/'

@Component({
  selector: 'app-game-play',
  templateUrl: './game-play.component.html',
  styleUrls: ['./game-play.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GamePlayComponent implements OnInit {
  public units = [];
  start:boolean = false;
  constructor(private _TrolltollService: TrolltollService) { }
  
  ngOnInit() {
    this._TrolltollService.getUnits()
      .subscribe(data => {
        this.units = data;
        this.start = true;

      })
      this._TrolltollService.getBoard()
      this.setBoard()
  }
  setBoard(){
    
    let knight = this.units.filter(unit => unit.id===1)[0]
    this._TrolltollService.board.map(position => {
      console.log("hi dane")
      if((position.id===143) || (position.id===2)) {
         position.piece = knight
      }
      return position
    })
    console.log(this._TrolltollService.board)
  }



}
