import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Location } from '../../../core/models/location';
import { FileModel } from '../../../core/models/file-model';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CropperComponent implements OnInit {
  croppedImage: any = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: FileModel,
    public readonly dialogRef: MatDialogRef<any>,
  ) { }


  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  ngOnInit(): void {
  }

  public save() {
    this.dialogRef.close({
      ...this.data,
      url: this.croppedImage,
    })
  }

}
