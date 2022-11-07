import { DarkModeService } from './../../../../core/shared/services/dark-mode.service';
import { GridComponent } from './../../grid/grid.component';
import { Component, ViewChild, HostListener, OnInit, AfterViewInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import GridEmitInfo from '../../grid/gridEmitInfo';
import PlayStatus from '../play-status';
import CellTypes from '../cell-types';
import AutomataBaseComponent from '../automata-base.component';
import CellType from '../cell-type';
import WireworldCellTypes from './wireworld-cell-types';

@Component({
  selector: 'cb-wireworld',
  templateUrl: '../automata-base.component.html',
  styleUrls: ['../automata.scss']
})
export class WireworldComponent extends AutomataBaseComponent {
  constructor(darkModeService: DarkModeService){
    super(darkModeService)
    const cellTypes = new CellTypes([
      new CellType('transparent', 'gray', WireworldCellTypes.Empty),
      new CellType('yellow', 'yellow', WireworldCellTypes.Conductor),
      new CellType('blue', 'blue', WireworldCellTypes.Head),
      new CellType('red', 'red', WireworldCellTypes.Tail)
    ])
    this.initialize(cellTypes, this.computeNextGeneration)
  }
  private computeNextGeneration(): void {
    let newField: CellType[][] = [];
    for (let x = 0; x < this.width; x++) {
      newField.push([])
      for (let y = 0; y < this.height; y++) {
        switch (this.field[x][y].id) {
          case WireworldCellTypes.Head:
            newField[x].push(this.cellTypes.types[WireworldCellTypes.Tail])
            break;
          case WireworldCellTypes.Tail:
            newField[x].push(this.cellTypes.types[WireworldCellTypes.Conductor])
            break;
          case WireworldCellTypes.Conductor:
            const neighbours = this.getAmountOfHeadNeighbours(x, y)
            const isAlive = neighbours === 1 || neighbours === 2
            newField[x].push(isAlive ? this.cellTypes.types[WireworldCellTypes.Head] 
              : this.cellTypes.types[WireworldCellTypes.Conductor])
            break;
          case WireworldCellTypes.Empty:
            newField[x].push(this.cellTypes.types[WireworldCellTypes.Empty])
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
        if (this.field[actualX][actualY].id === WireworldCellTypes.Head) result++
      }
    return result;
  }
}
