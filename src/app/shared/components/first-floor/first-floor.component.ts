import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-first-floor',
  templateUrl: './first-floor.component.svg',
  styleUrls: ['./first-floor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FirstFloorComponent implements OnInit {

  public isAreasRoute = false;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.isAreasRoute = this.router.url === '/areas';
  }

}
