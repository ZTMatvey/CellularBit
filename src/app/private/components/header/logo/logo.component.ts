import { DarkModeService } from './../../../../core/shared/services/dark-mode.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cb-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent {
  constructor(public darkModeService: DarkModeService) { }
}
