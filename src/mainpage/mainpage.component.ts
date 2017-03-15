import {Component, ViewChild} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {SessionStorage} from "../StorageService/storage.service";
import {forEach} from "@angular/router/src/utils/collection";
import {forEachToken} from "tslint";
import {map} from "rxjs/operator/map";
import {DialogModule} from 'primeng/primeng';
import $ from 'jquery';
import {TruncatePipe} from "./truncate.pipe";

@Component({
  selector: 'landing',
  template: `
   <div *ngIf="board_name" class="jumbotron responsive">
      <h1 class="main_heading responsive" align="center"> {{ board_name }}  </h1>
   </div>
  <div class="row col-lg col-md col-xs">
   <div class="col-sm-3 col-md-6 col-lg-4 sprint_table">
    <div class="table-responsive">
      <table class="table table-hover table-bordered ">
        <tbody *ngFor="let sprint of sprints">
          <tr>
            <td><button  type="button" name="{{ sprint.id }}"  (click)="get_sprint_details($event,0)" class="btn btn-default btn-block">{{ sprint.name }}</button></td>
          </tr>
        </tbody>
      </table>
    </div>   
   </div>
   <div class="col-sm-9 col-md-6 col-lg-8 current_active_sprint">
      <div class="well well-lg sprint_well" *ngIf="sprint_name">
        <div class="btn-group">
          <button  data-toggle="tooltip" data-placement="top" title="Current Sprint" type="button" (click)="get_sprint_details($event,1)" class="btn btn-default"><span class="glyphicon glyphicon-home"></span></button>
          <button  type="button" data-toggle="modal" data-target="#searchFilter"  class="btn btn-default"><span class="glyphicon glyphicon-search"></span></button>
          <button  type="button" data-toggle="tooltip" data-placement="top" title="Log Out {{ username }}" (click)="log_out_session()" class="btn btn-default log-out"><span class="glyphicon glyphicon-log-out"></span></button>
        </div>
        
          <h3 align="center" >{{ sprint_current_or_future }} <button type="button" class="btn btn-primary btn-lg">{{ sprint_name }} <span class="badge">{{ total_sprint_issues }}</span></button></h3>
      
      <div class="container">
        <div class="row btn-group" *ngFor="let issue of issues">
           <div class="col-md-8 issue_buttons">
                <button type="button" (click)="select_button($event)" name="{{ issue.key }}" class="mark_issue"> </button>
                <button type="button" data-toggle="tooltip" title="{{ issue.desc }} \n Assignee: {{ issue.assignee }} \n Status: {{ issue.status }} \n Priority: {{ issue.priority }}" class="btn btn-default btn-justified large-btn">
                <div align="left">
                   <label>{{ issue.key }}</label>
                </div>
                <label>{{  issue.desc | truncate : 60 : '.'  }}</label>
                <p><i>Assignee:</i> {{ issue.assignee }}</p>
                <div align="right">
                  <img class="image-priority" src="../images/{{ issue.priority | lowercase }}.svg" height="30px" width="40px" />
                </div>
                </button>           
           </div>
        </div>
      </div>
      <div class="checkbox">
        <input type="checkbox" class="checkbox-primary" id="checkbox1">
         <label for="checkbox1">Deploy Email With this Sprint</label>
      </div>
       <div class="input-group">
        <span class="input-group-addon">UPD Package Name</span>
        <input id="package-name" type="text" class="form-control" name="msg" placeholder="Package Name">
      </div>
      <div class="input-group release-date">
        <span class="input-group-addon">Sprint Release Date</span>
        <input id="sprint-release-date" type="text" class="form-control" name="msg" placeholder="Release Date (MMM dd)">
      </div>
      <div class="input-group release-date">
        <span class="input-group-addon">UAT Date</span>
        <input id="uat-date" type="text" class="form-control" name="msg" placeholder="Date For UAT (mm/dd/yyyy)">
      </div>
      <div align="center">
      <button type="button" disabled (click)="create_sprint_upd()" data-toggle="tooltip" title="Select At Least One Issue and Fill All Details" class="btn btn-primary create-upd">Create UPD</button>
     </div> 
     <div align="center">
        <label id="upd-creation-error">{{ error_message }}</label>
      </div>
      </div>
   </div>
  </div>  

  <div class="modal fade" id="noResultFound" role="dialog">
     <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">No Issues Match Search Filter</h4>
        </div>
      
     </div>
    </div>
  </div>
  <button type="button" id="openNoResultModal" hidden data-toggle="modal" data-target="#noResultFound">Launch modal</button>
  
  
  <div class="modal fade" id="searchFilter" role="dialog">
     <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Advanced Search</h4>
        </div>
        <div class="modal-body">
          <h4 align="left"> Issue Status: </h4>
          <select id="filter_state" class="form-control">
            <option selected="selected">Select State</option>
            <option *ngFor="let state of states">{{ state }}</option>
          </select>
          
          
        </div>
        <div class="modal-footer">
           <button type="submit" data-dismiss="modal" (click)="search_issues()" class="btn btn-default"> Search Issues </button>
        </div>
     </div>
    </div>
  </div>
`,
  styles: [`
    
    .jumbotron{
      background-color: lightblue;
      margin-bottom: 0%;
      height: 140px;
    }
    h1{
      font-family: "DejaVu Sans Mono", "Liberation Mono", monospace;
    }
    .sprint_table{
      margin-top: 30px;
      margin-left: 20px;
      width: 20%;
      height: 400px;
    }
    h3{
    margin-top: 0px;
    margin-left: 35px;
    font-family: "DejaVu Sans Mono", "Liberation Mono", monospace;
    }
    .current_active_sprint{
     margin-top: 30px;
     margin-right: 20px;
     width:75%;
    }
    .sprint_well{
     background-color: transparent;
     overflow: auto;
    }
    .container{
      display: table-row-group;
    }
    .large-btn{
      width: 860px;
      height: 80px;
      margin-left: 10px;
      margin-right: 10px;
      margin-bottom: 10px;
      margin-top:10px;
    }
    .mark_issue{
      height:20px;
      width: 20px;
    }
    .mark_issue:hover{
    color: #333;
    background-color: green;
    border-color: #4cae4c;
    }
    .mark_issue:focus{
    background-color: green;
    border-color: #4cae4c;
    }
    .active{
     background-color: green;
     border-color: #4cae4c;
    }
    .create-upd{
      margin-top: 30px;
      margin-bottom:10px;
      width: 300px;
      height: 40px;
      
    }
    .package_name_inp{
      width: 40%;
      height: 20%;
    }
    .release-date{
    margin-top: 15px;
    width: 80%;
    }
    #upd-creation-error{
      font-family: "DejaVu Sans Mono", "Liberation Mono", monospace;
      color: red;
    }
    .image-priority{
    margin-top: -90px;
    }
`]
})
export class UPDLandingComponent {

