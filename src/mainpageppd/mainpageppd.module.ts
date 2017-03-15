import {NgModule} from "@angular/core";
import {PPDLandingComponent} from "./mainpageppd.component";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
@NgModule({
  imports: [FormsModule, CommonModule],
  declarations: [PPDLandingComponent],
  exports: [PPDLandingComponent]
})
export class PPDLandingModule { }
