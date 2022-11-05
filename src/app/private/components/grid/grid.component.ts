import { AfterContentInit, Component, ElementRef, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { Point } from 'src/app/core/shared/services/point';

@Component({
  selector: 'cb-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements AfterViewInit {

  @ViewChild('canvas', { static: false })
  private canvas?: ElementRef<HTMLCanvasElement>
  private context: CanvasRenderingContext2D | null = null
  private static readonly resolution = 50
  private readonly width = 100 * GridComponent.resolution
  private readonly height = 100 * GridComponent.resolution
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
  private lineThickness = 2
  private zoomTimes = 0

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
  updateRenderSize(): void{
    this.renderWidth = innerWidth
    this.renderHeight = innerHeight
  }
  onWheel(e: WheelEvent): void {
    if (!this.spacePressed) return
    this.adjustZoom(e.deltaY * this.scrollSensitivity, 1)
  }
  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if (e.key === ' ')
      this.spacePressed = true;
  }
  @HostListener('window:keyup', ['$event'])
  onKeyUp(e: KeyboardEvent): void {
    if (e.key === ' ') {
      this.spacePressed = false;
      this.isDragging = false;
    }
  }
  onPointerOut(e: MouseEvent): void {
    this.isDragging = false;
  }
  onPointerDown(e: MouseEvent): void {
    if (this.spacePressed) {
      this.isDragging = true
      this.dragStart.x = e.x / this.cameraZoom - this.cameraOffset.x
      this.dragStart.y = e.y / this.cameraZoom - this.cameraOffset.y
    }
    else this.getCellCoordinates(new Point(e.x, e.y))

  }
  onPointerUp(e: MouseEvent): void {
    this.isDragging = false
    this.lastZoom = this.cameraZoom
  }
  onPointerMove(e: MouseEvent): void {
    if (this.isDragging) {
      this.cameraOffset.x = e.x / this.cameraZoom - this.dragStart.x
      this.cameraOffset.y = e.y / this.cameraZoom - this.dragStart.y
    }
  }
  handleTouch(e: MouseEvent, singleTouchHandler: (e: MouseEvent) => void): void {
    singleTouchHandler(e)
  }
  adjustZoom(zoomAmount: number, zoomFactor: number): void {
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
  draw(): void {
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
    let widthEnd = this.width / 2;
    let widthStart = widthEnd * -1;
    let heightEnd = this.height / 2;
    let heightStart = heightEnd * -1;
    for (var x = widthStart; x <= widthEnd; x += GridComponent.resolution)
      this.drawRect(x, heightStart, this.lineThickness, this.height)
    for (var y = heightStart; y <= heightEnd; y += GridComponent.resolution)
      this.drawRect(widthStart, y, this.width, this.lineThickness)
    this.drawRect(widthEnd, heightEnd, this.lineThickness, this.lineThickness)
    requestAnimationFrame(this.draw.bind(this))
  }
  drawRect(x: number, y: number, width: number, height: number) {
    this.context!.fillRect(x, y, width, height)
  }
  getCellCoordinates(canvasCoordinates: Point): Point { 
    const rect = this.canvas!.nativeElement.getBoundingClientRect()
    const offset = new Point(this.cameraOffset.x - this.renderWidth / 2, this.cameraOffset.y - this.renderHeight / 2)
    console.log(canvasCoordinates.x - rect.left - this.renderWidth / 4 + this.width / 4 * this.cameraZoom - offset.x * this.cameraZoom / 2)
    console.log(canvasCoordinates.y - rect.top - this.renderHeight / 4 + this.height / 4 * this.cameraZoom - offset.y * this.cameraZoom / 2)
    
    const x = Math.floor((canvasCoordinates.x - rect.left - this.renderWidth / 4 + this.width / 4 
        * this.cameraZoom - offset.x * this.cameraZoom / 2) 
      / (GridComponent.resolution * this.cameraZoom / 2))
    const y = Math.floor((canvasCoordinates.y - rect.top - this.renderHeight / 4 + this.height / 4 
        * this.cameraZoom - offset.y * this.cameraZoom / 2) 
      / (GridComponent.resolution * this.cameraZoom / 2))
    const result = new Point(x, y)
    console.log(result)
    return result
  }
}
