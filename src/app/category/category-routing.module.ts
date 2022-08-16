import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryTableWrapperComponent } from './components/category-table-wrapper/category-table-wrapper.component';

const routes: Routes = [{
  path: '',
  component: CategoryTableWrapperComponent
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
