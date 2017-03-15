import {NgModule} from "@angular/core";
import { UPDLandingComponent} from "./mainpage.component";
import {CommonModule, LowerCasePipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TruncatePipe} from "./truncate.pipe";

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [UPDLandingComponent, TruncatePipe],
  exports: [UPDLandingComponent],
})
export class UPDLandingModule { }
