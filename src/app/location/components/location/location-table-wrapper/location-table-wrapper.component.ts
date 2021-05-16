import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, merge, NEVER, Observable, of } from 'rxjs';
import { LocationFilter } from './location-filter';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Location } from '../../../../core/models/location';
import { debounceTime, first, map, mapTo, shareReplay, switchMap, switchMapTo, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
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

const PageSize = 5;

@Component({
  selector: 'app-location-table-wrapper',
  templateUrl: './location-table-wrapper.component.html',
  styleUrls: ['./location-table-wrapper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationTableWrapperComponent extends DestroyableBase {

  public isAllActivated = false;
  public touchedLocation$ = new BehaviorSubject<Location[]>([]);
  public selectedLocations$ = this.selectedLocationService.selectedLocation$;

  constructor(
    private locationService: LocationService,
    private selectedLocationService: SelectedLocationService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private areasService: AreasService
  ) {
    super();
    this.reload$.pipe(
      switchMap(() => this.locationService.getLocations()),
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
            if (!search.aries.includes(location.area)) {
              return filteredLocations;
            }
          }
          if (search.categories.length) {
            if (!search.categories.includes(location.category)) {
              return filteredLocations;
            }
          }
          if (search.locationFilter === LocationFilter.POI && !location.poi) {
            return filteredLocations;
          }
          if (search.locationFilter === LocationFilter.Loc && location.poi) {
            return filteredLocations;
          }
          if (search.name && !location.name.includes(search.name)) {
            return filteredLocations;
          }
          if (search.floor !== Floor.All && search.floor !== location.floor) {
            return filteredLocations;
          }
          filteredLocations.push(location);
          return filteredLocations;
        }, [] as Location[]
      );
    })
  );

  public sortedLocations$ = combineLatest([this.filteredLocations$, this.sort$]).pipe(
    map(([locations, sort]) => clientSideSort(locations, sort.active, sort.direction === 'asc')),
  );


  public readonly paginationMetadata$ = combineLatest([this.search$, this.filteredLocations$]).pipe(
    debounceTime(0),
    map(([search, locations]) => ({
      page: search.page,
      totalPages: Math.ceil(locations.length / search.pageSize),
      totalCount: locations.length,
      pageSize: search.pageSize,
      isFirstPage: search.page === 0,
      isLastPage: search.page === Math.ceil(locations.length / search.pageSize),
    })),
    tap(c => console.log(c))
  );

  public locationFilterCollection = LocationFilter.getCollection();
  public floors = Floor.all;

  public toReadableFloor = Floor.toReadable;

  public areas$ = this.areasService.getAreas().pipe(
    map(areas => areas.map(area => area.name))
  );
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
    tap(c => console.log(c))
  );

  public createSearchForm(): Observable<FormGroup> {
    return combineLatest([this.categories$, this.areas$]).pipe(
      switchMap(([categories, aries]) => {
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
          floor: this.formBuilder.control(this.search$.value.floor),
          locationFilter: this.formBuilder.control(this.search$.value.locationFilter)
        });
        console.log(form);
        return merge(
          of(form),
          merge(
            this.createApplyChangesFormToSearchStream(form),
          ).pipe(switchMapTo(NEVER)),
        );
      })
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
    console.log(this.touchedLocation$);
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

  public chooseAll(isSelect: boolean, location: Location[]): void {
    if (isSelect) {
      this.selectedLocationService.selectedLocation$.next(location);
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
    this.touchedLocation$.pipe(
      first(),
      switchMap(locations => {
          return forkJoin([
            this.locationService.toggleLocations(true, locations.filter(location => location.active).map(location => location.archId)),
            this.locationService.toggleLocations(false, locations.filter(location => !location.active).map(location => location.archId))
          ]);
        }
      ),
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
}
