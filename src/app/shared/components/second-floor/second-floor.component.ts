import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-second-floor',
  templateUrl: './second-floor.component.svg',
  styleUrls: ['./second-floor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecondFloorComponent implements OnInit {

  public isAreasRoute = false;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.isAreasRoute = this.router.url === '/areas';
  }
}
