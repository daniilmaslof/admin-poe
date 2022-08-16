import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentTableWrapperComponent } from './components/departament-table-wrapper/department-table-wrapper.component';

const routes: Routes = [{
  path: '',
  component: DepartmentTableWrapperComponent
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule { }
