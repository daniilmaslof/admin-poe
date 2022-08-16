import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, from, Observable, ReplaySubject, Subject } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { DestroyableBase } from '../../core/helpers/destroyble';
import { filter, finalize, first, map, mapTo, switchMap, takeUntil, tap } from 'rxjs/operators';
import { catchFormHttpError } from '../../core/helpers/catch-form-http';
export const REDIRECT_QUERY_PARAM = 'redirectUrl';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent  extends DestroyableBase implements OnInit {
  private submit$ = new ReplaySubject<void>(1);

  /**
   * Emits `true` if authentication is in progress.
   * Emits `false` when authorization is done.
   */
  public login$ = new BehaviorSubject(false);

  public isLoading$ = new BehaviorSubject(false);

  /**
   * Login form.
   */
  public loginForm = this.createLoginForm();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {
    super();
  }

  /**
   * @inheritdoc
   */
  public ngOnInit(): void {
    this.subscribeToSubmit();
  }

  private subscribeToSubmit(): void {
    this.submit$
      .pipe(
        tap(() => this.loginForm.setErrors(null)),
        tap(() => this.login$.next(true)),
        map(() => this.loginForm.value),
        switchMap(({ email, password }) =>
          this.authService.login(email, password)
        ),
        takeUntil(this.destroy$),
      )
      .subscribe(
        () => this.router.navigate(['/locations'])
      );
  }

  private handleSuccessAuth(): Observable<void> {
    return this.route.queryParams.pipe(
      first(),
      switchMap(params => {
        const redirectUrl = params[REDIRECT_QUERY_PARAM];
        return from(this.router.navigate(redirectUrl || '/locations'));
      }),
      mapTo(null),
    );
  }

  private createLoginForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  /**
   * Submit.
   */
  public submit(): void {
    this.loginForm.markAllAsTouched();
    this.submit$.next();
  }

  /**
   * Form error.
   */
  public get formError(): string {
    return this.loginForm.errors && this.loginForm.errors.httpError;
  }

}
