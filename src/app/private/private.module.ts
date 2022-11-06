import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { PrivateComponent } from './private.component';
import { SharedModule } from '../core/shared/shared.module';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { LogoComponent } from './components/header/logo/logo.component';
import { GridComponent } from './components/grid/grid.component';
import { GameOfLifeComponent } from './components/automata/game-of-life/game-of-life.component';

@NgModule({
  declarations: [
    PrivateComponent,
    HomeComponent,
    HeaderComponent,
    LogoComponent,
    GridComponent,
    GameOfLifeComponent
  ],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    SharedModule
  ],
  exports: [PrivateComponent]
})
export class PrivateModule { }
