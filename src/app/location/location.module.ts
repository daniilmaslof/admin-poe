import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationRoutingModule } from './location-routing.module';
import { LocationComponent } from './components/location/location.component';
import { SharedModule } from '../shared/shared.module';
import { LocationTableComponent } from './components/location/location-table/location-table.component';
import { LocationTableWrapperComponent } from './components/location/location-table-wrapper/location-table-wrapper.component';
import { SelectedLocationCheckboxComponent } from './components/location/selected-location-checkbox/selected-location-checkbox.component';


@NgModule({
  declarations: [
    LocationComponent,
    LocationTableComponent,
    LocationTableWrapperComponent,
    SelectedLocationCheckboxComponent
  ],
  imports: [
    SharedModule,
    LocationRoutingModule
  ]
})
export class LocationModule { }
