import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { Location } from '../models/location';
import { Category } from '../models/category';
import { LocationDto } from './location.service';
import { FullCategory } from '../models/full-category';

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

  public getCategory(id: number): Observable<FullCategory> {
    const params = new HttpParams().append(
      'id', `${id}`
    );
    return  this.httpClient.get<CategoryDto>(`${this.appConfigService.apiUrl}/get_category`, {params}).pipe(
      map(data => new FullCategory({
        id: data.id,
        quickSearch: data.quickSearch,
        name: data.name,
        locations: data.locations.map(loc => new Location(loc))
      }))
    );
  }

  public deleteCategories(ids: number[]): Observable<void> {
    return  this.httpClient.post<any[]>(`${this.appConfigService.apiUrl}/delete_categories`, ids).pipe(
      mapTo(null)
    );
  }
  public updateCategory(categoryDto: any): Observable<void> {
    return  this.httpClient.post<any[]>(`${this.appConfigService.apiUrl}/update_category_info`, categoryDto).pipe(
      mapTo(null)
    );
  }

  public createCategory(categoryDto: Partial<CategoryDto>): Observable<void> {
    return  this.httpClient.post<any[]>(`${this.appConfigService.apiUrl}/add_category`, categoryDto).pipe(
      mapTo(null)
    );
  }

  public toggleСategories(quickSearch: boolean, ids: number[]): Observable<void> {
    const params = new HttpParams().append(
      'quickSearch', `${quickSearch}`
    );
    return  this.httpClient.post<any[]>(`${this.appConfigService.apiUrl}/toggle_categories`, ids , {params}).pipe(
      mapTo(null)
    );
  }
}
interface CategoryDto {
  id: number;
  quickSearch: boolean;
  name: string;
  locations: LocationDto[];
}
