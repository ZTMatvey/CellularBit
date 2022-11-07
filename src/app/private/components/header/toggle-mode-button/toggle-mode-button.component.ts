import { DarkModeService } from './../../../../core/shared/services/dark-mode.service';
import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'cb-toggle-mode-button',
  templateUrl: './toggle-mode-button.component.html',
  styleUrls: ['./toggle-mode-button.component.scss']
})
export class ToggleModeButtonComponent  {
  @ViewChild('input') checkbox!: ElementRef<HTMLInputElement>
  constructor(public darkModeService: DarkModeService){ }
  modeToggleSwitch(): void {
    this.darkModeService.toggle()
    this.checkbox.nativeElement.blur()
  }
}
