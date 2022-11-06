import { GridComponent } from './../../grid/grid.component';
import { Component, ViewChild, HostListener, OnInit, AfterViewInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import GridEmitInfo from '../../grid/gridEmitInfo';
import PlayStatus from '../play-status';
import CellTypes from './cell-types';

@Component({
  selector: 'cb-wireworld',
  templateUrl: './wireworld.component.html',
  styleUrls: ['./wireworld.component.scss']
})
export class WireworldComponent {
  @ViewChild('grid', { static: false })
  private grid!: GridComponent;
  private shiftPressed = false
  private field: CellTypes[][] = []
  private intervalSubscription?: Subscription
  activeCellType = CellTypes.Empty
  cellTypesType = CellTypes
  height = 50
  width = 50
  playStatus = PlayStatus.Stop
  playStatusType = PlayStatus
  @HostListener('window:keydown', ['$event'])
  private onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Shift')
      this.shiftPressed = true;
  }
  @HostListener('window:keyup', ['$event'])
  private onKeyUp(e: KeyboardEvent): void {
    if (e.key === 'Shift')
      this.shiftPressed = false;
  }
  ngOnInit(): void {
    for (let i = 0; i < this.width; i++) {
      this.field.push([]);
      for (let j = 0; j < this.height; j++)
        this.field[i].push(CellTypes.Empty);
    }
  }
  ngAfterViewInit(): void {
    this.updateSpeed()
  }
  handleColorControlClick(cellType: CellTypes): void{
    this.activeCellType = cellType
  }
  handleSpeedControlClick(playStatus: PlayStatus): void {
    this.playStatus = playStatus
    this.updateSpeed()
  }
  updateSpeed(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription?.unsubscribe()
      this.intervalSubscription = undefined
    }
    if (this.playStatus === this.playStatusType.Stop) return
    this.intervalSubscription = interval(this.playStatus).subscribe(this.updateField.bind(this))
  }
  private updateField(): void {
    if (localStorage.getItem("isStopped") === 'true') return
    this.computeNextGeneration()
    for (let i = 0; i < this.width; i++)
      for (let j = 0; j < this.height; j++)
        this.updateCell(i, j)
  }
  private computeNextGeneration(): void {
    let newField: CellTypes[][] = [];
    for (let x = 0; x < this.width; x++) {
      newField.push([])
      for (let y = 0; y < this.height; y++) {
        switch (this.field[x][y]) {
          case CellTypes.Head:
            newField[x].push(CellTypes.Tail)
            break;
          case CellTypes.Tail:
            newField[x].push(CellTypes.Conductor)
            break;
          case CellTypes.Conductor:
            const neighbours = this.getAmountOfHeadNeighbours(x, y)
            const isAlive = neighbours === 1 || neighbours === 2
            newField[x].push(isAlive ? CellTypes.Head : CellTypes.Conductor)
            break;
          case CellTypes.Empty:
            newField[x].push(CellTypes.Empty)
            break;
        }
      }
    }
    this.field = newField
  }
  private getAmountOfHeadNeighbours(x: number, y: number): number {
    let result = 0
    for (let xn = -1; xn <= 1; xn++)
      for (let yn = -1; yn <= 1; yn++) {
        if (xn === 0 && yn === 0) continue
        const actualX = x + xn;
        const actualY = y + yn;
        if (actualX < 0 || actualX >= this.width || actualY < 0 || actualY >= this.height) continue
        if (this.field[actualX][actualY] === CellTypes.Head) result++
      }
    return result;
  }
  private updateCell(x: number, y: number): void {
    let color: string = 'transparent'
    switch (this.field[x][y]) {
      case CellTypes.Conductor:
        color = 'yellow'
        break;
      case CellTypes.Head:
        color = 'blue'
        break;
      case CellTypes.Tail:
        color = 'red'
        break;
    }
    this.grid.setCellColor(x, y, color);
  }
  onCellDown(info: GridEmitInfo) {
    if (info.coordinates.x < 0 ||
      info.coordinates.x >= this.width ||
      info.coordinates.y < 0 ||
      info.coordinates.y > this.height) return
    if (info.buttonId === 1) {
      this.field[info.coordinates.x][info.coordinates.y] = this.activeCellType
      this.updateCell(info.coordinates.x, info.coordinates.y)
    }
  }
}
