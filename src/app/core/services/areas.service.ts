import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { map } from 'rxjs/operators';
import { AppConfigService } from './app-config.service';
import { HttpClient } from '@angular/common/http';
import { Area } from '../models/area';

@Injectable({
  providedIn: 'root'
})
export class AreasService {

  constructor(
    private appConfigService: AppConfigService,
    private httpClient: HttpClient
  ) { }


  public getAreas(): Observable<Area[]> {
    return  this.httpClient.get<any[]>(`${this.appConfigService.apiUrl}/get_areas`).pipe(
      map(data => data.map(dto => new Area(dto)))
    );
  }
}
