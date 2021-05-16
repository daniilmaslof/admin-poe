import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { Location } from '../models/location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(
    private appConfigService: AppConfigService,
    private httpClient: HttpClient
  ) { }

  public getLocations(): Observable<any> {
   return  this.httpClient.get<any[]>(`${this.appConfigService.apiUrl}/get_locations`).pipe(
     map(data => data.map(dto => new Location(dto)))
   );
  }

  public toggleLocations(isActivate: boolean, ids: string[]): Observable<void> {
    const params = new HttpParams().append(
      'isActivate', `${isActivate}`
    );
    return  this.httpClient.post<any[]>(`${this.appConfigService.apiUrl}/toggle_locations`, ids, {
      params,
    }).pipe(
     mapTo(void 0),
    );
  }
}
