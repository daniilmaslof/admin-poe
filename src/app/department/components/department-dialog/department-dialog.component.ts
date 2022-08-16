import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Location } from '../../../core/models/location';
import { Department } from '../../../core/models/department';
import { LocationService } from '../../../core/services/location.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { DestroyableBase } from '../../../core/helpers/destroyble';
import { DepartmentService } from '../../../core/services/department.service';

@Component({
  selector: 'app-department-dialog',
  templateUrl: './department-dialog.component.html',
  styleUrls: ['./department-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentDialogComponent extends DestroyableBase implements OnInit {
  public form = this.formBuilder.group({
    id: null,
    name: '',
    reception: null,
    idHIS: '',
    idQMS: '',
    qmsSOW: '',
  });
  public location$ = this.locationService.getPois().pipe(
    map(locations => locations.sort((loc1, loc2) => loc1.archId.localeCompare(loc2.archId))),
  );
  public isLoading$ = new BehaviorSubject<boolean>(false);
  public compareLocation = (category1, category2) => category1 && category2 && category1.id === category2.id;
  public compareLoc = (location: Location, location1: Location) => location && location1 && location.archId === location1.archId;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public readonly data: Department,
    private locationService: LocationService,
    private departmentService: DepartmentService,
    public readonly dialogRef: MatDialogRef<any>,
  ) {
    super();
  }

  /**
   * Compare product with search term.
   */
  public compareLocationWithTerm(location: Location, term: string): boolean {
    return location.name.toLowerCase().includes(term.toLowerCase()) || location.archId.toLowerCase().includes(term.toLowerCase());
  }
  ngOnInit(): void {
    if (this.data) {
      this.location$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(
        (locations) => {
          this.form.setValue({
            id: this.data.id,
            name: this.data.name,
            reception: locations.find(loc => loc.archId === this.data.reception),
            idHIS: this.data.idHIS,
            idQMS: this.data.idQMS,
            qmsSOW: this.data.qmsSOW,
          });
        }
      );
    }
  }

  public save(): void {
    if (!this.isLoading$.value) {
      this.isLoading$.next(true);
      const department = this.form.value;
      if (this.data) {
        this.departmentService.updateDepartment({
          id: department.id,
          name: department.name,
          reception: department.reception.archId,
          idHIS: department.idHIS,
          idQMS: department.idQMS,
          qmsSOW: department.qmsSOW,
        }).pipe(
          takeUntil(this.destroy$)
        ).subscribe(
          () => this.dialogRef.close(true)
        );
      } else {
        this.departmentService.createDepartment({
          name: department.name,
          reception: department.reception.archId,
          idHIS: department.idHIS,
          idQMS: department.idQMS,
          qmsSOW: department.qmsSOW,
        }).pipe(
          takeUntil(this.destroy$)
        ).subscribe(
          () => this.dialogRef.close(true)
        );
      }
    }
  }

}
