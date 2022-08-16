import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/department';
import { map, mapTo } from 'rxjs/operators';
import { FloorModel } from '../models/floorModel';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(
    private appConfigService: AppConfigService,
    private httpClient: HttpClient
  ) { }

  public getDepartments(): Observable<Department[]> {
    return  this.httpClient.get<any[]>(`${this.appConfigService.apiUrl}/get_departments`).pipe(
      map(data => data.map(dto => new Department(dto)))
    );
  }

  public updateDepartment(department: DepartmentDto): Observable<void> {
    return  this.httpClient.post<any[]>(`${this.appConfigService.apiUrl}/update_department`, department).pipe(
      mapTo(null)
    );
  }

  public createDepartment(department: Partial<DepartmentDto>): Observable<void> {
    return  this.httpClient.post<any[]>(`${this.appConfigService.apiUrl}/add_department`, department).pipe(
      mapTo(null)
    );
  }

  public deleteDepartments(ids: number[]): Observable<void> {
    return  this.httpClient.post<any[]>(`${this.appConfigService.apiUrl}/delete_departments`, ids).pipe(
      mapTo(null)
    );
  }
}

interface DepartmentDto {
  id: number;
  name: string;
  reception: string;
  idHIS: string;
  idQMS: string;
  qmsSOW: string;
}