  active_sprint_id;
  selected_issues_count = 0;
  sprint_name = '';
  display: boolean = false;
  upd_ticket_data = '';
  username: string = this.sessionStorage.getUserName();
  board_name = '';
  error_message: string = '';
  http;
  sprint_current_or_future = 'Current Active Sprint';
  sprints = [];
  session_exists;
  total_sprint_issues;
  headers = new Headers();
  issues = [];
  states = [];
  upd_create_error: boolean = false;
  selected_text;

  constructor(private http_var:Http, public sessionStorage: SessionStorage){
      this.http = http_var;
      this.session_exists = this.sessionStorage.getLoggedIn();

      if(this.session_exists === "false"){
        window.location.href='';
      }
      else {
        this.headers.append('Access-Control-Allow-Origin', 'http://localhost:10000');
        this.http.get('http://localhost:10000/upd/get_sprint_details/?username=gunjit.khera&password=ha2sx@yyMB&session=' + this.session_exists.toString(), {headers: this.headers})
          .map(res => res.json())
          .subscribe((results) => {
              this.board_name = results.board;
              this.sprints = results.future_sprints;
              this.total_sprint_issues = results.issues_in_active_sprint;
              this.sprint_name = results.active_sprint;
              this.active_sprint_id = results.active_sprint_id;
              sessionStorage.setActiveSprint(this.sprint_name);
              if(this.states != []) {
                this.get_issue_details(this.states[0]);
              }
              else{
                this.get_issue_details('Select State');
              }
            }
          );
      }
  }


