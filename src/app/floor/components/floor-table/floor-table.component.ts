import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { Floor } from '../../../core/enums/floor';
import { Area } from '../../../core/models/area';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { filter, first, startWith, takeUntil } from 'rxjs/operators';
import { DestroyableBase } from '../../../core/helpers/destroyble';
import { MatDialog } from '@angular/material/dialog';
import { FloorModel } from '../../../core/models/floorModel';
import { FormControl } from '@angular/forms';
import { CurrentFloorService } from '../../../core/services/current-floor.service';

@Component({
  selector: 'app-floor-table',
  templateUrl: './floor-table.component.html',
  styleUrls: ['./floor-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloorTableComponent extends DestroyableBase implements OnInit {
  public displayedColumns = ['action', 'name', 'visibility'];
  public toReadable = Floor.toFullReadable;

  public control = new FormControl(null);

  constructor(
    private currentFloorService: CurrentFloorService,
    private matDialog: MatDialog,
  ) {
    super();
  }

  @Output()
  public toggleFloor = new EventEmitter<FloorModel>();
  @Input()
  public floors: FloorModel[];

  ngOnInit(): void {
    this.currentFloorService.currentFloor$.pipe(
      first(),
      takeUntil(this.destroy$),
    ).subscribe(floor => this.control.setValue(floor));
    this.control.valueChanges.pipe(
      startWith(this.control.value)
    ).subscribe(value => {
      if (this.floors) {
        this.currentFloorService.currentFloor$.next(this.floors.find(floor => floor.number === value).id);
      }
    });
  }

  public openVisibilityDialog(floor: FloorModel): void {
    if (floor.visible) {
      this.matDialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Turn off the floor visibility?',
          subtitle: 'The floor is no more visible in the application.\n' +
            'All POI will also be disabled',
          buttonText: 'Turn off',
          buttonColor: 'primary'
        }
      }).afterClosed().pipe(
        filter(data => !!data),
        takeUntil(this.destroy$),
      ).subscribe(
        () => {
          floor.visible = !floor.visible;
          this.toggleFloor.emit(floor);
        },
      );
    } else {
      floor.visible = !floor.visible;
      this.toggleFloor.emit(floor);
    }
  }
}
