import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { map, mapTo, tap } from 'rxjs/operators';
import { StorageService } from './storage.service';

/** Storage key for token */
export const TOKEN_STORAGE_KEY = 'authToken';

/**
 * Token service
 */
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly currentToken$ = new ReplaySubject<AuthorizationToken | null>(1);
  /**
   * Returns `true` if user is authorized.
   */
  public readonly isAuthorized$ = this.currentToken$.pipe(
    map(token => !!token),
  );

  /**
   * Current active token data.
   */
  public readonly token$ = this.currentToken$.asObservable();

  public constructor(
    private storageService: StorageService,
  ) {
    this.setAuthorizationToken();
  }

  private setAuthorizationToken(): void {
    this.storageService.getItem<AuthorizationToken>(TOKEN_STORAGE_KEY).pipe(
      map(token => {
        if (!token) {
          return null;
        }
        return new AuthorizationToken({
          ...token,
        });
      }),
    ).subscribe(token => {
      this.currentToken$.next(token);
    });
  }

  /** Set new token value */
  public setToken$(token: AuthorizationToken): Observable<void> {
    return this.storageService.setItem(TOKEN_STORAGE_KEY, token).pipe(
      tap(() => this.currentToken$.next(token)),
      mapTo(void 0),
    );
  }

  /** Clear token value */
  public clear$(): Observable<void> {
    return this.storageService.removeItem(TOKEN_STORAGE_KEY).pipe(
      tap(() => this.currentToken$.next(null)),
      mapTo(void 0),
    );
  }
}

/**
 * Contains authorization information.
 */
export class AuthorizationToken {
  /** API access token. */
  public token: string;

  constructor(init: Partial<AuthorizationToken>) {
    this.token = init.token;
  }
}
