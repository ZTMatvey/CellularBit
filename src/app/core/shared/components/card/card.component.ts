import { DarkModeService } from './../../services/dark-mode.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cb-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() text!: string
  @Input() pathToImage!: string
  @Input() link!: string
  constructor(public darkModeService: DarkModeService) { }
}
