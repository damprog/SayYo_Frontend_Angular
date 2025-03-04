import {
  SY_RegisterDTO,
  SY_RegisterResponseDTO,
  SY_ResponseStatus,
  SY_LoginDTO,
  SY_UserDTO,
  SY_LoginResponseDTO,
} from './../models/dto';
import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { ConnectionService } from './connection.service';
import { UserAccount } from '../models/model';
import { Router } from '@angular/router';
import { ModalService } from './modal.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(
    private _modalService: ModalService,
    private _http: HttpClient,
    private _conn: ConnectionService,
    private _router: Router,
    private sanitizer: DomSanitizer
  ) {}

  // ------------------------------------------------------------------------------------
  public cleanup_Emitter: EventEmitter<void> = new EventEmitter<void>();

  // Default config for not logged in user
  readonly DEFAULT_ACCOUNT_ID: string = '10'; // default user guid - 10 (that does not exist)
  readonly DEFAULT_PHOTO: SafeUrl | null = null;
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
    profilePicture: this.DEFAULT_PHOTO,
  };
  isLoggedIn: boolean = false;

  loadProfilePicture(){
    this.getProfilePicture(this.account.userGuid).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.account.profilePicture = this.sanitizer.bypassSecurityTrustUrl(url);
      },
      error: (err) => {
        console.error('Błąd pobierania zdjęcia:', err);
      },
    });
  }

  // blob - download binary data
  getProfilePicture(userGuid: string): Observable<Blob> {
    return this._http.get(
      this.API_URL + `sayyo/misc/getProfilePicture/${userGuid}`,
      {
        responseType: 'blob',
      }
    );
  }

  uploadProfilePicture(formData: FormData): void {
    this._http
      .post(this.API_URL + 'sayyo/misc/uploadProfilePicture', formData)
      .subscribe({
        next: () => this._modalService.inform('Zdjęcie zostało przesłane.'),
        error: (err) => console.error('Błąd przesyłania zdjęcia:', err),
      });
  }

  cleanup(): void {
    this.cleanup_Emitter.emit();
  }

  refreshToken(refreshToken: string): Observable<any> {
    console.log('refreshToken');
    return this._http.post('refreshToken', { refreshToken });
  }

  logout(): void {
    this.account = {
      userGuid: this.DEFAULT_ACCOUNT_ID,
      userName: 'użytkowniku',
      email: '',
      isAdmin: false,
      profilePicture: this.DEFAULT_PHOTO,
    };
    this.cleanup();
    this.isLoggedIn = false;
    var refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      this._http.post(
        this.API_URL + 'sayyo/user/revokeRefreshToken',
        refreshToken
      );
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    this._router.navigate(['/start/login']);
  }

  tryLoginWithToken_Promise(): Promise<void> {
    return new Promise((resolve) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        console.log('Próba logowania z tokenem: ' + token);
        this.loginWithToken().subscribe((response: SY_ResponseStatus) => {
          if (response?.success) {
            console.log(response.message);
            this._router.navigate(['/main']);
            resolve();
          } else {
            console.log(response.message);
            resolve();
          }
        });
      } else {
        this._router.navigate(['/start/login']);
        resolve();
      }
    });
  }

  loginWithToken(): Observable<SY_ResponseStatus> {
    return this._http
      .post<SY_UserDTO>(this.API_URL + 'sayyo/user/loginWithToken', {})
      .pipe(
        map((response: any) => {
          this.account = {
            userGuid: response.user.guid,
            userName: response.user.userName,
            email: response.user.email,
            isAdmin: response.user.isAdmin,
            profilePicture: this.DEFAULT_PHOTO,
          };
          this.isLoggedIn = true;

          this.loadProfilePicture();

          return {
            success: true,
            message: 'Pomyślnie zalogowano z pomoca tokena.',
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
  }

  login(email: string, password: string): Observable<SY_ResponseStatus> {
    this.SY_LoginDTO.email = email;
    this.SY_LoginDTO.password = password;
    this.cleanup();
    console.log('AccountService login');
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
          localStorage.setItem('refreshToken', response.refreshToken);

          console.log('got token: ' + response.token);
          console.log('got refreshToken: ' + response.refreshToken);
          console.log('got user: ' + response.user);

          this.account = {
            userGuid: response.user.guid,
            userName: response.user.userName,
            email: response.user.email,
            isAdmin: response.user.isAdmin,
            profilePicture: this.DEFAULT_PHOTO,
          };

          this.isLoggedIn = true;

          this.loadProfilePicture();

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