  get_sprint_details(event, is_current){

    this.selected_issues_count = 0;
    let sprintName: string ='';
    let sprintId;
    if(is_current){
      sprintName = this.sessionStorage.getActiveSprint();
      sprintId = this.active_sprint_id;
      this.sprint_current_or_future = 'Current Active Sprint';
    }else{
      sprintName = event.srcElement.innerHTML;
      sprintId = event.srcElement.name;
      this.sprint_current_or_future = 'Future Sprint';
    }

    this.headers.append('Access-Control-Allow-Origin', 'http://localhost:10000');
    this.http.get('http://localhost:10000/upd/get_sprint_details/?sprint_id='+sprintId+'&sprint_name='+sprintName+'&session=' + this.session_exists.toString(), {headers: this.headers})
      .map(res => res.json())
      .subscribe((result) => {
        if(result.error === 'Not Logged In'){
          window.location.href='';
        }else{

          this.sprint_name = sprintName;
          this.total_sprint_issues = result.total_issues;
          if(this.states != []) {
                this.get_issue_details(this.states[0]);
          }else{
                this.get_issue_details('Select State');
          }
        }
        }
      );


  }

  get_issue_details(issue_state){

    this.issues = [];
    this.headers.append('Access-Control-Allow-Origin', 'http://localhost:10000');
    this.http.get('http://localhost:10000/upd/get_issue_details/?issue_filter_state='+issue_state+'&session=' + this.session_exists.toString(), {headers: this.headers})
      .map((res) =>  JSON.parse(res._body))
      .subscribe((result) => {
          this.states = [];
          if (Object.keys(result).length === 0) {
            $('#openNoResultModal').click();
          } else {
            for (let object in result) {

              if(object.toString() === "distinct_states"){
                console.log(result[object]);
                this.states = result[object];

              }else {
                this.issues.push(result[object]);
              }
            }
            this.total_sprint_issues = this.issues.length;

          }
        }
      );

  }

  select_button(event){
    console.log(event);
    if(event.srcElement.classList.contains('active')){
      event.srcElement.classList.remove('active');
      this.selected_issues_count = this.selected_issues_count - 1;
    }else{

      event.srcElement.classList.add('active');
      this.selected_issues_count = this.selected_issues_count + 1;
    }

    if(this.selected_issues_count > 0){
      $('.create-upd').removeAttr('disabled');
    }

    if(this.selected_issues_count == 0){
      $('.create-upd').prop('disabled','true');
    }

  }

  search_issues(){

    this.selected_text = $('#filter_state').val();
    this.get_issue_details(this.selected_text);
    $('#filter_state').val("Select State");
    this.selected_issues_count = 0;
     $('.create-upd').prop('disabled','true');

  }

  log_out_session(){

    this.sessionStorage.setLoggedIn('false');
    this.sessionStorage.setActiveSprint('');
    this.sessionStorage.setUserName('');

    window.location.href = "";


  }

  create_sprint_upd(){

       let checkbox = $('#checkbox1');
       let package_name_string = $('#package-name');
       let sprint_release_date_string = $('#sprint-release-date')
       let uat_date_string =  $('#uat-date');

       if(package_name_string.val() == "" || sprint_release_date_string.val() == "" || uat_date_string.val() == "") {
          alert("Please Fill In All The Required Details Before Submission");
         // this.error_message = "Please Fill In All The Required Details Before Submission";
         return false;
       }
      this.error_message = "";
      let tickets = [];
      let deploy_email: boolean = false;
      let package_name: string = '';
      let sprint_release_date: string = '';
      let uat_date: string ='';

      $('.issue_buttons').each(function(){
        if($(this).children('.active').attr("name")){
          tickets.push($(this).children('.active').attr("name"))
        }
      });
      console.log(tickets);
      if(checkbox.prop('checked') == true){
        deploy_email = true;
      }
      package_name = package_name_string.val();
      sprint_release_date = sprint_release_date_string.val();
      uat_date = uat_date_string.val();

      let data = {"tickets_list": tickets.toString(), "upd_date": uat_date, "sprint_name": sprint_release_date, "email_deploy": deploy_email, "package_name_string": package_name.toString(), "username": this.sessionStorage.getUserName()};

      this.http.post('http://localhost:10000/upd/create_upd/', data, {headers: this.headers})
        .map((result) => result.json())
        .subscribe((res) => {
         if(res.success === "True") {
           let myWindow = window.open(res.page_url, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
           myWindow.document.title = "Preview the Created UPD";
           package_name_string.val("");
           sprint_release_date_string.val("");
           uat_date_string.val("");
           checkbox.prop('checked', false);
         }else{
           this.error_message = "Please Fill In All The Required Details Before Submission";
         }
      });



  }

}
