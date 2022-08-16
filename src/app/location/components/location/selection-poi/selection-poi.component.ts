import { Component, OnInit, ChangeDetectionStrategy, Inject, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Location } from '../../../../core/models/location';
import { LocationService } from '../../../../core/services/location.service';
import { BehaviorSubject } from 'rxjs';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { HighlightableItemDirective } from '../../../../shared/directives/highlightable-item.directive';
import { SelectionModel } from '@angular/cdk/collections';
import { first, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selection-poi',
  templateUrl: './selection-poi.component.html',
  styleUrls: ['./selection-poi.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectionPoiComponent implements OnInit, AfterViewInit {
  public displayedColumns = ['name', 'archNumber'];
  public isLoading$ = new BehaviorSubject<boolean>(false);
  /**
   * Active key manager.
   */
  private activeKeyManager: ActiveDescendantKeyManager<HighlightableItemDirective<Location>>;

  /** Selection model. */
  public selectionModel = new SelectionModel<Location>(false, undefined);
  /**
   * Highlighted rows.Required for ActiveDescendantKeyManager.
   */
  @ViewChildren(HighlightableItemDirective)
  public optionRows: QueryList<HighlightableItemDirective<Location>>;
  public locations$ = this.locationService.getPois().pipe(
    tap(() => this.isLoading$.next(false)),
  );
  name = '';
  archId = '';

  constructor(
    private locationService: LocationService,
    public readonly dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public readonly data: Location[],
  ) {
    this.isLoading$.next(true);
  }

  /**
   * @inheritDoc
   */
  public ngAfterViewInit(): void {
    this.activeKeyManager = new ActiveDescendantKeyManager(this.optionRows).withWrap();
  }

  /**
   * Make an option selected when opening the menu
   */
  public selectorOpen(): void {
    this.highlightOption();
  }

  /**
   * Highlights the selected item. If no option is selected.
   */
  private highlightOption(): void {
    if (this.activeKeyManager && !this.selectionModel.isEmpty()) {
      const selectableIndex = this.optionRows.toArray().findIndex(directive => this.selectionModel.selected[0] === directive.item);
      this.activeKeyManager.setActiveItem(selectableIndex);
    }
  }

  /**
   * Selected NV or PN.
   */
  public selectOption(value: Location, index: number): void {
    this.selectionModel.select(value);
    this.activeKeyManager.setActiveItem(index);
  }

  ngOnInit(): void {
    this.archId = this.data[0].archId;
    this.name = this.data[0].name;
  }

  save() {
    this.isLoading$.next(true);
    this.locationService.addLocationToPoi(this.selectionModel.selected[0].archId, this.data.map(loc => loc.archId)).pipe(
      first(),
    ).subscribe(
      () => this.dialogRef.close(true)
    );
  }

}
