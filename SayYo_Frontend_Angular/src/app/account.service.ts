import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http:HttpClient) { }

  // Django - już nie działą
  // readonly APIUrl = "https://polar-island-77389.herokuapp.com";
  // readonly PhotoUrl = "https://polar-island-77389.herokuapp.com/media/";

  // Django lokalnie - działa
  // readonly APIUrl = "http://127.0.0.1:8000";
  // readonly PhotoUrl = "http://127.0.0.1:8000/media/";


  //readonly APIUrl = " https://bckend-python.onrender.com";
  //readonly PhotoUrl = " https://bckend-python.onrender.com/media/";

  // Express.js lokalnie
  // readonly APIUrl = "http://localhost:3000";
  // readonly PhotoUrl = "http://localhost:3000/media/";

  // Express zdalnie
  // readonly APIUrl = "https://backend-express-ma4q.onrender.com";
  // readonly PhotoUrl = "https://backend-express-ma4q.onrender.com";

  // Default config for not logged in user
  defaultUserId:any = 10; // default user id - 10
  defaultPhoto:any = "default.png";

  // Config for current logged in user
  User:any;
  loggedIn:any = false;
  userId:any = this.defaultUserId;  //Instead of this - USER COULD BE ENOUGH
  userName:any;

  logout(){
    this.User={
      UserId:this.defaultUserId,  //default user that does not exists
      UserName:"użytkowniku",
      Admin:false,
      PhotoFileName:this.defaultPhoto,
      Password:""
    }

    this.userName = "użytkowniku";
    this.userId = this.defaultUserId;
    this.loggedIn=false;
}

//   // Users
//   getUserList():Observable<any[]>{
//     return this.http.get<any[]>(this.APIUrl+ '/user/');
//   }

//   addUser(val:any){
//     return this.http.post(this.APIUrl+ '/user/', val);
//   }

}
