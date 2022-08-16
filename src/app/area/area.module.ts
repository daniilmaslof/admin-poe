import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreaRoutingModule } from './area-routing.module';
import { AreaTableComponent } from './components/area-table/area-table.component';
import { AreaTableWrapperComponent } from './components/area-table-wrapper/area-table-wrapper.component';
import { SharedModule } from '../shared/shared.module';
import { AreaComponent } from './components/area/area.component';


@NgModule({
  declarations: [
    AreaTableComponent,
    AreaTableWrapperComponent,
    AreaComponent
  ],
  imports: [
    SharedModule,
    AreaRoutingModule
  ]
})
export class AreaModule { }
