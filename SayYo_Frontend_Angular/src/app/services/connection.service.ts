import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(private http: HttpClient) {

  }

  httpOptions: any = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': 'X-Custom-Header',
        'Access-Control-Allow-Origin': 'http://localhost:7203'
    })
  };

  // Url to communicator (SayYo) api - local
  readonly API_URL = "https://localhost:7203/";


}



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

