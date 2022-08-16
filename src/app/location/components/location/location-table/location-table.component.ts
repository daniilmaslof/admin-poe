import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Location } from '../../../../core/models/location';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { PoiDialogComponent } from '../poi-dialog/poi-dialog.component';
import { filter, first, map, shareReplay } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';

import { Floor } from '../../../../core/enums/floor';
import { FloorService } from '../../../../core/services/floor.service';

export const expandableRowAnimation = trigger('expandableRow', [
  state('collapsed, void', style({
    height: '0px',
    visibility: 'hidden'
  })),
  state('expanded', style({
    'min-height': '48px',
    height: '*',
    visibility: 'visible'
  })),
  transition(
    'expanded <=> collapsed, void <=> *',
    animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
  ),
]);

@Component({
  selector: 'app-location-table',
  templateUrl: './location-table.component.html',
  styleUrls: ['./location-table.component.css'],
  animations: [expandableRowAnimation],
})
export class LocationTableComponent implements OnInit, OnChanges {

  public displayedColumns = ['action', 'name', 'type', 'isActivate', 'floor', 'area', 'category', 'archNumber'];

  public expandedColumns = [
    'expandedTable',
  ];
  public toReadable = Floor.toReadable;
  @Output()
  sortChanged = new EventEmitter<Sort>();

  @Output()
  reloadData = new EventEmitter<void>();
  @Output()
  public activateLocation = new EventEmitter<Location>();

  locationList = new MatTableDataSource();

  @Input()
  set locationsData(locations: Location[]) {
    if (locations && locations.length) {
      if(this.isAllExpandedRows) {
        this.locationList.data = locations.map(loc => {
          loc.isExpanded = true;
          return loc;
        });
      } else {
        this.locationList.data = locations;
        this.locationList._updateChangeSubscription()
      }
    }
  }
  isAllExpandedRows = false;
  @Input()
  set isAllExpanded(value: boolean) {
    this.isAllExpandedRows = value;
    // if (  this.locationList &&   this.locationList.data.length) {
      this.locationList._filterData(this.locationList.data.map((loc: Location) => {
        loc.isExpanded = true;
        console.log('aaa')
        return loc;
      }));
    // }
  }
  public disabledFloors$ = this.floorService.allFloors$.pipe(
    shareReplay({refCount: true, bufferSize:1}),
    map(floors => floors.filter(floor => !floor.visible).map(f => f.number))
  );
  constructor(
    private matDialog: MatDialog,
    private floorService: FloorService,
  ) {
  }

  ngOnInit(): void {
  }

  public changeActivate(isActive: boolean, item: Location): void {
    this.activateLocation.emit(new Location({
      ...item,
      active: isActive,
    }));
  }

  public openPoiDialog(location: Location, poi?: Location ): void {
    if (location.poi) {
      this.matDialog.open(PoiDialogComponent, { data: { location} }).afterClosed().pipe(
        first(),
        filter(value => !!value),
      ).subscribe(
        () => this.reloadData.emit()
      );
    } else  {
      this.matDialog.open(PoiDialogComponent, { data: {location, poi} }).afterClosed().pipe(
        first(),
        filter(value => !!value),
      ).subscribe(
        () => this.reloadData.emit()
      );
    }
  }

  toggleTableRows() {
    // this.dataStudentsList.data.forEach((row: any) => {
    //   row.isExpanded = this.isTableExpanded;
    // })
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
}
