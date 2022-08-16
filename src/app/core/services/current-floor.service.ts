import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FloorModel } from '../models/floorModel';
import { Floor } from '../enums/floor';

@Injectable({
  providedIn: 'root'
})
export class CurrentFloorService {

  public currentFloor$ = new BehaviorSubject(null);
  constructor() { }
}
