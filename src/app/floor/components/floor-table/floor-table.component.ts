import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-floor-table',
  templateUrl: './floor-table.component.html',
  styleUrls: ['./floor-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloorTableComponent {
  public displayedColumns = ['action', 'name', 'visibility'];
  public exampleData = [
    {
      name: 'Ground floor',
      iaVisibly: true,
    },
    {
      name: '2th floor',
      iaVisibly: false,
    },
  ];

}
