import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Location } from '../models/location';
@Injectable({
  providedIn: 'root'
})
export class SelectedLocationService {

  public selectedLocation$ = new BehaviorSubject<Location[]>([]);
}
