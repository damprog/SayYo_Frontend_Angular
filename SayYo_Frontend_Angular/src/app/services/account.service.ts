import {
  SY_RegisterDTO,
  SY_RegisterResponseDTO,
  SY_ResponseStatus,
  SY_LoginDTO,
  SY_UserDTO,
  SY_LoginResponseDTO,
} from './../models/dto';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { ConnectionService } from './connection.service';
import { UserAccount } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private _http: HttpClient, private _conn: ConnectionService) {}

  // ----------------------------------------------------------------------------------------------------------------------------------------------
  // For testing
  TEST_UserGuid = 'd9d4b0ce-82cc-4e14-ae2d-007b51cbe4c9';

  // Default config for not logged in user
  readonly DEFAULT_ACCOUNT_ID: string = '10'; // default user guid - 10 (that does not exist)
  readonly DEFAULT_PHOTO: string = 'default.png';
  readonly API_URL: string = this._conn.API_URL;

  // SY_ - refers to DTO (data transfer object) from API
  SY_LoginDTO: SY_LoginDTO = {
    email: '',
    password: '',
  };

  SY_RegisterDTO: SY_RegisterDTO = {
    username: '',
    password: '',
    email: '',
  };

  // Config for current logged in user
  account: UserAccount = {
    userGuid: this.DEFAULT_ACCOUNT_ID,
    userName: 'użytkowniku',
    email: '',
    isAdmin: false,
    photoFileName: this.DEFAULT_PHOTO,
  };
  isLoggedIn: boolean = false;

  logout(): void {
    this.account = {
      userGuid: this.DEFAULT_ACCOUNT_ID,
      userName: 'użytkowniku',
      email: '',
      isAdmin: false,
      photoFileName: this.DEFAULT_PHOTO,
    };
    this.isLoggedIn = false;
  }

  login(email: string, password: string): Observable<SY_ResponseStatus> {
    this.SY_LoginDTO.email = email;
    this.SY_LoginDTO.password = password;
    console.log("AccountService login1");
    return this._http
      .post<SY_LoginResponseDTO>(
        this.API_URL + 'sayyo/user/login/',
        this.SY_LoginDTO,
        {
          ...this._conn.httpOptions,
          observe: 'body',
        }
      )
      .pipe(
        map((response: any) => {

          localStorage.setItem('authToken', response.token);

          console.log("token: " + response.token);
          console.log("user: " + response.user);

          this.account = {
            userGuid: response.user.guid,
            userName: response.user.userName,
            email: response.user.email,
            isAdmin: response.user.isAdmin,
            photoFileName: this.DEFAULT_PHOTO,
          };

          this.isLoggedIn = true;

          return {
            success: true,
            message: 'Pomyślnie zalogowano.',
          } as SY_ResponseStatus;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Wystąpił błąd:', error.message);
          this.isLoggedIn = false;
          return of({
            success: false,
            message: error.error,
          } as SY_ResponseStatus);
        })
      );

    // ).pipe(
    //   map((userDTO: SY_UserDTO) => {
    //     this.account = {
    //       userGuid: userDTO.guid,
    //       userName: userDTO.userName,
    //       email: userDTO.email,
    //       isAdmin: userDTO.isAdmin,
    //       photoFileName: this.DEFAULT_PHOTO,
    //     };
    //     this.isLoggedIn = true;
    //     console.log("Test1 guid: "+this.account.userGuid);
    //     return  {
    //       success: true,
    //       message: "Pomyślnie zalogowano."
    //     } as SY_ResponseStatus;
    //   }),
    //   catchError((error: HttpErrorResponse) => {
    //     console.error('Wystąpił błąd:', error.message);
    //     this.isLoggedIn = false;
    //     return  of({
    //       success: false,
    //       message: error.error
    //     } as SY_ResponseStatus);
    //   })
    // );
  }

  register(
    username: string,
    email: string,
    password: string
  ): Observable<SY_ResponseStatus> {
    this.SY_RegisterDTO.username = username;
    this.SY_RegisterDTO.email = email;
    this.SY_RegisterDTO.password = password;

    return this._registerToCommunicator().pipe(
      map((response) => {
        return {
          success: response.success,
          message: response.message,
        } as SY_ResponseStatus;
      }), // Map response to true/false depending on 'success' field
      catchError((error: HttpErrorResponse) => {
        console.error('Registration error:', error);
        return of({
          success: false,
          message: error.error,
        } as SY_ResponseStatus);
      })
    );
  }

  // ----------------------------------------------------------------------------------------------------------------------------------------------
  // LoginController

  // returns UserDTO
  // private _loginToCommunicator(): Observable<SY_UserDTO> {
  //   return this._http.post<{ token: string; user: SY_UserDTO }>(
  //     this.API_URL + 'sayyo/user/login/',
  //     this.SY_LoginDTO,
  //     this._conn.httpOptions
  //   );
  // }

  // return GUID
  private _registerToCommunicator(): Observable<SY_RegisterResponseDTO> {
    return this._http.post<SY_RegisterResponseDTO>(
      this.API_URL + 'sayyo/user/register/',
      this.SY_RegisterDTO
    );
  }

  // returns UserDTO
  // getUser() {
  //   return this.http.get(this.APIUrl + 'sayyo/user/id/', this.SY_UserGuid);
  // }
}
