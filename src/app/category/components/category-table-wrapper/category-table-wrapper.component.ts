import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { CategoryService } from '../../../core/services/category.service';
import { filter, map, shareReplay, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Department } from '../../../core/models/department';
import { DepartmentService } from '../../../core/services/department.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DepartmentDialogComponent } from '../../../department/components/department-dialog/department-dialog.component';
import { Category } from '../../../core/models/category';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { DestroyableBase } from '../../../core/helpers/destroyble';

@Component({
  selector: 'app-category-table-wrapper',
  templateUrl: './category-table-wrapper.component.html',
  styleUrls: ['./category-table-wrapper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryTableWrapperComponent extends DestroyableBase implements OnInit {

  public isLoading$ = new BehaviorSubject(true);
  public reload$ = new ReplaySubject<void>(1);
  public selectedDepartments$ = new BehaviorSubject<Category[]>([]);
  public categories$ = this.reload$.pipe(
    startWith(null),
    switchMap(() => this.categoryService.getCategories()),
    tap(() => this.isLoading$.next(false)),
    map(categories => categories.sort((c1, c2) => c1.name.localeCompare(c2.name))),
    shareReplay({refCount: true, bufferSize: 1}),
  );

  constructor(
    private categoryService: CategoryService,
    private matDialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {
  }

  public chooseAll(isSelect: boolean, categories: Category[]): void {
    if (isSelect) {
      this.selectedDepartments$.next(categories);
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
        title: 'Delete categories?',
        subtitle: 'All contents of this object will be deleted',
      }
    }).afterClosed().pipe(
      filter(value => !!value),
      switchMap(() => this.categoryService.deleteCategories(this.selectedDepartments$.value.map(department => department.id))),
      tap(() => this.isLoading$.next(false)),
      takeUntil(this.destroy$)
    ).subscribe(() => this.reload());
  }

  public openDepartmentDialog(): void {
    this.matDialog.open(CategoryDialogComponent).afterClosed().pipe(
      filter(value => !!value),
      takeUntil(this.destroy$)
    ).subscribe(() => this.reload())
  }
}
