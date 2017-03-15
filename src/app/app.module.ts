import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {LoginComponent} from "../login/login.component";
import {LoginModule} from "../login/login.module";
import Routing from './app.routes';
import { UPDLandingModule} from "../mainpage/mainpage.module";
import { LocalStorageService } from 'angular2-localstorage/LocalStorageEmitter';
import {SessionStorage} from "../StorageService/storage.service";
import {PPDLandingModule} from "../mainpageppd/mainpageppd.module";
import {UPDLandingComponent} from "../mainpage/mainpage.component";
import {PPDLandingComponent} from "../mainpageppd/mainpageppd.component";
import {RouterModule} from "@angular/router";
import {LowerCasePipe} from "@angular/common";

const routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path:"login", component: LoginComponent },
  { path: "main-page/upd", component: UPDLandingComponent },
  { path: "main-page/ppd", component: PPDLandingComponent }
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    LoginModule,
    UPDLandingModule,
    PPDLandingModule,
    RouterModule.forRoot(routes)
  ],
  providers: [SessionStorage],
  bootstrap: [AppComponent]
})
export class AppModule { }
