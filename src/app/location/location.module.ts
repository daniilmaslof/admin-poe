import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationRoutingModule } from './location-routing.module';
import { LocationComponent } from './components/location/location.component';
import { SharedModule } from '../shared/shared.module';
import { LocationTableComponent } from './components/location/location-table/location-table.component';
import { LocationTableWrapperComponent } from './components/location/location-table-wrapper/location-table-wrapper.component';
import { SelectedLocationCheckboxComponent } from './components/location/selected-location-checkbox/selected-location-checkbox.component';
import { PoiDialogComponent } from './components/location/poi-dialog/poi-dialog.component';
import { SelectionPoiComponent } from './components/location/selection-poi/selection-poi.component';


@NgModule({
  declarations: [
    LocationComponent,
    LocationTableComponent,
    LocationTableWrapperComponent,
    SelectedLocationCheckboxComponent,
    PoiDialogComponent,
    SelectionPoiComponent,
  ],
  imports: [
    SharedModule,
    LocationRoutingModule
  ]
})
export class LocationModule { }
