import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PodcastListComponent } from './components/podcasts/podcast-list.component';
import { PodcastDetailComponent } from './components/podcasts/podcast-detail.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
//  { path: '', component: PodcastListComponent},
  {path: 'podcasts', component: PodcastListComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'podcasts/:id', component: PodcastDetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
