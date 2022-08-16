import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FullCategory } from '../models/full-category';
import { map, mapTo, tap } from 'rxjs/operators';
import { Location } from '../models/location';
import { Settings } from '../models/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor(
    private appConfigService: AppConfigService,
    private httpClient: HttpClient
  ) { }

  public getSettings(): Observable<Settings> {
    return  this.httpClient.get<any>(`${this.appConfigService.apiUrl}/get_settings`).pipe(
      map(data => new Settings({
        greetingText: data?.greetingText ?? '',
        unloginTimeInSeconds: data?.unloginTimeInSeconds ?? '',
        sosMessage: data?.sosMessage ?? '',
        showQuickSearch: data?.showQuickSearch ?? '',
        idleTimeInSeconds: data?.idleTimeInSeconds ?? ''
      }))
    );
  }

  public getMonitoring(): Observable<any> {
    return this.httpClient.get<any>(`${this.appConfigService.apiUrl}/get_monitoring`).pipe(
      tap(c => console.log(c))
    );
  }

  public updateSettings(settings: Settings): Observable<void> {
    return  this.httpClient.post<any[]>(`${this.appConfigService.apiUrl}/update_settings`, settings).pipe(
      mapTo(null)
    );
  }
}
