import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, mapTo, tap } from 'rxjs/operators';
import { Location } from '../models/location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {


  public allLocations$ = new BehaviorSubject<Location[]>([])
  constructor(
    private appConfigService: AppConfigService,
    private httpClient: HttpClient
  ) {
  }

  public getLocations(): Observable<Location[]> {
    return this.httpClient.get<any[]>(`${this.appConfigService.apiUrl}/get_locations`).pipe(
      map(data => data.map(dto => new Location(dto))),
      tap(allLocations => this.allLocations$.next(allLocations)),
    );
  }

  public getPois(): Observable<Location[]> {
    return this.httpClient.get<any[]>(`${this.appConfigService.apiUrl}/get_pois`).pipe(
      map(data => data.map(dto => new Location(dto)))
    );
  }


  public getLocation(id: string): Observable<Location> {
    const params = new HttpParams().append(
      'archId', `${id}`
    );
    return this.httpClient.get<Location>(`${this.appConfigService.apiUrl}/get_location_info`, {
      params,
    }).pipe(
      map(data => new Location(data)),
    );
  }


  public toggleLocations(isActivate: boolean, ids: string[]): Observable<void> {
    const params = new HttpParams().append(
      'isActivate', `${isActivate}`
    );
    return this.httpClient.post<any[]>(`${this.appConfigService.apiUrl}/toggle_locations`, ids, {
      params,
    }).pipe(
      mapTo(void 0),
    );
  }

  public updatePoi(location: LocationDto): Observable<void> {
    // const locationD
    return this.httpClient.post(`${this.appConfigService.apiUrl}/update_location_info`, location).pipe(
      mapTo(void 0),
    );
  }

  public addLocationToPoi(poiId: string, locationsIds: string[]): Observable<void> {
    const params = new HttpParams().append(
      'poiArchId', `${poiId}`
    );
    return this.httpClient.post(`${this.appConfigService.apiUrl}/add_locations_to_poi`, locationsIds, {
      params
    }).pipe(
      mapTo(void 0),
    );
  }

  public deletePois(ids: string[]): Observable<void> {
    return this.httpClient.post(`${this.appConfigService.apiUrl}/delete_pois`, ids).pipe(
      mapTo(void 0),
    );
  }
}

export interface LocationDto {
  archId: string;
  name: string;
  description: string;
  archId2: string;
  photo: string;
  area: string;
  floor: number;
  categoryId: string;
  locationIds: Location[];
  active: boolean;
  poi: boolean;
}
