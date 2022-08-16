import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FloorTableWrapperComponent } from '../floor-table-wrapper/floor-table-wrapper.component';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloorComponent implements OnInit {

  @ViewChild(FloorTableWrapperComponent)
  public floorTableWrapperComponent: FloorTableWrapperComponent
  constructor() { }

  ngOnInit(): void {
  }

  public canDeactivate() {
    return this.floorTableWrapperComponent.canDeactivate()
  }
}
