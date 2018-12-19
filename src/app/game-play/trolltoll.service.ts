import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { TrollToll } from './trolltoll'
import { Observable } from 'rxjs/Observable'


@Injectable({
  providedIn: 'root'
})
export class TrolltollService {
  board = []
  constructor(private http: HttpClient) { }
  getUnits(): Observable<TrollToll[]> {
    return this.http.get<TrollToll[]>("https://troll-toll-db.herokuapp.com/units")
  }
  getBoard() {
    let newArr = []
    for (let i = 0; i < 144; i++) {

      newArr.push({
        id: i + 1,
        piece: {},
        player: null
      })

    }
    this.board = newArr
    return this.board
  }
}
