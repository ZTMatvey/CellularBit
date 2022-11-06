import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cb-toggle-mode-button',
  templateUrl: './toggle-mode-button.component.html',
  styleUrls: ['./toggle-mode-button.component.scss']
})
export class ToggleModeButtonComponent  {
  darkModeActive = false
  modeToggleSwitch(): void {
    this.darkModeActive = !this.darkModeActive
  }
}
