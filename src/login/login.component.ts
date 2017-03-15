import {Component, Inject, ViewChild, ViewContainerRef} from "@angular/core";
import {Http, Headers, URLSearchParams} from "@angular/http";
import "rxjs/add/operator/map";
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {BehaviorSubject} from "rxjs";
import {Router, ActivatedRoute, Data} from "@angular/router";
import has = Reflect.has;
import {SessionStorage} from "../StorageService/storage.service";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styles: [`
    .main_heading{
      font-family: "Bitstream Vera Sans Mono", Monaco, "Courier New", Courier, monospace;
    }
    .jumbotron{
      background-color: lightblue;
      margin-bottom: 0%;
    }
    h4{
    font-family: "DejaVu Sans Mono", "Liberation Mono", monospace;
    }
    h3{
    font-family: "DejaVu Sans Mono", "Liberation Mono", monospace;
    }
    #login_error{
      font-family: "DejaVu Sans Mono", "Liberation Mono", monospace;
      color: red;
    }
    
`],
  template: `
    <html>
  <head>
    <title> This is the Login Page </title>
  </head>
  <body>
   <div class="jumbotron">
    <h1 class="main_heading" align="center"> UPD and PPD Creation </h1> 
   </div>
   <div class="well well-lg">
        <div class="panel panel-default">
          <div class="panel-header">
            <h3 align="center"> Features of this App </h3>
          </div>
          <div class="panel-body">
            <h4> Accessing all the current sprint tickets </h4>
            <hr>
            <h4> Creating UPD Ticket on Confluence </h4>
            <hr>
            <h4> Creating UPD Jira Ticket for Deployment on UAT </h4>
            <hr>
            <h4> Creating PPD Ticket on Confluence </h4>
            <hr>
            <h4> Creating PPD Jira Ticket for Deployment on Prod </h4>
          </div>
          <div class="panel-footer">
            <button data-toggle="modal" data-target="#loginPage" type="button" (click)="hide_error(event)" class="btn btn-primary btn-md">Login To Access</button>
            <button data-toggle="modal" data-target="#registerPage" type="button" (click)="hide_error(event)" class="btn btn-primary btn-md">Register Here</button>
          </div>
        </div>
   </div>
       
    <div class="modal fade" id="loginPage" role="dialog">
     <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Mpulse User Login</h4>
        </div>
        <div class="modal-body">
          <form #formRef="ngForm" (ngSubmit)="login(formRef.value) ">
            <div class="form-group">
              <label for="email"><span class="glyphicon glyphicon-user"></span> JIRA User Name </label>
              <input type="text" name="username" #userRef="ngModel" [(ngModel)]="username" class="form-control" required id="username" value="">
            </div>
            <div class="form-group">
              <label for="pwd"><span class="glyphicon glyphicon-briefcase"></span> JIRA Password </label>
              <input type="password" name="password" #passRef="ngModel" [(ngModel)]= "password" class="form-control" required id="pwd" value="">
            </div>
            <button type="submit" class="btn btn-default"> Log In </button>
          </form>
        </div>
        <div class="modal-footer">
          <label id="login_error" *ngIf="login_failed"> {{ login_error_message }}</label>
        </div>
      </div>
      
     </div>
    </div>
    
    <div class="modal fade" id="registerPage" role="dialog">
     <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">New User Register Here</h4>
        </div>
        <div class="modal-body">
          <form #regformRef="ngForm" (ngSubmit)="register(regformRef.value) ">
            <div class="form-group">
              <label for="email"><span class="glyphicon glyphicon-user"></span> JIRA User Name </label>
              <input type="text" name="username" #userRef="ngModel" [(ngModel)]="username" class="form-control" required id="username" value="">
            </div>
            <div class="form-group">
              <label for="email"><span class="glyphicon glyphicon-envelope"></span> Email Id </label>
              <input type="email" name="email" #emailRef="ngModel" [(ngModel)]="email" class="form-control" required id="email" value="">
            </div>
            <div class="form-group">
              <label for="pwd"><span class="glyphicon glyphicon-briefcase"></span> JIRA Password </label>
              <input type="password" name="password" #passRef="ngModel" [(ngModel)]= "password" class="form-control" required id="pwd" value="">
            </div>
            <div class="form-group">
              <label for="pwd"><span class="glyphicon glyphicon-briefcase"></span> Confirm Password </label>
              <input type="password" name="confirm_password" #passRef="ngModel" [(ngModel)]= "confirm_password" class="form-control" required id="confirm_pwd" value="">
            </div>
            <button type="submit" class="btn btn-default"> Register </button>
          </form>
        </div>
        <div class="modal-footer">
          <label id="login_error" *ngIf="register_successful"> {{ registration_message }}  </label>
        </div>
      </div>
      
     </div>
    </div>
 
 
  </body>
</html>
`
})
export class LoginComponent{

  registration_message = " ";
  login_error_message = " ";
  login_failed = false;
  register_successful =  false;
  username="";
  confirm_password="";
  password="";
  email = "";
  headers = new Headers();
  http;


  hide_error(component){
    this.login_failed = false;
    this.username="";
    this.password="";
    this.email="";
    this.confirm_password="";
    this.username = "";
    this.password = "";
    this.register_successful = false;
  }

  register(component){
    this.register_successful = false;
    if( component.password.toString() === component.confirm_password.toString()){
      let data = {"username":component.username.toString(),"password":component.password.toString(),"email-id":component.email.toString()};
      this.headers.append('Access-Control-Allow-Origin', 'http://localhost:10000');
      this.http.post('http://localhost:10000/account/login/', data, {headers: this.headers})
        .map(res => res.json())
        .subscribe((result) => {
            console.log(result.registered);
            if (result.registered === true) {
              this.register_successful = true;
              this.registration_message = "Successfull! Continue to Login";
            } else {
              this.register_successful = true;
              this.registration_message = result.error;
            }
          }
        );
    }else {
      this.register_successful = true;
      this.registration_message = "Password and Confirm Password doesn't match";
    }

  }

  login(component) {

    this.headers.append('Access-Control-Allow-Origin', 'http://localhost:10000');
    this.http.get('http://localhost:10000/account/login/?username=' + component.username.toString() + '&password=' + component.password.toString(), {headers: this.headers})
      .map(res => res.json())
      .subscribe((result) => {
          if(result.successful === true){
              Cookie.set('apptoken', result.token, 0.1, '/main-page');
              this.store_session.setLoggedIn('true');
              debugger;
              this.store_session.setUserName(component.username.toString());
              window.location.href = "main-page/upd";
          }else{
            this.login_failed = true;
            this.login_error_message = "Incorrect Username or Password"
          }
        }
      );
  }

  constructor(private http_var:Http, public store_session: SessionStorage){
    this.login_failed = false;
    this.http = http_var;
  };


}

