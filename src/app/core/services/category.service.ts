import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Location } from '../models/location';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private appConfigService: AppConfigService,
    private httpClient: HttpClient
  ) { }

  public getCategories(): Observable<Category[]> {
    return  this.httpClient.get<any[]>(`${this.appConfigService.apiUrl}/get_categories`).pipe(
      map(data => data.map(dto => new Category(dto)))
    );
  }
}
