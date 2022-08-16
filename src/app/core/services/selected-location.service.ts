import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Location } from '../models/location';
import { map, withLatestFrom } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SelectedLocationService {
  public isClickedOnMap$ = new BehaviorSubject<boolean>(false);
  public selectedLocation$ = new BehaviorSubject<Location[]>([]);
  public isSelectedOnMap$ = this.selectedLocation$.pipe(
    map(locations => !!locations.length),
    withLatestFrom(this.isClickedOnMap$),
    map(([isClicked, isContainsLocations]) => isClicked && isContainsLocations)
  );

  constructor() {
    this.selectedLocation$.subscribe(location =>{
      if(!location.length) {
        this.isClickedOnMap$.next(false);
      }
    })
  }
}
