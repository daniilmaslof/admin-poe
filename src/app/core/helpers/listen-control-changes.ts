import { AbstractControl } from '@angular/forms';
import { defer, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

export function listenControlChanges<T>(
  control: AbstractControl,
  compare?: (x: T, y: T) => boolean,
  time: number = 100,
): Observable<T> {
  return defer(() => (control.valueChanges as Observable<T>)
    .pipe(
      startWith(control.value),
      debounceTime(time),
      distinctUntilChanged(compare),
    ),
  );
}
