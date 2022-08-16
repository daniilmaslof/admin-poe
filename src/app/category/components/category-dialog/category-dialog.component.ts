import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Department } from '../../../core/models/department';
import { LocationService } from '../../../core/services/location.service';
import { DepartmentService } from '../../../core/services/department.service';
import { DestroyableBase } from '../../../core/helpers/destroyble';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category';
import { Location } from '../../../core/models/location';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryDialogComponent extends DestroyableBase implements OnInit {
  public displayedColumns = ['name', 'archNumber', 'remove'];
  public form = this.formBuilder.group({
    id: '',
    name: '',
    locations: [],
  });
  public isLoading$ = new BehaviorSubject<boolean>(false);
  public allLocations$ = this.locationService.allLocations$;
  public locations$: Observable<Location[]>;
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public readonly data: Category,
    private locationService: LocationService,
    private categoryService: CategoryService,
    public readonly dialogRef: MatDialogRef<any>,
  ) {
    super();
  }

  public removeLocation(i: number): void {
    this.form.patchValue({locations: [...this.form.value.locations.slice(0, i), ...this.form.value.locations.slice(i + 1, this.form.value.locations.length)]});
  }
  ngOnInit(): void {
    this.locations$ = this.allLocations$.asObservable().pipe(
      map(locations => locations.filter(loc => loc.category === this.data.name)),
    );
    if (this.data) {
      this.categoryService.getCategory(this.data.id).pipe(
        takeUntil(this.destroy$),
      ).subscribe((category) => {
        this.isLoading$.next(false);
        this.form.patchValue({
          name: category.name,
          id: category.id,
          locations: category.locations,
        });
      });
    }
  }

  public save(): void {
    if (!this.isLoading$.value) {
      this.isLoading$.next(true);
      const category = this.form.value;
      if (this.data) {
        this.categoryService.updateCategory({
          id: category.id,
          name: category.name,
          locations: category.locations,
        }).pipe(
          takeUntil(this.destroy$)
        ).subscribe(
          () => this.dialogRef.close(true)
        );
      } else {
        this.categoryService.createCategory({
          id: null,
          name: category.name,
          locations: category.locations,
        }).pipe(
          takeUntil(this.destroy$)
        ).subscribe(
          () => this.dialogRef.close(true)
        );
      }
    }
  }

}
