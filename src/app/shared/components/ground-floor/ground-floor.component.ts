import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ground-floor',
  templateUrl: './ground-floor.component.svg',
  styleUrls: ['./ground-floor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroundFloorComponent implements OnInit {

  public isAreasRoute = false;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.isAreasRoute = this.router.url === '/areas';
  }
}
