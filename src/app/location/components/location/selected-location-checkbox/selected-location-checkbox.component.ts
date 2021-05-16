import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { Location } from '../../../../core/models/location';
import { SelectedLocationService } from '../../../../core/services/selected-location.service';
import { DestroyableBase } from '../../../../core/helpers/destroyble';
import { takeUntil } from 'rxjs/operators';

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
      takeUntil(this.destroy$),
    ).subscribe(
      locations => {
        if (locations.includes(this.location)) {
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
      this.selectedLocationService.selectedLocation$.next([...this.selectedLocationService.selectedLocation$.value, this.location]);
    } else {
      this.selectedLocationService.selectedLocation$.next(
        this.selectedLocationService.selectedLocation$.value.filter(location => location.archId !== this.location.archId)
      )
    }
  }

}
