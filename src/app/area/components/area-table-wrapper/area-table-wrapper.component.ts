import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AreasService } from '../../../core/services/areas.service';
import { FloorService } from '../../../core/services/floor.service';
import { Floor } from '../../../core/enums/floor';
import { FormControl } from '@angular/forms';
import { first, map, shareReplay, startWith, switchMap, switchMapTo, takeUntil, tap } from 'rxjs/operators';
import { listenControlChanges } from '../../../core/helpers/listen-control-changes';
import { Area } from '../../../core/models/area';
import { DestroyableBase } from '../../../core/helpers/destroyble';
import { BehaviorSubject, combineLatest, forkJoin, ReplaySubject } from 'rxjs';
import { ngfactoryFilePath } from '@angular/compiler/src/aot/util';
import { SelectedLocationService } from '../../../core/services/selected-location.service';
import { CurrentFloorService } from '../../../core/services/current-floor.service';

@Component({
  selector: 'app-area-table-wrapper',
  templateUrl: './area-table-wrapper.component.html',
  styleUrls: ['./area-table-wrapper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaTableWrapperComponent extends DestroyableBase implements OnInit {
  public floorControl = new FormControl(0);
  public reload$ = new ReplaySubject(1);
  public touchedAreas$ = new BehaviorSubject<Area[]>([]);
  public isLoading$ = new BehaviorSubject(true);
  public cacheAreas$ = this.reload$.pipe(
    startWith(null),
    switchMapTo(this.areasService.area$),
    shareReplay({ refCount: true, bufferSize: 1 })
  );
  public areas$ = combineLatest([listenControlChanges(this.floorControl)]).pipe(
    switchMap(([floor]) => this.cacheAreas$.pipe(
      tap(() => this.currentFloorService.currentFloor$.next(floor)),
      map(areas => areas.filter(area => area.floor === floor))
    )),
    tap(() => this.isLoading$.next(false)),
  );
  public toReadableFloor = Floor.toReadable;
  public floors$ = this.floorService.getFloors();

  constructor(
    public areasService: AreasService,
    private currentFloorService: CurrentFloorService,
    public floorService: FloorService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.currentFloorService.currentFloor$.pipe(
      first(),
      takeUntil(this.destroy$),
    ).subscribe(floor => this.floorControl.setValue(floor));
  }

  public changeAreaVisibility(area: Area): void {
    const foundLocationIndex = this.touchedAreas$.value.findIndex(touchedArea => touchedArea.id === area.id);
    if (foundLocationIndex !== -1) {
      this.touchedAreas$.next([
        ...this.touchedAreas$.value.slice(0, foundLocationIndex),
        new Area({
          ...area,
          visible: area.visible,
        }),
        ...this.touchedAreas$.value.slice(foundLocationIndex + 1, this.touchedAreas$.value.length)
      ]);
    } else {
      this.touchedAreas$.next([...this.touchedAreas$.value, new Area({
        ...area,
        visible: area.visible
      })]);
    }
  }

  public uploadAreas(): void {
    this.isLoading$.next(true);
    this.touchedAreas$.pipe(
      first(),
      switchMap(locations => {
          return forkJoin([
            this.areasService.toggleAreas(locations.filter(location => location.visible).map(location => location.id), true),
            this.areasService.toggleAreas( locations.filter(location => !location.visible).map(location => location.id), false)
          ]);
        }
      ),
      first(),
      takeUntil(this.destroy$),
    ).subscribe(() => {
      this.reload();
    });
  }
  public reload() {
    this.reload$.next();
    this.touchedAreas$.next([]);
    this.isLoading$.next(true);
  }
  public cancel(): void {
    this.reload();
  }

  public canDeactivate(): boolean {
    if(this.touchedAreas$.value.length) {
      return true
    } else {
      return false
    }
  }

}

