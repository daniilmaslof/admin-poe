import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-third-floor',
  templateUrl: './third-floor.component.svg',
  styleUrls: ['./third-floor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThirdFloorComponent implements OnInit {
  public isAreasRoute = false;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.isAreasRoute = this.router.url === '/areas';
  }

}
