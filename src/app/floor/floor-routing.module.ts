import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FloorComponent } from './components/floor/floor.component';
import { CanDeactivateGuard } from '../core/services/can-deactivate.guard';

const routes: Routes = [{
  path: '',
  component: FloorComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FloorRoutingModule { }
