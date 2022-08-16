import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, mapTo, tap } from 'rxjs/operators';


/**
 * Storage service.
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {

  /**
   * Store an item in a storage.
   * @param key Item key.
   * @param item Item to store.
   */
  public setItem<T>(key: string, item: T): Observable<null> {
    return of(item)
      .pipe(
        map(value => JSON.stringify(value)),
        tap(value => localStorage.setItem(key, value)),
        mapTo(null),
      );
  }

  /**
   * Removes the item with the specified key.
   * @param key Key of the value to remove.
   */
  public removeItem(key: string): Observable<null> {
    return of(null)
      .pipe(
        tap(() => localStorage.removeItem(key)),
      );
  }

  /**
   * Get an item by a key.
   * @param key Item key.
   */
  public getItem<T>(key: string): Observable<T | null> {
    return of(key)
      .pipe(
        map(value => localStorage.getItem(value)),
        map(value => value ? JSON.parse(value) as T : null),
      );
  }
}

