import { DarkModeService } from './../../../core/shared/services/dark-mode.service';
import { GridComponent } from './../grid/grid.component';
import { ViewChild, Output, EventEmitter, Component, OnInit, AfterViewInit } from '@angular/core';
import PlayStatus from './play-status';
import { interval, Subscription } from 'rxjs';
import GridEmitInfo from '../grid/gridEmitInfo';
import CellTypes from './cell-types';
import CellType from './cell-type';

@Component({
    template: '',
})
abstract class AutomataBaseComponent  {
    constructor(readonly darkModeService: DarkModeService){}
    @ViewChild('grid', { static: false })
    private grid!: GridComponent
    protected field: CellType[][] = []
    private intervalSubscription?: Subscription
    private computeNextGenerationCallback?: () => void
    protected cellTypes!: CellTypes
    height = 50
    width = 50
    playStatus = PlayStatus.Stop
    playStatusType = PlayStatus
    initialize(cellTypes: CellTypes, computeNextGenerationCallback?: () => void){
        this.computeNextGenerationCallback = computeNextGenerationCallback
        this.cellTypes = cellTypes
    }
    get activeCellType(): CellType{
        return this.cellTypes.activeType
    }
    ngOnInit(): void {
        for (let i = 0; i < this.width; i++) {
            this.field.push([]);
            for (let j = 0; j < this.height; j++)
                this.field[i].push(this.activeCellType);
        }
    }
    ngAfterViewInit(): void {
        this.updateSpeed()
    }
    private updateField(): void {
        if (localStorage.getItem("isStopped") === 'true') return
        this.computeNextGenerationCallback!()
        for (let i = 0; i < this.width; i++)
            for (let j = 0; j < this.height; j++)
                this.updateCell(i, j)
    }
    protected updateCell(x: number, y: number): void{
      this.grid.setCellColor(x, y, this.field[x][y].color);
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
        if(!this.computeNextGenerationCallback)
            throw new Error('Callback does not initialized')
        if (this.playStatus === this.playStatusType.Stop) return
        this.intervalSubscription = interval(this.playStatus).subscribe(this.updateField.bind(this))
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

export default AutomataBaseComponent