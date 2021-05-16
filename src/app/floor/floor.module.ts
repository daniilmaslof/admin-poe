import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FloorRoutingModule } from './floor-routing.module';
import { FloorComponent } from './components/floor/floor.component';
import { SharedModule } from '../shared/shared.module';
import { FloorTableComponent } from './components/floor-table/floor-table.component';
import { FloorTableWrapperComponent } from './components/floor-table-wrapper/floor-table-wrapper.component';


@NgModule({
  declarations: [
    FloorComponent,
    FloorTableComponent,
    FloorTableWrapperComponent
  ],
  imports: [
    SharedModule,
    FloorRoutingModule
  ]
})
export class FloorModule { }
