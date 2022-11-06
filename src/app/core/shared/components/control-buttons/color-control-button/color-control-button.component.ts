import { Component, Input } from '@angular/core';
import ControlButtonBase from '../../../services/control-button-base';

@Component({
  selector: 'cb-color-control-button',
  templateUrl: './color-control-button.component.html',
  styleUrls: ['../control-button.component.scss']
})
export class ColorControlButtonComponent extends ControlButtonBase  {
  @Input() color = 'black'
}
