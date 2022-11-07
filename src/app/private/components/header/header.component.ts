import { DarkModeService } from './../../../core/shared/services/dark-mode.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cb-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(public darkModeService: DarkModeService) { }
}
