import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SelectedLocationService } from '../../../core/services/selected-location.service';
import { Pure } from '../../../core/helpers/pure.decarator';
import { Location } from '../../../core/models/location';
import { map } from 'rxjs/operators';
import { LocationService } from '../../../core/services/location.service';
import { FloorService } from '../../../core/services/floor.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.svg',
  styleUrls: ['./map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit {

  public locations$  = this.selectedLocationService.selectedLocation$.pipe(
    map(locations => {
      return locations;
    }),
  );
  constructor(
    private locationService: LocationService,
    private selectedLocationService: SelectedLocationService
  ) { }

  ngOnInit(): void {
  }


  public selectPolygon(id: string, ): void{

  }

  @Pure
  public isSelected(id: string, locations: Location[]): boolean {
    return !!locations.find(loc => loc.archId === id);
  }
}
