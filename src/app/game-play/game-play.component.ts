import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TrolltollService } from './trolltoll.service';
import { currentId } from 'async_hooks';
//import { TrollToll } from '@angular/core/'

@Component({
  selector: 'app-game-play',
  templateUrl: './game-play.component.html',
  styleUrls: ['./game-play.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GamePlayComponent implements OnInit {
  selectPiecePhase: boolean = true
  movePiecePhase: boolean = false
  attackPiecePhase: boolean = false
  startingPosition: number = null
  public units = [];
  start: boolean = false;
  public selectedPiece = {};
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
  populateInfo(piece) {
    this.selectedPiece = piece;
  }
  movePiece(event) {
    var currentPlayer = null
    if (this.selectPiecePhase) {

      this.startingPosition = Number(event.currentTarget.id)
      let piece = this._TrolltollService.board.filter(position => position.id === this.startingPosition)
      let y = this.idToCoordinate(piece[0].id)[1]
      let x = this.idToCoordinate(piece[0].id)[0]
      console.log(x, y, "xy")
      this.rangeDetector(piece, x, y)
      this.selectPiecePhase = false
      this.movePiecePhase = true
      console.log(this.startingPosition)

    } else if (this.movePiecePhase) {
      let destination = this._TrolltollService.board.filter(position => position.id === Number(event.currentTarget.id))
      if (destination[0].potentialMove && destination[0].player === null) {
        let piece = this._TrolltollService.board.filter(position => position.id === this.startingPosition)
        console.log("move", Number(event.currentTarget.id))
        let destination = this._TrolltollService.board.filter(position => position.id === Number(event.currentTarget.id))
        console.log(piece, "piece", destination, "Dest")
        destination[0].piece = piece[0].piece
        destination[0].player = piece[0].player
        currentPlayer = piece[0].player
        this._TrolltollService.board.map(position => {
          position.potentialMove = false
          if (position.id === this.startingPosition) {
            return (
              position.piece = {},
              position.player = null
            )

          }
        })
        console.log(this._TrolltollService.board)
        this.movePiecePhase = false
        this.attackPiecePhase = true
      }
      else {
        alert('invalid move')
      }
    } else if (this.attackPiecePhase) {
      let destination = this._TrolltollService.board.filter(position => position.id === Number(event.currentTarget.id))
      if (destination[0].potentialAttack && destination[0].player !== currentPlayer ){

        console.log("attack")
      }
      this.attackPiecePhase = false
      this.selectPiecePhase = true
    }
  }
  idToCoordinate(id) {
    var arr = []
    for (let i = 12; (i * 12) >= id; i--) {
      arr.push(i)
    }
    var y = arr[arr.length - 1]
    var x = (id - ((y - 1) * 12))
    return [x, y]
  }
  rangeDetector(piece, x, y) {
    let potentialMoves = this._TrolltollService.board.map(position => {
      if ((piece[0].piece.moveRange >= (Math.abs(x - this.idToCoordinate(position.id)[0]) + Math.abs(y - this.idToCoordinate(position.id)[1])))) {
        console.log(this.idToCoordinate(position.id)[0], "x2", this.idToCoordinate(position.id)[1], "y2")
        position.potentialMove = true
      }
    })
  }
  attackDetector(piece, x, y) {
    let potentialMoves = this._TrolltollService.board.map(position => {
      if ((piece[0].piece.attackRange >= (Math.abs(x - this.idToCoordinate(position.id)[0]) + Math.abs(y - this.idToCoordinate(position.id)[1])))) {
        console.log(this.idToCoordinate(position.id)[0], "x2", this.idToCoordinate(position.id)[1], "y2")
        position.potentialAttack = true
      }
    })
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
      else if (position.id === 66) {
        position.piece = knight
        position.player = 2
      }
      return position
    })
  }
}
