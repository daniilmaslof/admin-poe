import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../../core/services/location.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {

  constructor(
    private lo: LocationService,
  ) {
    this.lo.getLocations().subscribe()
  }

  ngOnInit(): void {
  }

}
