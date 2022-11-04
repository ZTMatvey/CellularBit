import { AfterContentInit, Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
  private static readonly resolution = 5
  private readonly width = 200 * GridComponent.resolution
  private readonly height = 100 * GridComponent.resolution
  private readonly maxZoom = 5
  private readonly minZoom = .05
  private readonly scrollSensitivity = 0.001
  private isDragging = false;
  private cameraZoom = 1
  private lastZoom = 1
  private cameraOffset = new Point(window.innerWidth/2, window.innerHeight/2)
  private dragStart = new Point(0, 0)

  ngAfterViewInit(): void {
    if (this.canvas === undefined) return
    this.context = this.canvas.nativeElement.getContext('2d')
    this.canvas!.nativeElement.addEventListener('mousedown', this.onPointerDown.bind(this))
    this.canvas!.nativeElement.addEventListener('mouseup', this.onPointerUp.bind(this))
    this.canvas!.nativeElement.addEventListener('mousemove', this.onPointerMove.bind(this))
    this.canvas!.nativeElement.addEventListener('mouseout', this.onPointerOut.bind(this))
    this.canvas!.nativeElement.addEventListener('wheel', e => this.adjustZoom(e.deltaY * this.scrollSensitivity, 1))
    this.draw();
  }
  onPointerOut(e: MouseEvent): void{
    this.isDragging = false;
  }
  onPointerDown(e: MouseEvent): void {
    this.isDragging = true
    this.dragStart.x = e.x / this.cameraZoom - this.cameraOffset.x
    this.dragStart.y = e.y / this.cameraZoom - this.cameraOffset.y
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
      if (zoomAmount) this.cameraZoom += zoomAmount
      else if (zoomFactor) this.cameraZoom = zoomFactor * this.lastZoom
      this.cameraZoom = Math.min(this.cameraZoom, this.maxZoom)
      this.cameraZoom = Math.max(this.cameraZoom, this.minZoom)
    }
  }
  draw(): void {
    if(localStorage.getItem("IsRunning") === 'false') {
      console.log("Обновление остановлено");
      return;
    }
    this.canvas!.nativeElement.width = window.innerWidth
    this.canvas!.nativeElement.height = window.innerHeight
    
    this.context!.translate( window.innerWidth / 2, window.innerHeight / 2 )
    this.context!.scale(this.cameraZoom, this.cameraZoom)
    this.context!.translate( -window.innerWidth / 2 + this.cameraOffset.x, -window.innerHeight / 2 + this.cameraOffset.y )
    this.context!.clearRect(0,0, window.innerWidth, window.innerHeight)
    let widthStart = this.width / 2 * -1;
    let widthEnd = this.width / 2;
    let heightStart = this.height / 2 * -1;
    let heightEnd = this.height / 2;
    for (var x = widthStart; x <= widthEnd; x += GridComponent.resolution)
      this.drawRect(x, heightStart, 1, this.height)
    for (var y = heightStart; y <= heightEnd; y += GridComponent.resolution)
      this.drawRect(widthStart, y, this.width, 1)
    this.drawRect(widthEnd, heightEnd, 1, 1)
    requestAnimationFrame(this.draw.bind(this))
  }
  drawRect(x: number, y: number, width: number, height: number) {
    this.context!.fillRect(x, y, width, height)
  }
}
