import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { Area } from '../../../core/models/area';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { filter, takeUntil } from 'rxjs/operators';
import { DestroyableBase } from '../../../core/helpers/destroyble';

@Component({
  selector: 'app-area-table',
  templateUrl: './area-table.component.html',
  styleUrls: ['./area-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaTableComponent extends DestroyableBase implements OnInit {

  public displayedColumns = ['name', 'visibility'];
  @Input()
  public data: Area[];

  @Output()
  public changeVisibility = new EventEmitter<Area>();

  constructor(
    private matDialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {
  }

  public openVisibilityDialog(area: Area): void {
    if (area.visible) {
      this.matDialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Turn off the area visibility?',
          subtitle: 'The area is no more visiblein the application.\n' +
            'All POI will also be disabled',
          buttonText: 'Turn off',
          buttonColor: 'primary'
        }
      }).afterClosed().pipe(
        filter(data => !!data),
        takeUntil(this.destroy$),
      ).subscribe(
        () => {
          area.visible = !area.visible;
          this.changeVisibility.emit(area);
        },
      );
    } else {
      area.visible = !area.visible;
      this.changeVisibility.emit(area);
    }
  }

}
