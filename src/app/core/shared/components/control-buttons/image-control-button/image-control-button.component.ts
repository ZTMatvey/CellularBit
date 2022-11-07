import { DarkModeService } from './../../../services/dark-mode.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import ControlButtonBase from '../../../services/control-button-base';

@Component({
  selector: 'cb-image-control-button',
  templateUrl: './image-control-button.component.html',
  styleUrls: ['../control-button.component.scss']
})
export class ImageControlButtonComponent extends ControlButtonBase {
  @Input() pathToImage!: string
  constructor(public darkModeService: DarkModeService){ 
    super()
  }
}
