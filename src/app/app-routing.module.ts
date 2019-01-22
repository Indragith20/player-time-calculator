import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamDetailsComponent } from './team-details/team-details.component';
import { PlayerListComponent } from './player-list/player-list.component';

const routes: Routes = [{
  path: 'team-details',
  component: TeamDetailsComponent
}, {
  path: 'player-list',
  component: PlayerListComponent
}, {
  path: '',
  redirectTo: 'team-details',
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
