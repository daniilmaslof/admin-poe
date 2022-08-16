import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<any> {
  constructor(
    private matDialog: MatDialog,
  ) {
  }

  public canDeactivate(component: any, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean> {
    if (component.canDeactivate()) {
      return this.matDialog.open(ConfirmDialogComponent, {
        data: {
          title: 'You have unsaved changes',
          subtitle: 'Are you sure you want to leave this page?',
          buttonText: 'Yes',
          buttonColor: 'Primary'
        }
      }).afterClosed().pipe(
      );
    } else {
      return of(true)
    }
  }
}
