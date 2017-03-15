
import {Injectable} from "@angular/core";

@Injectable()
export class SessionStorage{

  isLoggedIn: string = 'false';
  activeSprint: string = '';
  username: string = '';

  getUserName(){
    return localStorage.getItem('username');
  }

  setUserName(userName){
    this.username = userName;
    localStorage.setItem('username', this.username);
  }

  getActiveSprint(){
    return localStorage.getItem('active_sprint');
  }

  setActiveSprint(activeSprint){
    this.activeSprint = activeSprint;
    localStorage.setItem('active_sprint',activeSprint);
  }

  getLoggedIn(){
    return localStorage.getItem('is_session');
  }

  setLoggedIn(isLoggedIn: string){
    this.isLoggedIn = isLoggedIn;
    localStorage.setItem('is_session',this.isLoggedIn);
  }


}
