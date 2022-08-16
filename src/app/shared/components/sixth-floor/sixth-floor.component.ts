import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sixth-floor',
  templateUrl: './sixth-floor.component.svg',
  styleUrls: ['./sixth-floor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SixthFloorComponent implements OnInit {

  public isAreasRoute = false;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.isAreasRoute = this.router.url === '/areas';
  }

}
