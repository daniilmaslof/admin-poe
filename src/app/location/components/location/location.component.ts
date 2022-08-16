import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { LocationTableWrapperComponent } from './location-table-wrapper/location-table-wrapper.component';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationComponent implements OnInit {

  @ViewChild(LocationTableWrapperComponent)
  locationTableWrapperComponent: LocationTableWrapperComponent
  constructor() { }

  public canDeactivate() {
     if(this.locationTableWrapperComponent.touchedLocation$.value.length) {
       return true
     } else {
       return false;
     }
  }
  ngOnInit(): void {
  }

}
