import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AccountService } from '../services/account.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private _account: AccountService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          const refreshToken = localStorage.getItem('refreshToken');

          if (refreshToken) {
            // Try to refresh
            return this._account.refreshToken(refreshToken).pipe(
              switchMap((response: any) => {
                // Save new token
                localStorage.setItem('authToken', response.token);

                // Retry original request with new token
                const clonedRequest = request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${response.token}`
                  }
                });
                return next.handle(clonedRequest);
              }),
              catchError(() => {
                // If token refresh failed, logout user
                this._account.logout();
                return throwError(() => error);
              })
            );
          } else {
            // If lack of Refresh Token – logout user
            this._account.logout();
          }
        }

        return throwError(() => error);
      })
    );
  }
}
