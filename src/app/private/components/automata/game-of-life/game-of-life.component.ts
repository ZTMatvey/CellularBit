import { GridComponent } from './../../grid/grid.component';
import { Component, ViewChild, HostListener } from '@angular/core';
import { Point } from 'src/app/core/shared/services/point';
import GridEmitInfo from '../../grid/gridEmitInfo';

@Component({
  selector: 'cb-game-of-life',
  templateUrl: './game-of-life.component.html',
  styleUrls: ['./game-of-life.component.scss']
})
export class GameOfLifeComponent {
  @ViewChild('grid', {static: false})
  private grid!: GridComponent;
  private shiftPressed = false
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
  onCellDown(info: GridEmitInfo){
    if(info.buttonId === 1)
    {
      if(!this.shiftPressed) this.grid.setCellColor(info.coordinates, 'gray')
      else this.grid.setCellColor(info.coordinates, 'transparent')
    }
  }
}
