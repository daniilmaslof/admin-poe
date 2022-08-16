import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Location } from '../../core/models/location';
import { SelectedLocationService } from '../../core/services/selected-location.service';
import { LocationService } from '../../core/services/location.service';
import { DestroyableBase } from '../../core/helpers/destroyble';
import { first, map, switchMap, takeUntil } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { AreasService } from '../../core/services/areas.service';
import { ActivatedRoute, Router } from '@angular/router';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[appId]'
})
export class LocationStatusDirective extends DestroyableBase implements AfterViewChecked, OnDestroy {

  @Input()
  public appId: string;

  private circle = null;
  private selected: boolean;
  private disabled: boolean;

  /**
   * Navigate to default href or back url.
   */
  @HostListener('click', ['$event'])
  public onClick(): void {
    this.selectedLocationService.isClickedOnMap$.next(true);
    if (!this.appId) {
      return;
    }
    const flatLocations = this.selectedLocationService.selectedLocation$.value.reduce((childrenLocations, location) => [...childrenLocations, location, ...location.locations], []);
    const isSelect = flatLocations.find(loc => loc.archId.toLowerCase() === this.appId.toLowerCase());
    const currentLocation = this.locationService.allLocations$.value.find(loc => loc.archId.toLowerCase() === this.appId.toLowerCase());
    if (!currentLocation) {
      return;
    }
    console.log(currentLocation);
    if (!isSelect && currentLocation) {
      if (currentLocation.locations.length) {
        this.selectedLocationService.selectedLocation$.next([...this.selectedLocationService.selectedLocation$.value, currentLocation, ...currentLocation?.locations ?? []]);
      } else {
        this.selectedLocationService.selectedLocation$.next([...this.selectedLocationService.selectedLocation$.value, currentLocation, ...currentLocation?.locations ?? []]);
      }
    } else {
      this.selectedLocationService.selectedLocation$.next(
        this.selectedLocationService.selectedLocation$.value.filter(
          location => {
            return location.archId.toLowerCase() !== currentLocation.archId.toLowerCase()
              && !currentLocation.locations.find(loc => location.archId.toLowerCase() === loc.archId.toLowerCase());
          }
        )
      );
    }
  }

  /**
   * Indicates if in progress class should be applied to the element.
   */
  @HostBinding('class.selected-location')
  public get addInProgressClass(): boolean {
    return this.selected;
  }

  /**
   * Indicates if in progress class should be applied to the element.
   */
  @HostBinding('class.area-a')
  public isAreaA = false;

  /**
   * Indicates if in progress class should be applied to the element.
   */
  @HostBinding('class.disabled-location')
  public get addDisabledClass(): boolean {
    return this.disabled;
  }
  public isAreasRoute = false;

  constructor(
    private el: ElementRef,
    private areasService: AreasService,
    private selectedLocationService: SelectedLocationService,
    private locationService: LocationService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }



  ngAfterViewChecked(): void {
    this.isAreasRoute = this.router.url === '/areas';

    combineLatest([this.locationService.allLocations$, this.areasService.area$]).pipe(
      switchMap(([locations, areas]) => locations.length ? of([locations, areas]) : this.locationService.getLocations().pipe(
        map(loc => ([loc, areas] as any))
      )),
      takeUntil(this.destroy$),
    ).subscribe(([locations, areas]) => {
      const loc = locations.find((l) => l.archId.toLowerCase() === this.appId.toLowerCase());
      if (!loc) {
        return;
      }
      const currentArea = areas.find(area => area.name === loc.area && area.floor === loc.floor);
      if(currentArea.name === 'A') {
        this.isAreaA = true;
      }
      this.disabled = !loc.active || !currentArea?.visible;
      if (loc.poi && !this.isAreasRoute) {
        const bbox = this.el.nativeElement.getBBox();
        const text = document.getElementById('one');
        const center = {
          x: bbox.x + bbox.width / 2,
          y: bbox.y + bbox.height / 2
        };
        this.circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.circle.addEventListener('click', () => this.onClick());
        this.circle.setAttribute('cx', center.x);
        this.circle.setAttribute('cy', center.y);
        this.circle.setAttribute('r', '2.5');
        this.circle.setAttribute('fill', '#F43535');
        this.circle.setAttribute('height', '30');
        this.el.nativeElement.ownerSVGElement.insertBefore(this.circle, text);
      } else if (this.circle) {
        this.el.nativeElement.ownerSVGElement.removeChild(this.circle);
        console.log(this.circle)
      }
      this.cdr.markForCheck();
    });
    this.selectedLocationService.selectedLocation$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(locations => {
      this.selected = !!locations.find((loc) => loc.archId.toLowerCase() === this.appId.toLowerCase());
      this.cdr.markForCheck();
    });
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
    if (this.circle) {
      this.el.nativeElement.ownerSVGElement.removeChild(this.circle);
      this.circle.removeEventListener('click', () => {
      });
    }
  }
}
