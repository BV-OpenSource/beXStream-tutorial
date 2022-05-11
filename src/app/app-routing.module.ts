import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DroneListComponent } from './drone/components/drone-list/drone-list.component';
import { UserListComponent } from './user/component/user-list/user-list.component';
import { ViewerComponent } from "./drone-video/component/viewer/viewer.component";

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'drones', component: DroneListComponent },
  { path: 'stream', component: ViewerComponent },
  { path: 'users', component: UserListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
