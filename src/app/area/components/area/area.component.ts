import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { AreaTableWrapperComponent } from '../area-table-wrapper/area-table-wrapper.component';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaComponent implements OnInit {

  @ViewChild(AreaTableWrapperComponent)
  areaTableWrapperComponent: AreaTableWrapperComponent
  constructor() { }

  ngOnInit(): void {
  }

  public canDeactivate(): boolean {
    return this.areaTableWrapperComponent.canDeactivate();
  }

}
