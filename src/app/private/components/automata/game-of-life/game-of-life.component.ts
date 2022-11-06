import { GridComponent } from './../../grid/grid.component';
import { Component, ViewChild, HostListener, OnInit, AfterViewInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import GridEmitInfo from '../../grid/gridEmitInfo';
import PlayStatus from '../play-status';

@Component({
  selector: 'cb-game-of-life',
  templateUrl: './game-of-life.component.html',
  styleUrls: ['./game-of-life.component.scss']
})
export class GameOfLifeComponent implements OnInit, AfterViewInit{
  @ViewChild('grid', {static: false})
  private grid!: GridComponent;
  private shiftPressed = false
  private field: boolean[][] = []
  private intervalSubscription?: Subscription
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
        this.field[i].push(false);
    }
  }
  ngAfterViewInit(): void {
    this.updateSpeed()
  }
  handleSpeedControlClick(playStatus: PlayStatus): void{
    this.playStatus = playStatus
    this.updateSpeed()
  }
  updateSpeed(): void{
    if(this.intervalSubscription)
    {
      this.intervalSubscription?.unsubscribe()
      this.intervalSubscription = undefined
    }
    if(this.playStatus === this.playStatusType.Stop) return
    this.intervalSubscription = interval(this.playStatus).subscribe(this.updateField.bind(this))
  }
  private updateField(): void{
    if(localStorage.getItem("isStopped") === 'true') return
    this.computeNextGeneration() 
    for (let i = 0; i < this.width; i++)
      for (let j = 0; j < this.height; j++)
        this.updateCell(i, j)
  }
  private computeNextGeneration() : void{
    let newField: boolean[][] = [];
    for (let x = 0; x < this.width; x++) {
      newField.push([])
      for (let y = 0; y < this.height; y++) {
        const neighbours = this.getAmountOfNeighbours(x, y)
        const isAlive = ((neighbours === 2 || neighbours === 3) && this.field[x][y]) || (neighbours === 3 && !this.field[x][y])
        newField[x].push(isAlive)
      }
    }
    this.field = newField
  }
  private getAmountOfNeighbours(x: number, y: number) : number{
    let result = 0
    for (let xn = -1; xn <= 1; xn++)
      for (let yn = -1; yn <= 1; yn++) {
        if(xn === 0 && yn === 0) continue
        const actualX = x + xn;
        const actualY = y + yn;
        if(actualX < 0 || actualX >= this.width || actualY < 0 || actualY >= this.height) continue
        if(this.field[actualX][actualY]) result++
      }
    return result;
  }
  private updateCell(x: number, y: number): void{
    this.grid.setCellColor(x, y, this.field[x][y] ? 'gray' : 'transparent');
  }
  onCellDown(info: GridEmitInfo){
    if(info.coordinates.x < 0 || 
      info.coordinates.x >= this.width || 
      info.coordinates.y < 0 || 
      info.coordinates.y > this.height) return
    if(info.buttonId === 1)
    {
      this.field[info.coordinates.x][info.coordinates.y] = !this.shiftPressed
      this.updateCell(info.coordinates.x, info.coordinates.y)
    }
  }
}
