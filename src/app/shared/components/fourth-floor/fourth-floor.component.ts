import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-fourth-floor',
  templateUrl: './fourth-floor.component.svg',
  styleUrls: ['./fourth-floor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FourthFloorComponent implements OnInit {
  public isAreasRoute = false;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.isAreasRoute = this.router.url === '/areas';
  }
}
