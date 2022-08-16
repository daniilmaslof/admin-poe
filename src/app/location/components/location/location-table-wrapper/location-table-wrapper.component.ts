import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, merge, NEVER, Observable, of } from 'rxjs';
import { LocationFilter } from './location-filter';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Location } from '../../../../core/models/location';
import {
  debounceTime,
  filter,
  first,
  map,
  mapTo,
  shareReplay, startWith,
  switchMap,
  switchMapTo,
  takeUntil,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { sliceData } from '../../../../core/helpers/slice-data';
import { LocationService } from '../../../../core/services/location.service';
import { DestroyableBase } from '../../../../core/helpers/destroyble';
import { CategoryService } from '../../../../core/services/category.service';
import { AreasService } from '../../../../core/services/areas.service';
import { Floor } from '../../../../core/enums/floor';
import { LocationSearch } from './location-search';
import { PageEvent } from '../../../../shared/components/paginator/paginator.component';
import { Sort } from '@angular/material/sort';
import { clientSideSort } from '../../../../core/helpers/sort';
import { SelectedLocationService } from '../../../../core/services/selected-location.service';
import { Pure } from '../../../../core/helpers/pure.decarator';
import { MatDialog } from '@angular/material/dialog';
import { SelectionPoiComponent } from '../selection-poi/selection-poi.component';
import { PoiDialogComponent } from '../poi-dialog/poi-dialog.component';
import { Area } from '../../../../core/models/area';
import { CurrentFloorService } from '../../../../core/services/current-floor.service';


const PageSize = 13;

@Component({
  selector: 'app-location-table-wrapper',
  templateUrl: './location-table-wrapper.component.html',
  styleUrls: ['./location-table-wrapper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationTableWrapperComponent extends DestroyableBase {

  public isLoading$ = new BehaviorSubject(true);
  public isAllActivated = false;
  public touchedLocation$ = new BehaviorSubject<Location[]>([]);
  public selectedLocations$ = this.selectedLocationService.selectedLocation$;
  public allAreas$ = this.areasService.getAreas().pipe(
    shareReplay({refCount: true, bufferSize: 1}),
  );
  public areas$ = new BehaviorSubject<string[]>([]);

  constructor(
    private currentFloorService: CurrentFloorService,
    private locationService: LocationService,
    private matDialog: MatDialog,
    private selectedLocationService: SelectedLocationService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private areasService: AreasService
  ) {
    super();
    this.reload$.pipe(
      tap(() => this.isLoading$.next(true)),
      switchMap(() => this.locationService.getLocations()),
      map(locations => {
        const flatLocations = locations.reduce((childrenLocations, location) => [...childrenLocations, ...location.locations], []);
        return locations.filter(location => !flatLocations.find(childLocation => location.archId === childLocation.archId));
      }),
      tap(() => this.isLoading$.next(false)),
      takeUntil(this.destroy$),
    ).subscribe(locations => this.locations$.next(locations));
    this.search$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(() => this.selectedLocationService.selectedLocation$.next([]));
  }

  public reload$ = new BehaviorSubject<void>(null);

  public readonly sort$ = new BehaviorSubject<Sort>({ active: '', direction: '' });
  public readonly search$ = new BehaviorSubject<LocationSearch>({
    page: 1,
    pageSize: PageSize,
    locationFilter: LocationFilter.All,
    categories: [],
    floor: Floor.All,
    aries: [],
  });

  /**
   * Current locations.
   */
  public locations$ = new BehaviorSubject<Location[]>([]);

  private filteredLocations$ = combineLatest([this.search$, this.locations$]).pipe(
    debounceTime(0),
    map(([search, locations]) => {
      return locations.reduce(
        (filteredLocations, location) => {
          if (search.aries.length) {
            if (!search.aries.includes(location.area)
              || location.locations.find(loc => !search.aries.includes(loc.area))) {
              return filteredLocations;
            }
          }
          if (search.categories.length) {
            if (!((search.categories.includes(location.category)
              || location.locations.find(loc => (search.categories.includes(loc.category)))))
            ) {
              return filteredLocations;
            }
          }
          if (search.locationFilter === LocationFilter.POI && !location.poi) {
            return filteredLocations;
          }
          if (search.locationFilter === LocationFilter.Loc && location.poi) {
            return filteredLocations;
          }
          if (search.name &&
            !(
              location.name.toLowerCase().includes(search.name.toLowerCase()) || location.locations.find(loc => loc.name.toLowerCase().includes(search.name.toLowerCase()))
              || location.archId.toLowerCase().includes(search.name.toLowerCase()) || location.locations.find(loc => loc.archId.toLowerCase().includes(search.name.toLowerCase())))
          ) {
            if (!((location.locations.find(loc => loc.name.toLowerCase().includes(search.name.toLowerCase()) || location.locations.find(loc => loc.archId.toLowerCase().includes(search.name.toLowerCase())))))) {
              location.isExpanded = true;
              return filteredLocations;
            } else {
              location.isExpanded = false;
              return filteredLocations;
            }
          }
          if (search.floor !== Floor.All && !
            (
              search.floor === location.floor
              || location.locations.find(loc => loc.floor === search.floor)
            )) {
            return filteredLocations;
          }
          if (search.name && ((location.locations.find(loc => loc.name.toLowerCase().includes(search.name.toLowerCase()) || location.locations.find(loc => loc.archId.toLowerCase().includes(search.name.toLowerCase())))))) {
            location.isExpanded = true;
          } else {
            location.isExpanded = false;
          }
          filteredLocations.push(location);
          return filteredLocations;
        }, [] as Location[]
      );
    })
  );

  public locationData$ = combineLatest([this.selectedLocationService.isSelectedOnMap$, this.filteredLocations$]).pipe(
    switchMap(([isSelected, locations]) => {
      if(isSelected) {
        return this.selectedLocationService.selectedLocation$;
      } else {
        return of(locations)
      }
    })
  );
  public sortedLocations$ = combineLatest([this.locationData$, this.sort$]).pipe(
    map(([locations, sort]) => clientSideSort(locations, sort.active, sort.direction === 'asc')),
  );


  public readonly paginationMetadata$ = combineLatest([this.search$, this.locationData$]).pipe(
    debounceTime(0),
    map(([search, locations]) => ({
      page: search.page,
      totalPages: Math.ceil(locations.length / search.pageSize),
      totalCount: locations.length,
      pageSize: search.pageSize,
      isFirstPage: search.page === 0,
      isLastPage: search.page === Math.ceil(locations.length / search.pageSize),
    })),
  );

  public locationFilterCollection = LocationFilter.getCollection();
  public floors = Floor.all;

  public toReadableFloor = Floor.toReadable;
  public categories$ = this.categoryService.getCategories().pipe(
    map(categories => categories.map(category => category.name))
  );
  public toReadableLocation = LocationFilter.toReadable;
  public locationFilter = new FormControl(LocationFilter.All);

  public form$ = this.createSearchForm();

  /**
   * Restaurants with pagination applied.
   */
  public readonly paginatedLocations$: Observable<Location[]> = combineLatest([
    this.search$,
    this.sortedLocations$,
  ]).pipe(
    debounceTime(0),
    map(([pageEvent, locations]) => sliceData(locations, pageEvent)),
  );

  public createSearchForm(): Observable<FormGroup> {
    console.log(this.currentFloorService.currentFloor$.value)
    return combineLatest([this.categories$, this.areas$, this.currentFloorService.currentFloor$]).pipe(
      first(),
      switchMap(([categories, aries, currentFloor]) => {
        const categoriesControl = this.formBuilder.array(categories.map(category => {
          if (this.search$.value.categories.includes(category)) {
            return this.formBuilder.control(true);
          }
          return this.formBuilder.control(false);
        }));
        const ariesControl = this.formBuilder.array(aries.map(area => {
          if (this.search$.value.aries.includes(area)) {
            return this.formBuilder.control(true);
          }
          return this.formBuilder.control(false);
        }));
        const form = this.formBuilder.group({
          categories: categoriesControl,
          aries: ariesControl,
          name: this.search$.value.name,
          floor: currentFloor ?? Floor.All,
          locationFilter: this.formBuilder.control(this.search$.value.locationFilter)
        });
        // console.log(form);
        return merge(
          of(form),
          merge(
            this.createUpdatingAreaStream(form),
            this.createApplyChangesFormToSearchStream(form),
          ).pipe(switchMapTo(NEVER)),
        );
      })
    );
  }

  public createUpdatingAreaStream(form: FormGroup): Observable<void> {
    return form.get('floor').valueChanges.pipe(
      startWith(form.get('floor').value),
      tap(() => this.currentFloorService.currentFloor$.next(form.get('floor').value)),
      switchMap((floor) => this.allAreas$.pipe(
        tap((allAries) => {
          const aries = allAries.filter(area => area.floor === floor).map(area => area.name);
          const ariesControl = this.formBuilder.array(aries.map(area => {
            if (this.search$.value.aries.includes(area)) {
              return this.formBuilder.control(true);
            }
            return this.formBuilder.control(false);
          }));
          console.log(ariesControl);
          form.removeControl('aries');
          form.addControl('aries', ariesControl);
        }),
        tap(areas => {
          this.areas$.next(areas.filter(area => area.floor === floor).map(area => area.name));
        }),
        mapTo(void 0),
      )),
    );
  }

  public createApplyChangesFormToSearchStream(form: FormGroup): Observable<void> {
    return form.valueChanges.pipe(
      debounceTime(0),
      withLatestFrom(this.categories$, this.areas$),
      tap(([value, categories, aries]) => {
        const selectedCategories = categories.filter((category, index) => !!value.categories[index]);
        const selectedAries = aries.filter((category, index) => !!value.aries[index]);
        this.search$.next({
          ...this.search$.value,
          page: 1,
          aries: selectedAries,
          name: value.name,
          locationFilter: value.locationFilter,
          floor: value.floor,
          categories: selectedCategories,
        });
      }),
      mapTo(null),
    );
  }

  public sortChanged(sort: Sort): void {
    this.sort$.next(sort);
  }

  public pageChange(event: PageEvent): void {
    this.search$.next({
      ...this.search$.value,
      page: event.pageIndex,
    });
  }

  public activateLocation(location: Location): void {
    const foundLocationIndex = this.touchedLocation$.value.findIndex(loc => loc.archId === location.archId);
    if (foundLocationIndex !== -1) {
      this.touchedLocation$.next([
        ...this.touchedLocation$.value.slice(0, foundLocationIndex),
        location,
        ...this.touchedLocation$.value.slice(foundLocationIndex + 1, this.touchedLocation$.value.length)
      ]);
    } else {
      this.touchedLocation$.next([...this.touchedLocation$.value, location]);
    }
    // console.log(this.touchedLocation$);
  }

  public activateSelectedLocations(): void {
    this.isAllActivated = !this.isAllActivated;
    this.selectedLocationService.selectedLocation$.next(
      this.selectedLocationService.selectedLocation$.value.map(location => {
        location.active = this.isAllActivated;
        return location;
      })
    );
    this.selectedLocationService.selectedLocation$.value.forEach(location => this.activateLocation(location));
  }

  public chooseAll(isSelect: boolean, locations: Location[]): void {
    if (isSelect) {
      const allLocations = [
        ...locations,
        ...locations.filter(loc => !!loc.locations).reduce((childLocations, loc) => [...childLocations, ...loc.locations], []),
      ];
      this.selectedLocationService.selectedLocation$.next(allLocations);
    } else {
      // console.log()
      this.selectedLocationService.selectedLocation$.next([]);
    }
  }

  @Pure
  public isEqualLocations(locations: Location[], selectedLocation: Location[]): boolean {
    return locations.every((location, index) => selectedLocation.find(loc => location.archId === loc.archId));
  }

  public cancel(): void {
    this.reload();
  }

  public uploadLocation(): void {
    this.isLoading$.next(true);
    this.touchedLocation$.pipe(
      first(),
      switchMap(locations => {
          return forkJoin([
            this.locationService.toggleLocations(true, locations.filter(location => location.active).map(location => location.archId)),
            this.locationService.toggleLocations(false, locations.filter(location => !location.active).map(location => location.archId))
          ]);
        }
      ),
      first(),
      takeUntil(this.destroy$),
    ).subscribe(() => {
      this.reload();
    });
  }

  public reload(): void {
    this.selectedLocations$.next([]);
    this.touchedLocation$.next([]);
    this.reload$.next();
  }

  @Pure
  public onlyLocations(locations: Location[]): boolean {
    return locations.length && locations.every(location => !location.poi);
  }

  public addToPoi(): void {
    this.matDialog.open(SelectionPoiComponent, {
      data: this.selectedLocations$.value
    }).afterClosed().pipe(
      first(),
    ).subscribe(() => this.reload());
  }

  @Pure
  public isLocation(locations: Location[]): boolean {
    return locations.length === 1 && locations[0].poi === false;
  }


  public createPoiDialog(location: Location): void {

    location.poi = true;
    this.matDialog.open(PoiDialogComponent, { data: {location} }).afterClosed().pipe(
      first(),
      filter(value => !!value),
    ).subscribe(
      () => this.reload()
    );
  }

  public removePoi(location: Location[]): void {
    this.isLoading$.next(true);
    this.locationService.deletePois(location.map(loc => loc.archId)).pipe(
      first(),
      takeUntil(this.destroy$),
    ).subscribe(() => this.reload());

  }
}
