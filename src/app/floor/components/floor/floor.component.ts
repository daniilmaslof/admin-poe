import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
