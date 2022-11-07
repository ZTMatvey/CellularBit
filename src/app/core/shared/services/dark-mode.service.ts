import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  isDarkMode = false
  toggle(){
    this.isDarkMode = !this.isDarkMode
  }
}
