import { DarkModeService } from './../core/shared/services/dark-mode.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent {
  constructor(public darkModeService: DarkModeService) { }
}
