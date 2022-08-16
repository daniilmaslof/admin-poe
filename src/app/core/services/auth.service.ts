import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { HttpBackend, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mapTo, switchMap } from 'rxjs/operators';
import { TokenService } from './token.service';


/**
 * Http client which ignores the interceptors.
 * Needed in order to avoid loop when updating the token when the interceptor intercept 401 error on refresh auth request.
 */
@Injectable({
  providedIn: 'root',
})
export class HttpBackendClient extends HttpClient {

  constructor(handler: HttpBackend) {
    super(handler);
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private appConfigService: AppConfigService,
    private httpClient: HttpBackendClient,
    private tokenService: TokenService,
  ) {
  }

  public login(email: string, password: string): Observable<void> {
    return this.httpClient.post<any>(`${this.appConfigService.apiUrl}/login`,{ login: email, password, rememberMe: true}).pipe(
      switchMap(token => this.tokenService.setToken$({token: token.id_token})),
      mapTo(null),
    );
  }
}
