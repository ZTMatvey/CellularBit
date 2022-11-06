import { Point } from './../../../core/shared/services/point';
import { EventEmitter, Component, ElementRef, Output, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import GridEmitInfo from './gridEmitInfo';

@Component({
  selector: 'cb-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false })
  private canvas?: ElementRef<HTMLCanvasElement>
  @Output() onCellDown = new EventEmitter<GridEmitInfo>;
  private context: CanvasRenderingContext2D | null = null
  private field: string[][] = []
  private static readonly resolution = 100
  private readonly width = 5
  private readonly height = 5
  private readonly maxZoom = 5
  private readonly minZoom = .05
  private readonly scrollSensitivity = 0.001
  private isDragging = false;
  private cameraZoom = 1
  private lastZoom = 1
  private cameraOffset = new Point(0, 0)
  private dragStart = new Point(0, 0)
  private spacePressed = false
  private renderWidth = 500
  private renderHeight = 500
  private lineThickness = 5
  private zoomTimes = 0

  constructor(){
    for (let i = 0; i < this.width; i++) {
      this.field.push([]);
      for (let j = 0; j < this.height; j++)
        this.field[i].push('transparent');
    }
  }
  setCellColor(coordinates: Point, color: string): void{    
    this.field[coordinates.x][coordinates.y] = color;
  }
  ngAfterViewInit(): void {
    if (this.canvas === undefined) return
    this.context = this.canvas.nativeElement.getContext('2d')
    this.canvas!.nativeElement.addEventListener('mousedown', this.onPointerDown.bind(this))
    this.canvas!.nativeElement.addEventListener('mouseup', this.onPointerUp.bind(this))
    this.canvas!.nativeElement.addEventListener('mousemove', this.onPointerMove.bind(this))
    this.canvas!.nativeElement.addEventListener('mouseout', this.onPointerOut.bind(this))
    this.canvas!.nativeElement.addEventListener('wheel', this.onWheel.bind(this))
    this.updateRenderSize();
    this.cameraOffset.x = this.renderWidth / 2;
    this.cameraOffset.y = this.renderHeight / 2;
    this.draw();
  }
  private updateRenderSize(): void{
    this.renderWidth = innerWidth
    this.renderHeight = innerHeight
  }
  @HostListener('window:keydown', ['$event'])
  private onKeyDown(e: KeyboardEvent): void {
    if (e.key === ' ')
      this.spacePressed = true;
  }
  @HostListener('window:keyup', ['$event'])
  private onKeyUp(e: KeyboardEvent): void {
    if (e.key === ' ') {
      this.spacePressed = false;
      this.isDragging = false;
    }
  }
  private onPointerDown(e: MouseEvent): void {
    if (this.spacePressed) {
      this.isDragging = true
      this.dragStart.x = e.x / this.cameraZoom - this.cameraOffset.x
      this.dragStart.y = e.y / this.cameraZoom - this.cameraOffset.y
    }
    else this.emitCellCoordinates(new Point(e.x, e.y), e.buttons)
  }
  private onPointerMove(e: MouseEvent): void {
    if (this.isDragging) {
      this.cameraOffset.x = e.x / this.cameraZoom - this.dragStart.x
      this.cameraOffset.y = e.y / this.cameraZoom - this.dragStart.y
    }
    else this.emitCellCoordinates(new Point(e.x, e.y), e.buttons)
  }
  private onWheel(e: WheelEvent): void {
    if (!this.spacePressed) return
    this.adjustZoom(e.deltaY * this.scrollSensitivity, 1)
  }
  private onPointerOut(e: MouseEvent): void {
    this.isDragging = false;
  }
  private onPointerUp(e: MouseEvent): void {
    this.isDragging = false
    this.lastZoom = this.cameraZoom
  }
  private adjustZoom(zoomAmount: number, zoomFactor: number): void {
    if (!this.isDragging) {
      if (zoomAmount)
      {
        this.cameraZoom += zoomAmount
        this.zoomTimes = zoomAmount < 0 ? this.zoomTimes - 1 : this.zoomTimes + 1;
      } 
      else if (zoomFactor) this.cameraZoom = zoomFactor * this.lastZoom
      this.cameraZoom = Math.min(this.cameraZoom, this.maxZoom)
      this.cameraZoom = Math.max(this.cameraZoom, this.minZoom)
    }
  }
  private draw(): void {
    if (localStorage.getItem("IsRunning") === 'false') {
      console.log("Обновление остановлено");
      return;
    }
    this.updateRenderSize();
    this.canvas!.nativeElement.width = this.renderWidth
    this.canvas!.nativeElement.height = this.renderHeight
    this.context!.translate(this.renderWidth / 2, this.renderHeight / 2)
    this.context!.scale(this.cameraZoom, this.cameraZoom)
    this.context!.translate(-this.renderWidth / 2 + this.cameraOffset.x, -this.renderHeight / 2 + this.cameraOffset.y)
    this.context!.clearRect(0, 0, this.renderWidth, this.renderHeight)
    let widthEnd = this.width * GridComponent.resolution / 2;
    let widthStart = widthEnd * -1;
    let heightEnd = this.height * GridComponent.resolution / 2;
    let heightStart = heightEnd * -1;
    for (let x = 0; x < this.width; x++)
      for (let y = 0; y < this.height; y++) {
        this.context!.fillStyle = this.field[x][y]
        this.drawRect(widthStart + x * GridComponent.resolution, heightStart + y * GridComponent.resolution, GridComponent.resolution, GridComponent.resolution);
      }
    this.context!.fillStyle = 'black'
    for (var x = widthStart; x <= widthEnd; x += GridComponent.resolution)
      this.drawRect(x, heightStart, this.lineThickness, this.height * GridComponent.resolution)
    for (var y = heightStart; y <= heightEnd; y += GridComponent.resolution)
      this.drawRect(widthStart, y, this.width * GridComponent.resolution, this.lineThickness)
    this.drawRect(widthEnd, heightEnd, this.lineThickness, this.lineThickness)
    requestAnimationFrame(this.draw.bind(this))
  }
  private drawRect(x: number, y: number, width: number, height: number) {
    this.context!.fillRect(x, y, width, height)
  }
  private emitCellCoordinates(canvasCoordinates: Point, buttonId: number): void { 
    const rect = this.canvas!.nativeElement.getBoundingClientRect()
    const offset = new Point(this.cameraOffset.x - this.renderWidth / 2, this.cameraOffset.y - this.renderHeight / 2)
    const denominator = GridComponent.resolution * this.cameraZoom / 2
    const multiplierX = this.canvas!.nativeElement.width / this.canvas!.nativeElement.clientWidth / 2
    const multiplierY = this.canvas!.nativeElement.height / this.canvas!.nativeElement.clientHeight / 2
    const clientX = (canvasCoordinates.x - rect.left) * multiplierX
    const clientY = (canvasCoordinates.y - rect.top) * multiplierY
    const xOffset = -(this.renderWidth / 4) + this.width * GridComponent.resolution / 4 * this.cameraZoom - offset.x * this.cameraZoom / 2
    const yOffset = -(this.renderHeight / 4) + this.height * GridComponent.resolution / 4 * this.cameraZoom - offset.y * this.cameraZoom / 2
    const x = Math.floor((clientX + xOffset) / denominator)
    const y = Math.floor((clientY + yOffset) / denominator)
    this.onCellDown.emit({coordinates: new Point(x, y), buttonId});
  }
}
