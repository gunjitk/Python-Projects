import {NgModule} from "@angular/core";
import {LoginComponent} from "./login.component";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [LoginComponent],
  exports: [LoginComponent]
})
export class LoginModule { }
