import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { Location } from '../../../../core/models/location';
import { SelectedLocationService } from '../../../../core/services/selected-location.service';
import { DestroyableBase } from '../../../../core/helpers/destroyble';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-selected-location-checkbox',
  templateUrl: './selected-location-checkbox.component.html',
  styleUrls: ['./selected-location-checkbox.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedLocationCheckboxComponent extends DestroyableBase {

  @Input()
  location: Location;
  public isSelected: boolean;

  constructor(
    private cdr: ChangeDetectorRef,
    private selectedLocationService: SelectedLocationService,
  ) {
    super();
    this.selectedLocationService.selectedLocation$.pipe(
      debounceTime(200),
      takeUntil(this.destroy$),
    ).subscribe(
      locations => {
        // console.log(this.location)
        if (this.location && locations.find(loc => loc.archId === this.location.archId)) {
          this.isSelected = true;
        } else {
          this.isSelected = false;
        }
        this.cdr.markForCheck();
      }
    );
  }

  public selectChange(isSelect: boolean): void {
    if (isSelect) {
      this.selectedLocationService.selectedLocation$.next([...this.selectedLocationService.selectedLocation$.value, this.location, ...this.location.locations]);
    } else {
      this.selectedLocationService.selectedLocation$.next(
        this.selectedLocationService.selectedLocation$.value.filter(
          location => {
            // console.log(location);
            // console.log(this.location)
            return  location.archId !== this.location.archId
            && !this.location.locations.find(loc => location.archId === loc.archId)
          }
        )
      );
    }
  }

}
