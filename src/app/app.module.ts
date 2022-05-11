import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LOCAL_STORAGE } from 'ngx-webstorage-service';
import {JwtInterceptor} from './lib/interceptors/jwt.interceptor';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BEXSTREAM_SERVICE_STORAGE, WebStorageService } from './lib/web-storage.service';
import { DroneListComponent } from './drone/components/drone-list/drone-list.component';
import { UserListComponent } from './user/component/user-list/user-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DroneListComponent,
    UserListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {provide: BEXSTREAM_SERVICE_STORAGE, useExisting: LOCAL_STORAGE},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    WebStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
