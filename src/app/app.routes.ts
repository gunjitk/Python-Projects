import {LoginComponent} from "../login/login.component";
import {RouterModule} from "@angular/router";
import {UPDLandingComponent} from "../mainpage/mainpage.component";
import {PPDLandingComponent} from "../mainpageppd/mainpageppd.component";

const routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path:"login", component: LoginComponent },
  { path: "main-page/upd", component: UPDLandingComponent },
  { path: "main-page/ppd", component: PPDLandingComponent }
];

export default RouterModule.forRoot(routes);
