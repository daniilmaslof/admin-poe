import { Component, EventEmitter, OnInit, ChangeDetectionStrategy, Input, Output } from '@angular/core';
import { filter, first, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { DestroyableBase } from '../../../core/helpers/destroyble';
import { FileModel } from '../../../core/models/file-model';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { UploaderToBase64Service } from '../../../core/services/uploader-to-base64.service';
const ONE_PERCENT = 0.01;
@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileComponent extends DestroyableBase {

  /**
   * File to upload.
   */
  @Input()
  public set file(file: FileModel) {
    this.fileModel$.next(file);
  }

  /**
   * File model stream.
   */
  public fileModel$ = new ReplaySubject<FileModel>(1);

  /**
   * File stream.
   */
  public file$ = this.fileModel$.pipe(
    map(file => file.file),
  );

  /**
   * Progress stream.
   */
  public progress$ = new BehaviorSubject<number>(0);

  /**
   * Emit file model after the download is complete.
   */
  @Output()
  public uploadCompleted = new EventEmitter<FileModel>();
  /**
   * Emit values when the delete button was clicked.
   */
  @Output()
  public removeFile = new EventEmitter<void>();

  constructor(
    private uploaderService: UploaderToBase64Service,
  ) {
    super();
    this.uploadFile();
  }

  private uploadFile(): void {
    this.fileModel$.pipe(
      filter(model => !model.isUploaded && !!model.file),
      map(model => model.file),
      first(),
      tap(() => this.startProgress()),
      switchMap((file: File) => this.uploaderService.uploadFile(file)),
      tap(({ response, progress, status }) => {

        if (status === 'progress' && progress) {
          this.progress$.next(progress);
        }
        if (status === 'complete') {
          this.stopProgress();
        }
      }),
      filter(({ response }) => !!response),
      withLatestFrom(this.fileModel$),
      takeUntil(this.destroy$),
    ).subscribe(([response, file]) => this.uploadCompleted.emit(new FileModel({...file, url: response.response})));
  }

  private startProgress(): void {
    this.progress$.next(ONE_PERCENT);
  }
  private stopProgress(): void {
    this.progress$.next(0);
  }

}
