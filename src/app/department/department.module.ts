import { NgModule } from '@angular/core';

import { DepartmentRoutingModule } from './department-routing.module';
import { DepartmentTableComponent } from './components/departament-table/department-table.component';
import { DepartmentTableWrapperComponent } from './components/departament-table-wrapper/department-table-wrapper.component';
import { SharedModule } from '../shared/shared.module';
import { DepartmentDialogComponent } from './components/department-dialog/department-dialog.component';


@NgModule({
  declarations: [
    DepartmentTableComponent,
    DepartmentTableWrapperComponent,
    DepartmentDialogComponent
  ],
  imports: [
    SharedModule,
    DepartmentRoutingModule
  ]
})
export class DepartmentModule {
}
