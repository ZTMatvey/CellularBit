import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { ColorControlButtonComponent } from './components/control-buttons/color-control-button/color-control-button.component';
import { ImageControlButtonComponent } from './components/control-buttons/image-control-button/image-control-button.component';

@NgModule({
  declarations: [
    CardComponent,
    ImageControlButtonComponent,
    ColorControlButtonComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports:[
    CardComponent,
    ImageControlButtonComponent,
    ColorControlButtonComponent
  ]
})
export class SharedModule { }
