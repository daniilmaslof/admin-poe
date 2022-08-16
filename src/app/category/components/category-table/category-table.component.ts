import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { Floor } from '../../../core/enums/floor';
import { Department } from '../../../core/models/department';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { filter, first, takeUntil } from 'rxjs/operators';
import { DepartmentDialogComponent } from '../../../department/components/department-dialog/department-dialog.component';
import { Category } from '../../../core/models/category';
import { DestroyableBase } from '../../../core/helpers/destroyble';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CategoryService } from '../../../core/services/category.service';
import { FullCategory } from '../../../core/models/full-category';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-category-table',
  templateUrl: './category-table.component.html',
  styleUrls: ['./category-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryTableComponent extends DestroyableBase {


  public displayedColumns = ['action', 'icon', 'name', 'editable', 'quickSearch'];
  public form = this.formBuilder.array([]);
  public toReadable = Floor.toFullReadable;
  public data: Category[];

  constructor(
    private matDialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
  ) {
    super();
    this.form.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe(values => this.changeSelectedCategories.emit(values.filter(value => !!value.checked).map(value => value.category)));
  }

  @Output()
  public reload = new EventEmitter<void>();

  @Output()
  public changeSelectedCategories = new EventEmitter<Category[]>();

  @Input()
  public set departments(categories: Category[]) {
    if (categories.length) {
      this.form.clear();
      categories.forEach(category => this.form.push(this.formBuilder.group({
        category,
        checked: false,
        quickSearch: category.quickSearch,
      })));
      this.data = categories;
    }
  }
  public isLoading$ = new BehaviorSubject<boolean>(false);

  public changeQuickSearch(checked: MatSlideToggleChange, category: FullCategory): void {
    checked.source.setDisabledState(true);
    this.categoryService.toggleСategories(
      !category.quickSearch,
      [category.id]
    ).pipe(first()).subscribe(() => {
      checked.source.setDisabledState(false);
      this.reload.emit();
      this.cdr.markForCheck();
    });
  }
  @Input()
  public set selectedCategories(categories: Category[]) {
    if (this.data) {
      if (!categories.length) {
        this.data.forEach((category, index) =>
          this.form.at(index).setValue({ category, checked: false, quickSearch: category.quickSearch ?? false, }, { emitEvent: false }));
      }
      categories.forEach(category => {
        const index = this.data.findIndex(value => category.id === value.id);
        if (index > -1) {
          this.form.at(index).setValue({
            category,
            checked: true,
            quickSearch: category.quickSearch ?? false,
          }, { emitEvent: false });
        }
      });
    }
  }


  public openCategoryDialog(data: Category): void {
    this.matDialog.open(CategoryDialogComponent, {data}).afterClosed().pipe(
      filter(value => !!value),
      takeUntil(this.destroy$)
    ).subscribe(() => this.reload.emit())
  }
}
