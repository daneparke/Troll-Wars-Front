import { Component, OnInit } from '@angular/core';
import { TrolltollService } from './trolltoll.service';
import { TrollToll } from './trolltoll'

@Component({
  selector: 'app-game-play',
  templateUrl: './game-play.component.html',
  styleUrls: ['./game-play.component.scss']
})
export class GamePlayComponent implements OnInit {
  public units = [];
  constructor(private _TrolltollService: TrolltollService) { }

  ngOnInit() {
    this._TrolltollService.getUnits()
      .subscribe(data => console.log(this.units=data))
      this._TrolltollService.getBoard()
  }


}
