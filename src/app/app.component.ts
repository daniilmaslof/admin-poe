import { Component } from '@angular/core';
import { IconsService } from './core/services/icon.service';
import { LocationService } from './core/services/location.service';
import { CategoryService } from './core/services/category.service';
import { AreasService } from './core/services/areas.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private l: AreasService,
    private iconsService: IconsService,
  ) {
    this.iconsService.registerMaterialIcons();
  }
}
