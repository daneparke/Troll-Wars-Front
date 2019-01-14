import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TrolltollService } from './trolltoll.service';
import { Chart } from 'chart.js'
import { ComponentFactoryResolver } from '@angular/core/src/render3';
// import { currentId } from 'async_hooks';
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
    initiateAttackPiece: boolean = false
    startingPosition: number = null
    populate: boolean = false
    currentPlayer = true
    public units = [];
    start: boolean = false;
    public selectedPiece = null;
    healthChart = []
    attackChart = []
    defenseChart = []
    attackRangeChart = []
    moveRangeChart = []
    coolDownChart = []
    playersLostPlayer1: number = 0
    playersLostPlayer2: number = 0
    gameOver: boolean = false
    winner: string = ""
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
    checkGameOver() {
        if (this.playersLostPlayer2 === 7) {
            this.gameOver = true
            this.winner = "Player 2 Wins!"
        }
        else if (this.playersLostPlayer1 === 7) {
            this.gameOver = true
            this.winner = "Player 1 Wins!"
        }
    }

    deselectUnit() {
        this.selectPiecePhase = true
        this.movePiecePhase = false
        this._TrolltollService.board.map(position => {
            position.potentialMove = false
        })
    }
    noMove() {
        this.movePiecePhase = false
        this.initiateAttackPiece = true
        this._TrolltollService.board.map(position => {
            position.potentialMove = false
        })
        let piece = this._TrolltollService.board.filter(position => position.id === this.startingPosition)
        let y = this.idToCoordinate(piece[0].id)[1]
        let x = this.idToCoordinate(piece[0].id)[0]
        this.attackDetector(piece, x, y)
    }
    skipAttack() {
        this.currentPlayer = !this.currentPlayer
        this.selectPiecePhase = true
        this.attackPiecePhase = false
        this.initiateAttackPiece = false
        this.movePiecePhase = false
        this._TrolltollService.board.map(position => {
            position.potentialAttack = false
        })
        this._TrolltollService.board.map(position => {
            position.potentialMove = false
        })
    }
    isItMyTurn(piece) {
        if ((this.currentPlayer ? 1 : 2) === piece[0].player) {
            return true
        }
        return false
    }

    populateInfo(piece) {
        this.selectedPiece = piece;
        this.healthChart = new Chart('healthChart', {
            type: 'horizontalBar',
            data: {
                datasets: [{
                    data: [this.selectedPiece.health],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                legend: {
                    display: false
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.yLabel;
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            steps: 5,
                            stepValue: 3,
                            max: 15
                        }
                    }]
                }
            }
        });
        this.attackChart = new Chart('attackChart', {
            type: 'horizontalBar',
            data: {
                datasets: [{
                    data: [this.selectedPiece.attack],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.8)',
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                legend: {
                    display: false
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.yLabel;
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            steps: 5,
                            stepValue: 2,
                            max: 8
                        }
                    }]
                }
            }
        });
        this.defenseChart = new Chart('defenseChart', {
            type: 'horizontalBar',
            data: {
                datasets: [{
                    data: [this.selectedPiece.defense],
                    backgroundColor: [
                        'rgba(6, 165, 43, 0.8)',
                    ],
                    borderColor: [
                        'rgba(5, 135, 35, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                legend: {
                    display: false
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.yLabel;
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            steps: 5,
                            stepValue: 1,
                            max: 5
                        }
                    }]
                }
            }
        });
        this.attackRangeChart = new Chart('attackRangeChart', {
            type: 'horizontalBar',
            data: {
                datasets: [{
                    data: [this.selectedPiece.attackRange],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                legend: {
                    display: false
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.yLabel;
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            steps: 4,
                            stepValue: 2,
                            max: 8
                        }
                    }]
                }
            }
        });
        this.moveRangeChart = new Chart('moveRangeChart', {
            type: 'horizontalBar',
            data: {
                datasets: [{
                    data: [this.selectedPiece.moveRange],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.8)',
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                legend: {
                    display: false
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.yLabel;
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            steps: 4,
                            stepValue: 2,
                            max: 8
                        }
                    }]
                }
            }
        });
        this.coolDownChart = new Chart('coolDownChart', {
            type: 'horizontalBar',
            data: {
                datasets: [{
                    data: [this.selectedPiece.coolDown],
                    backgroundColor: [
                        'rgba(6, 165, 43, 0.8)',
                    ],
                    borderColor: [
                        'rgba(5, 135, 35, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                legend: {
                    display: false
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.yLabel;
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            steps: 4,
                            stepValue: 1,
                            max: 4
                        }
                    }]
                }
            }
        });
    }

    movePiece(event) {
        let piece2 = this._TrolltollService.board.filter(position => position.id === Number(event.currentTarget.id))
        if (this.selectPiecePhase && this.isItMyTurn(piece2)) {
            this.startingPosition = Number(event.currentTarget.id)
            let piece = this._TrolltollService.board.filter(position => position.id === this.startingPosition)
            let y = this.idToCoordinate(piece[0].id)[1]
            let x = this.idToCoordinate(piece[0].id)[0]
            this.rangeDetector(piece, x, y)
            this.selectPiecePhase = false
            this.movePiecePhase = true

        } else if (this.movePiecePhase) {
            let destination = this._TrolltollService.board.filter(position => position.id === Number(event.currentTarget.id))
            if (destination[0].potentialMove && destination[0].player === null) {
                let piece = this._TrolltollService.board.filter(position => position.id === this.startingPosition)
                let destination = this._TrolltollService.board.filter(position => position.id === Number(event.currentTarget.id))
                destination[0].piece = piece[0].piece
                destination[0].player = piece[0].player
                this._TrolltollService.board.map(position => {
                    position.potentialMove = false
                    if (position.id === this.startingPosition) {
                        return (
                            position.piece = {},
                            position.player = null
                        )
                    }
                })
                this.movePiecePhase = false
                this.attackPiecePhase = true
            }
            else {
                alert('invalid move')
            }
        } if (this.attackPiecePhase) {
            this.startingPosition = Number(event.currentTarget.id)
            let piece = this._TrolltollService.board.filter(position => position.id === this.startingPosition)
            let y = this.idToCoordinate(piece[0].id)[1]
            let x = this.idToCoordinate(piece[0].id)[0]
            this.attackDetector(piece, x, y)
            this.attackPiecePhase = false
            this.initiateAttackPiece = true

        } else if (this.initiateAttackPiece) {
            let enemyTarget = this._TrolltollService.board.filter(position => position.id === Number(event.currentTarget.id))
            let piece = this._TrolltollService.board.filter(position => position.id === this.startingPosition)
            if (enemyTarget[0].potentialAttack && enemyTarget[0].player !== null) {
                if (piece[0].piece.type === 'Cleric') {
                    if (piece[0].player === enemyTarget[0].player) {
                        enemyTarget[0].piece.health = enemyTarget[0].piece.health + piece[0].piece.attack + 4
                    }
                    else {
                        enemyTarget[0].piece.health = enemyTarget[0].piece.health - piece[0].piece.attack
                    }
                }
                else if (enemyTarget[0].player !== piece[0].player) {
                    enemyTarget[0].piece.health = enemyTarget[0].piece.health - piece[0].piece.attack
                }
                this.initiateAttackPiece = false
                this.selectPiecePhase = true
                this.currentPlayer = !this.currentPlayer
                if (enemyTarget[0].piece.health <= 0) {
                    this._TrolltollService.board.map(position => {
                        if (position.id === enemyTarget[0].id) {
                            if (this.currentPlayer === true) {
                                return (
                                    position.piece = {},
                                    position.player = null,
                                    this.selectedPiece = {},
                                    this.playersLostPlayer2 = this.playersLostPlayer2 + 1
                                )
                            }
                            else {
                                return (
                                    position.piece = {},
                                    position.player = null,
                                    this.selectedPiece = {},
                                    this.playersLostPlayer1 = this.playersLostPlayer1 + 1
                                )
                            }
                        }
                    })
                    this.checkGameOver()
                }
                this._TrolltollService.board.map(position => {
                    position.potentialAttack = false
                })

            }
            else {
                alert('nope')
            }
        } else {
            console.log('please select a valid move')
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
        this._TrolltollService.board.map(position => {
            if ((piece[0].piece.moveRange >= (Math.abs(x - this.idToCoordinate(position.id)[0]) + Math.abs(y - this.idToCoordinate(position.id)[1])))) {
                position.potentialMove = true
            }
        })
    }
    attackDetector(piece1, x, y) {
        this._TrolltollService.board.map(position => {
            if ((piece1[0].piece.attackRange >= (Math.abs(x - this.idToCoordinate(position.id)[0]) + Math.abs(y - this.idToCoordinate(position.id)[1])))) {
                position.potentialAttack = true
            }
        })
    }
    attackCount(piece1, piece2, x, y) {
        this._TrolltollService.board.map(position => {
        })
    }

    setBoard() {
        this.gameOver = false
        this.populate = true
        let knight1 = this.units.filter(unit => unit.id === 1)[0]
        let knight2 = this.units.filter(unit => unit.id === 2)[0]
        let knight3 = this.units.filter(unit => unit.id === 3)[0]
        let knight4 = this.units.filter(unit => unit.id === 4)[0]
        let knight5 = this.units.filter(unit => unit.id === 5)[0]
        let knight6 = this.units.filter(unit => unit.id === 6)[0]
        let mage1 = this.units.filter(unit => unit.id === 7)[0]
        let mage2 = this.units.filter(unit => unit.id === 8)[0]
        let ranger1 = this.units.filter(unit => unit.id === 9)[0]
        let ranger2 = this.units.filter(unit => unit.id === 10)[0]
        let ranger3 = this.units.filter(unit => unit.id === 11)[0]
        let ranger4 = this.units.filter(unit => unit.id === 12)[0]
        let cleric1 = this.units.filter(unit => unit.id === 13)[0]
        let cleric2 = this.units.filter(unit => unit.id === 14)[0]

        this._TrolltollService.board.map(position => {
            if (position.id === 129) {
                position.piece = knight1
                position.player = 1
            }
            if (position.id === 130) {
                position.piece = knight2
                position.piece.player = 1
                position.player = 1
            }
            if (position.id === 131) {
                position.piece = knight3
                position.piece.player = 1
                position.player = 1
            }
            if (position.id === 14) {
                position.piece = knight4
                position.player = 2
            }
            if (position.id === 15) {
                position.piece = knight5
                position.player = 2
            }
            if (position.id === 16) {
                position.piece = knight6
                position.player = 2
            }
            if (position.id === 141) {
                position.piece = ranger1
                position.player = 1
            }
            if (position.id === 144) {
                position.piece = ranger2
                position.player = 1
            }
            if (position.id === 1) {
                position.piece = ranger3
                position.player = 2
            }
            if (position.id === 4) {
                position.piece = ranger4
                position.player = 2
            }
            if (position.id === 143) {
                position.piece = cleric1
                position.player = 1
            }
            if (position.id === 2) {
                position.piece = cleric2
                position.player = 2
            }
            if (position.id === 142) {
                position.piece = mage1
                position.player = 1
            }
            if (position.id === 3) {
                position.piece = mage2
                position.player = 2
            }
            return position
        })
    }
}
