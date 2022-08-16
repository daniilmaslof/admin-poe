import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { Category } from '../models/category';
import { map, mapTo, startWith, switchMap, tap } from 'rxjs/operators';
import { FloorModel } from '../models/floorModel';

@Injectable({
  providedIn: 'root'
})
export class FloorService {

  public reload$ = new ReplaySubject(1);
  public allFloors$ = this.reload$.pipe(
    startWith(null),
    switchMap( () => this.getFloors())
    );
  constructor(
    private appConfigService: AppConfigService,
    private httpClient: HttpClient
  ) { }

  public getFloors(): Observable<FloorModel[]> {
    return  this.httpClient.get<any[]>(`${this.appConfigService.apiUrl}/get_floors`).pipe(
      map(data => data.map(dto => new FloorModel(dto))),
    );
  }

  public toggleFloors(isVisible: boolean, ids: number[]): Observable<void> {
    const params = new HttpParams().append(
      'isVisible', `${isVisible}`
    );
    return this.httpClient.post<any[]>(`${this.appConfigService.apiUrl}/toggle_floors`, ids, {params}).pipe(
      tap(() => this.reload$.next()),
      mapTo(void 0)
    );
  }
}
