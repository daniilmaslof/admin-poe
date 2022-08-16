import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FileModel } from '../../../core/models/file-model';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * Max size of uploaded file in bytes.
 */
export const MAX_FILE_SIZE = 5000000;

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadDialogComponent {

  /**
   * Files that have already been uploaded to the server or converted to base64.
   * And files that have not yet been converted to base64 or uploaded to the server.
   */
  public attachFile$ = new BehaviorSubject<FileModel>(null);

  /**
   * Is all files uploaded.
   */
  public isFileUploaded$ = this.attachFile$.pipe(
    filter(file => file?.isUploaded),
  );

  /**
   * Stream with error.
   */
  public errorStream$ = new BehaviorSubject<string>('');

  constructor(
    public readonly dialogRef: MatDialogRef<any>
  ) {
  }

  /**
   * Close dialog.
   */
  public close(): void {
    this.dialogRef.close();
  }

  /**
   * Upload files.
   */
  public uploadFiles(file: File): void {
    const invalidFile = file.size > MAX_FILE_SIZE;
    if (invalidFile) {
      this.errorStream$.next(`Check the picture size. The largest single-file support to 5 MB`);
    } else {
      this.attachFile$.next(new FileModel({
        name: file.name,
        type: file.type,
        file,
      }));
    }
  }

  /**
   * Add file to uploaded files.Remove downloaded file.
   */
  public addUploadedFile(file: FileModel): void {
    this.errorStream$.next('');
    this.dialogRef.close(file);
  }

  /**
   * Remove file.
   */
  public removeFile(): void {
    this.attachFile$.next(null);
  }

  /**
   * Close dialog with current files.
   */
  public saveFiles(): void {
    this.dialogRef.close(this.attachFile$.value);
  }

  /**
   * Track by File.
   */
  public trackByFile(index: number, file: File): string {
    return file.name;
  }

}
