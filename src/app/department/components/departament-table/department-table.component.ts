import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { Floor } from '../../../core/enums/floor';
import { Department } from '../../../core/models/department';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { DestroyableBase } from '../../../core/helpers/destroyble';
import { filter, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DepartmentDialogComponent } from '../department-dialog/department-dialog.component';

@Component({
  selector: 'app-department-table',
  templateUrl: './department-table.component.html',
  styleUrls: ['./department-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentTableComponent extends DestroyableBase {

  public displayedColumns = ['action', 'name', 'reception'];
  public form = this.formBuilder.array([]);
  public toReadable = Floor.toFullReadable;
  public data: Department[];

  constructor(
    private matDialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    super();
    this.form.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe(values => this.changeSelectedDepartments.emit(values.filter(value => !!value.checked).map(value => value.department)));
  }

  @Output()
  public reload = new EventEmitter<void>();

  @Output()
  public changeSelectedDepartments = new EventEmitter<Department[]>();

  @Input()
  public set departments(departments: Department[]) {
    if (departments.length) {
      this.form.clear();
      departments.forEach(department => this.form.push(this.formBuilder.group({
        department,
        checked: false,
      })));
      this.data = departments;
    }
  }

  @Input()
  public set selectedDepartments(departments: Department[]) {
    if (this.data) {
      if (!departments.length) {
        this.data.forEach((department, index) => this.form.at(index).setValue({ department, checked: false }, { emitEvent: false }));
      }
      departments.forEach(department => {
        const index = this.data.findIndex(value => department.id === value.id);
        if (index > -1) {
          this.form.at(index).setValue({
            department,
            checked: true,
          }, { emitEvent: false });
        }
      });
    }
  }


  public openDepartmentDialog(data: Department): void {
    this.matDialog.open(DepartmentDialogComponent, {data}).afterClosed().pipe(
      filter(value => !!value),
      takeUntil(this.destroy$)
    ).subscribe(() => this.reload.emit())
  }
}
