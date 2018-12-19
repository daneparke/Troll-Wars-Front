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
  start: boolean = false;
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
  setBoard() {

    let knight = this.units.filter(unit => unit.id === 1)[0]
    let mage = this.units.filter(unit => unit.id === 2)[0]
    let ranger = this.units.filter(unit => unit.id === 3)[0]
    let cleric = this.units.filter(unit => unit.id === 4)[0]

    this._TrolltollService.board.map(position => {
      if ((position.id === 129) || (position.id === 130) || (position.id === 131)) {
        position.piece = knight
        position.player = 1
      }
      else if ((position.id === 14) || (position.id === 15) || (position.id === 16)) {
        position.piece = knight
        position.player = 2
      }
      else if ((position.id === 141) || (position.id === 144)) {
        position.piece = ranger
        position.player = 1
      }
      else if ((position.id === 1) || (position.id === 4)) {
        position.piece = ranger
        position.player = 2
      }
      else if (position.id === 143) {
        position.piece = cleric
        position.player = 1
      }
      else if (position.id === 2) {
        position.piece = cleric
        position.player = 2
      }
      else if (position.id === 142) {
        position.piece = mage
        position.player = 1
      }
      else if (position.id === 3) {
        position.piece = mage
        position.player = 2
      }
      return position
    })
  }
}
