import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Location } from '../../../core/models/location';
export interface ConfirmDialogData {
  subtitle: string;
  title: string;
  buttonColor?: 'warn';
  buttonText?: string;
}
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: ConfirmDialogData,
    public readonly dialogRef: MatDialogRef<any>,
  ) { }

  ngOnInit(): void {
  }

}
