import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { Category } from '../models/category';
import { map, mapTo, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { AppConfigService } from './app-config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Area } from '../models/area';


@Injectable({
  providedIn: 'root'
})
export class AreasService {
  public replay$ = new ReplaySubject(1);

  public areas$ = new BehaviorSubject([]);
  public area$ = this.replay$.pipe(
    startWith(null),
    switchMap(() => this.getAreas()),
    shareReplay({refCount: true, bufferSize: 1})
  )
  constructor(
    private appConfigService: AppConfigService,
    private httpClient: HttpClient
  ) { }


  public getAreas(): Observable<Area[]> {
    return  this.httpClient.get<any[]>(`${this.appConfigService.apiUrl}/get_areas`).pipe(
      map(data => data.map(dto => new Area(dto))),
      tap(a => this.areas$.next(a)),
    );
  }

  public toggleAreas(ids: number[], isVisible: boolean): Observable<void> {
    const params = new HttpParams().append(
      'isVisible', `${isVisible}`
    );
    return  this.httpClient.post<any[]>(`${this.appConfigService.apiUrl}/toggle_areas`, ids, {params}).pipe(
      tap(() => this.replay$.next()),
      mapTo(null),
    );
  }
}
