import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Floor } from '../../../core/enums/floor';
import { FloorService } from '../../../core/services/floor.service';

import { first, startWith, switchMap, switchMapTo, takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, ReplaySubject } from 'rxjs';

import { FloorModel } from '../../../core/models/floorModel';
import { DestroyableBase } from '../../../core/helpers/destroyble';
import { CurrentFloorService } from '../../../core/services/current-floor.service';

@Component({
  selector: 'app-floor-table-wrapper',
  templateUrl: './floor-table-wrapper.component.html',
  styleUrls: ['./floor-table-wrapper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloorTableWrapperComponent extends DestroyableBase implements OnInit {

  public reload$ = new ReplaySubject<void>(1);
  public floors$ = this.reload$.pipe(
    startWith(null),
    switchMapTo(this.floorService.getFloors()),
    tap(() => this.isLoading$.next(false)),
  );
  public isLoading$ = new BehaviorSubject(false);
  public touchedFloors$ = new BehaviorSubject<FloorModel[]>([]);

  public toReadable = Floor.toReadable;
  constructor(
    private floorService: FloorService,
    private currentFloorService: CurrentFloorService
  ) {
    super();
  }

  ngOnInit(): void {
  }
  public changeFloorVisibility(floor: FloorModel): void {
    const foundFloorIndex = this.touchedFloors$.value.findIndex(touchedFlor => floor.id === touchedFlor.id);
    if (foundFloorIndex !== -1) {
      this.touchedFloors$.next([
        ...this.touchedFloors$.value.slice(0, foundFloorIndex),
        floor,
        ...this.touchedFloors$.value.slice(foundFloorIndex + 1, this.touchedFloors$.value.length)
      ]);
    } else {
      this.touchedFloors$.next([...this.touchedFloors$.value, floor]);
    }
  }

  public uploadFloors(): void {
    this.isLoading$.next(true);
    this.touchedFloors$.pipe(
      first(),
      switchMap(locations => {
          return forkJoin([
            this.floorService.toggleFloors(true, locations.filter(location => location.visible).map(location => location.id)),
            this.floorService.toggleFloors( false, locations.filter(location => !location.visible).map(location => location.id))
          ]);
        }
      ),
      first(),
      takeUntil(this.destroy$),
    ).subscribe(() => {
      this.reload()
    });
  }

  public canDeactivate(): boolean {
    if (this.touchedFloors$.value.length) {
      return true;
    } else {
      return false;
    }
  }
  private reload() {
    this.reload$.next();
    this.touchedFloors$.next([]);
    this.isLoading$.next(true);
  }
  public cancel(): void {
    this.reload();
  }

}
