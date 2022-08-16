import { Component, OnInit, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { CurrentFloorService } from '../../../core/services/current-floor.service';
import { Floor } from '../../../core/enums/floor';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { FloorService } from '../../../core/services/floor.service';
import { AreasService } from '../../../core/services/areas.service';
import { DestroyableBase } from '../../../core/helpers/destroyble';

@Component({
  selector: 'app-map-container',
  templateUrl: './map-container.component.html',
  styleUrls: ['./map-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapContainerComponent extends DestroyableBase implements OnInit {

  public floor = Floor;
  @HostBinding('class.disable-area-a') areaA = false;
  @HostBinding('class.disable-area-b') areaB = false;
  @HostBinding('class.disable-area-c') areaC = false;
  @HostBinding('class.disable-area-d') areaD = false;
  @HostBinding('class.disable-area-e') areaE = false;
  public currentFloor$ = this.currentFloorService.currentFloor$.pipe(
  );
  public areas$ = this.currentFloor$.pipe(
    filter(floor => floor !== null),
    switchMap(floor => this.areaService.area$.pipe(
      map(areas => areas.filter(area => area.floor === floor
      ))
    ))
  )

  public allFloors$ = this.floorService.allFloors$;
  constructor(
    private currentFloorService: CurrentFloorService,
    private areaService: AreasService,
    private floorService: FloorService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.areas$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(areas => {
      this.areaA = false;
      this.areaB = false;
      this.areaC = false;
      this.areaD = false;
      areas.forEach(area => {
        if (!area.visible) {
          if(area.name === 'A') {
            this.areaA = true;
          }
          if(area.name === 'B') {
            this.areaB = true;
          }
          if(area.name === 'C') {
            this.areaC = true;
          }
          if(area.name === 'D') {
            this.areaD = true;
          }
        }
      })
    })
  }

}
