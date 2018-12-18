import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component'
import { GamePlayComponent } from './game-play/game-play.component'

const routes: Routes = [
  {path: '', component: LoginPageComponent},
  {path: 'game', component: GamePlayComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
