import { DarkModeService } from './../../../../core/shared/services/dark-mode.service';
import { GridComponent } from './../../grid/grid.component';
import { Component, ViewChild, HostListener, OnInit, AfterViewInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import GridEmitInfo from '../../grid/gridEmitInfo';
import PlayStatus from '../play-status';
import AutomataBaseComponent from '../automata-base.component';
import CellTypes from '../cell-types';
import CellType from '../cell-type';
import GameOfLifeCellTypes from './game-of-life-cell-types';

@Component({
  selector: 'cb-game-of-life',
  templateUrl: '../automata-base.component.html',
  styleUrls: ['../automata.scss']
})
export class GameOfLifeComponent extends AutomataBaseComponent {
  constructor(darkModeService: DarkModeService){
    super(darkModeService)
    const cellTypes = new CellTypes([
      new CellType('transparent', 'gray', GameOfLifeCellTypes.Empty), 
      new CellType('gray', 'black', GameOfLifeCellTypes.Alive)])
    this.initialize(cellTypes, this.computeNextGeneration)
  }
  private computeNextGeneration() : void{
    let newField: CellType[][] = [];
    for (let x = 0; x < this.width; x++) {
      newField.push([])
      for (let y = 0; y < this.height; y++) {
        const neighbours = this.getAmountOfNeighbours(x, y)
        const isAlive = ((neighbours === 2 || neighbours === 3) && this.field[x][y].id === GameOfLifeCellTypes.Alive) 
          || (neighbours === 3 && this.field[x][y].id === GameOfLifeCellTypes.Empty)
        newField[x].push(isAlive ? this.cellTypes.types[GameOfLifeCellTypes.Alive] : this.cellTypes.types[GameOfLifeCellTypes.Empty])
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
        if(this.field[actualX][actualY].id === GameOfLifeCellTypes.Alive) result++
      }
    return result;
  }
}
