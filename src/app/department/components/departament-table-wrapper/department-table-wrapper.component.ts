import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DepartmentService } from '../../../core/services/department.service';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { filter, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Department } from '../../../core/models/department';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DestroyableBase } from '../../../core/helpers/destroyble';
import { DepartmentDialogComponent } from '../department-dialog/department-dialog.component';


/**
 * Department table wrapper.
 */
@Component({
  selector: 'app-department-table-wrapper',
  templateUrl: './department-table-wrapper.component.html',
  styleUrls: ['./department-table-wrapper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentTableWrapperComponent extends DestroyableBase implements OnInit {
  public isLoading$ = new BehaviorSubject(true);
  public reload$ = new ReplaySubject<void>(1);
  public selectedDepartments$ = new BehaviorSubject<Department[]>([]);
  public departments$ = this.reload$.pipe(
    startWith(null),
    switchMap(() => this.departmentService.getDepartments()),
    tap(() => this.isLoading$.next(false)),
  );

  constructor(
    private departmentService: DepartmentService,
    private matDialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {
  }

  public chooseAll(isSelect: boolean, departments: Department[]): void {
    if (isSelect) {
      this.selectedDepartments$.next(departments);
    } else {
      this.selectedDepartments$.next([]);
    }
  }

  public reload(): void {
    this.reload$.next();
    this.isLoading$.next(true);
  }

  public removeDepartment(): void {
    this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete department?',
        subtitle: 'All contents of this object will be deleted',
      }
    }).afterClosed().pipe(
      filter(value => !!value),
      switchMap(() => this.departmentService.deleteDepartments(this.selectedDepartments$.value.map(department => department.id))),
      takeUntil(this.destroy$)
    ).subscribe( () => this.reload());
  }

  public openDepartmentDialog(): void {
    this.matDialog.open(DepartmentDialogComponent).afterClosed().pipe(
      filter(value => !!value),
      takeUntil(this.destroy$)
    ).subscribe(() => this.reload())
  }
}
