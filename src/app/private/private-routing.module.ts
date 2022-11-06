import { WireworldComponent } from './components/automata/wireworld/wireworld.component';
import { GameOfLifeComponent } from './components/automata/game-of-life/game-of-life.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'home', component: HomeComponent},
  {path:'gameoflife', component: GameOfLifeComponent},
  {path:'wireworld', component: WireworldComponent},
  {path:'**', redirectTo:'home'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
