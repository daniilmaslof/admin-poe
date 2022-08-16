import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaTableWrapperComponent } from './components/area-table-wrapper/area-table-wrapper.component';
import { AreaComponent } from './components/area/area.component';
import { CanDeactivateGuard } from '../core/services/can-deactivate.guard';

const routes: Routes = [{
  path: '',
  component: AreaComponent,
  canDeactivate: [CanDeactivateGuard]
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AreaRoutingModule { }
