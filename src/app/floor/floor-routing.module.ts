import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FloorComponent } from './components/floor/floor.component';

const routes: Routes = [{
  path: '',
  component: FloorComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FloorRoutingModule { }
