import { Injectable } from '@angular/core';
import { Observable, Observer, of, OperatorFunction } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
/**
 * Upload response.
 */
export interface UploadResponse<T> {
  /**
   * Response upload.
   */
  response?: T;
  /**
   * Upload progress.
   */
  progress?: number;
  /**
   * Status upload.
   */
  status: 'progress' | 'complete';
}

@Injectable({
  providedIn: 'root'
})
export class UploaderToBase64Service {

  /**
   * Convert file to base64.The stream emits a progress and then a result.
   * @param file that is converted to base64.
   */
  public uploadFile(file: File): Observable<UploadResponse<any>> {
    return of(file).pipe(
      readFileAsDataUrlWithProgress(),
    );
  }
}

function createObservableForFileReader(blob: Blob): Observable<string> {
  return new Observable(
    (observer: Observer<string>) => {
      const reader = new FileReader();

      reader.onerror = err => observer.error(err);
      reader.onabort = err => observer.error(err);
      reader.onload = () => observer.next(reader.result as string);
      reader.onloadend = () => observer.complete();
      reader.readAsDataURL(blob);

      return () => reader.abort();
    },
  );
}

/**
 * Convert file to base 64.
 */
export function readFileAsDataUrl(): OperatorFunction<Blob, string> {

  return mergeMap(
    (blob: Blob) => createObservableForFileReader(blob),
  );
}

/**
 * Convert file to base 64 with progress[0-1].
 * Progress is emitted until the end of the reading.Upon completion, it emits a response.
 * @example
 * of(file).pipe(
 *      readFileAsDataUrlWithProgress(),
 *      tap(({ response, progress, status }) => {
 *      if (status === 'progress' && progress) {
 *      this.progress$.next(progress);
 *      }
 *      }),
 *      filter(({ response }) => !!response),
 *     );
 */
export function readFileAsDataUrlWithProgress(): OperatorFunction<Blob, UploadResponse<string>> {
  return mergeMap(
    (blob: Blob) => new Observable(
      (observer: Observer<UploadResponse<string>>) => {
        const reader = new FileReader();
        reader.onerror = err => observer.error(err);
        reader.onprogress = data => {
          if (data.lengthComputable) {
            const progress = (data.loaded / data.total);
            observer.next({ status: 'progress' as const, progress });
          }
        };
        reader.onabort = err => observer.error(err);
        reader.onload = () => observer.next({
          status: 'complete',
          response: reader.result as string,
        });
        reader.onloadend = () => observer.complete();
        reader.readAsDataURL(blob);

        return () => reader.abort();
      },
    ),
  );
}

