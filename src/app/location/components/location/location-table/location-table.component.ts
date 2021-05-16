import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '../../../../core/models/location';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-location-table',
  templateUrl: './location-table.component.html',
  styleUrls: ['./location-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationTableComponent implements OnInit {

  public displayedColumns = ['action', 'name', 'type', 'isActivate', 'floor', 'area', 'category', 'archNumber'];

  @Output()
  sortChanged = new EventEmitter<Sort>();

  @Output()
  public activateLocation = new EventEmitter<Location>();
  @Input()
  locationsData: Location[];
  ngOnInit(): void {
  }

  public changeActivate(isActive: boolean, item: Location): void {
    this.activateLocation.emit(new Location({
      ...item,
      active: isActive,
    }));
  }
}
