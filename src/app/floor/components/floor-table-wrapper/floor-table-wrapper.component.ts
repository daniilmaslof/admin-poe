import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-floor-table-wrapper',
  templateUrl: './floor-table-wrapper.component.html',
  styleUrls: ['./floor-table-wrapper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloorTableWrapperComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
