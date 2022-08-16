import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { NEVER, Observable } from 'rxjs';
import { catchError, first, switchMap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { AppConfigService } from './app-config.service';


/**
 * Interceptor to add access token to requests.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /**
   * @constructor
   * @param appConfigService - Configuration service.
   * @param tokenService - Token service.
   * @param router - Router.
   */
  constructor(
    private appConfigService: AppConfigService,
    private tokenService: TokenService,
    private router: Router,
  ) {
  }

  /**
   * Appends bearer token.
   * @inheritdoc
   */
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return this.tokenService.token$.pipe(
      first(),
      switchMap((token => {
          if (token) {
            const newReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${token?.token}`),
            });
            return next.handle(newReq);
          }
          this.router.navigate(['/login']);
          return NEVER;
        }),
      ),
      catchError(err => {
        console.log(err);
        if (err.status === 403) {
          this.router.navigate(['/login'])
        }
        return NEVER;
      }),
    );

  }
}
