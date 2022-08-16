import { EventEmitter, Component, OnInit, ChangeDetectionStrategy, HostListener, HostBinding, Input, Output } from '@angular/core';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploaderComponent {

  /**
   * Counts up on all dragenter events and counts down on dragleave events.
   */
  private dragEnterCount = 0;

  /**
   * Shown if drag and drop is possible.
   */
  @HostBinding('class.on-drag')
  public onDrag: boolean;

  /**
   * Shown if drag and drop is not possible.
   */
  @HostBinding('class.on-wrong-drag')
  public onWrongDrag: boolean;

  /**
   * Is display default hint.
   */
  @Input()
  public isDisplayHint: boolean;

  /**
   * On files dropped.
   */
  @Output()
  public filesDropped = new EventEmitter<File>();

  /**
   * Drop files.
   */
  @HostListener('drop', ['$event'])
  public onDrop(event: DragEvent): void {
    stopEvent(event);
    if (this.hasFiles(event)) {
      const files = getFiles(event);
      this.uploadedFiles(files[0]);
    }
    this.dragEnterCount = 0;
    this.showWaitingDrag();
  }

  /**
   * Drag over.
   */
  @HostListener('dragover', ['$event'])
  public onDragOver(event: DragEvent): void {
    stopEvent(event);
  }

  /**
   * Drag enter.Shows whether you can make a drop.
   */
  @HostListener('dragenter', ['$event'])
  public onDragEnter(event: DragEvent): void {
    this.dragEnterCount++;
    stopEvent(event);
    if (this.hasFiles(event)) {
      this.showOnDrag();
    } else {
      this.showOnWrongDrag();
    }
  }

  /**
   * Shows drag waiting.
   */
  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: DragEvent): void {
    this.dragEnterCount--;
    if (this.dragEnterCount === 0) {
      this.showWaitingDrag();
    }
    stopEvent(event);
  }

  /**
   * Clear the value in multiple input so that even when the same image is selected, onchange is called.
   * @input Input from which onchange is called.
   */
  public clearValue(input: HTMLInputElement): void {
    input.value = '';
  }

  /**
   * Upload files.
   */
  public onUpload(files: FileList): void {
    this.uploadedFiles(files[0]);
  }

  private uploadedFiles(files: File): void {
    this.filesDropped.emit(files);
    this.isDisplayHint = false;
  }

  private hasFiles(event: DragEvent): boolean {
    const files = getFiles(event);
    const items = getDataTransferItems(event).filter(value => value.kind === 'file');
    return !![...Array.from(files), ...Array.from(items)].length;
  }

  private showOnDrag(): void {
    this.onDrag = true;
    this.onWrongDrag = false;
  }

  private showOnWrongDrag(): void {
    this.onDrag = false;
    this.onWrongDrag = true;
  }

  private showWaitingDrag(): void {
    this.onDrag = false;
    this.onWrongDrag = false;
  }
}

function getFiles(event: DragEvent): File[] {
  const files = event && event.dataTransfer && event.dataTransfer.files || [];
  return [...Array.from(files)];
}

function getDataTransferItems(event: DragEvent): DataTransferItem[] {
  const items = event && event.dataTransfer && event.dataTransfer.items || [];
  return [...Array.from(items)];
}

function stopEvent(event: DragEvent): void {
  event.preventDefault();
  event.stopPropagation();
}

