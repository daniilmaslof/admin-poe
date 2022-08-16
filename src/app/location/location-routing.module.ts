import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationComponent } from './components/location/location.component';
import { CanDeactivateGuard } from '../core/services/can-deactivate.guard';

const routes: Routes = [{
  path: '',
  component: LocationComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationRoutingModule { }
