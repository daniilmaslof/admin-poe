import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-fifth-floor',
  templateUrl: './fifth-floor.component.svg',
  styleUrls: ['./fifth-floor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FifthFloorComponent implements OnInit {

  public isAreasRoute = false;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.isAreasRoute = this.router.url === '/areas';
  }
}
