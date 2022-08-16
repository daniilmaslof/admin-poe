import { Component, OnInit, ChangeDetectionStrategy, Inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Location } from '../../../../core/models/location';
import { LocationService } from '../../../../core/services/location.service';
import { DestroyableBase } from '../../../../core/helpers/destroyble';
import { filter, map, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { CategoryService } from '../../../../core/services/category.service';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { UploadDialogComponent } from '../../../../shared/components/upload-dialog/upload-dialog.component';
import { CropperComponent } from '../../../../shared/components/cropper/cropper.component';

@Component({
  selector: 'app-poi-dialog',
  templateUrl: './poi-dialog.component.html',
  styleUrls: ['./poi-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoiDialogComponent extends DestroyableBase implements OnInit {
  public displayedColumns = ['name', 'archNumber', 'remove'];
  public categories$ = this.categoryService.getCategories();
  private location: Location = null;
  public form = this.formBuilder.group({
    name: '',
    description: '',
    area: '',
    archId2: '',
    archId: '',
    poi: true,
    active: false,
    category: null,
    photo: null,
    selectedPoi: null,
    locations: []
  });
  public pois$ = this.locationService.getPois().pipe(
    map(data => data.filter(poi => poi.archId !== this.data.location.archId)),
    shareReplay({ refCount: true, bufferSize: 1 }),
  );
  public isLoading$ = new BehaviorSubject<boolean>(false);

  public compareCategory = (category1, category2) => category1 && category2 && category1.id === category2.id;

  constructor(
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public readonly data: {location: Location, poi: Location | null},
    public readonly dialogRef: MatDialogRef<any>,
  ) {
    super();
  }

  public openUploadPhotoDialog() {
    this.matDialog.open(UploadDialogComponent).afterClosed().pipe(
      filter(file => !!file),
      switchMap((file) => this.matDialog.open(CropperComponent, { data: file }).afterClosed()),
      takeUntil(this.destroy$),
    ).subscribe(
      fileModel => {
        this.cdr.markForCheck();
        this.form.patchValue({
          photo: fileModel.url,
        });
      }
    );
  }
  /**
   * Compare product with search term.
   */
  public compareLocationWithTerm(location: Location, term: string): boolean {
    return location.name.toLowerCase().includes(term.toLowerCase()) || location.archId.toLowerCase().includes(term.toLowerCase());
  }
  public compareWithPoi(poi1: Location, poi2: Location) {
    return poi1.archId === poi2.archId
  }
  ngOnInit(): void {
    this.isLoading$.next(true);
    combineLatest([this.locationService.getLocation(this.data.location.archId), this.categories$]).pipe(
      takeUntil(this.destroy$),
    ).subscribe(([location, categories]) => {
      this.isLoading$.next(false);
      this.location = location;
      console.log(this.data.poi)
      this.form.patchValue({
        name: location.name,
        description: location.description,
        category: categories.find(category => category.name === location.category),
        poi: location.poi,
        archId: location.archId,
        archId2: location.archId2,
        area: location.area,
        active: location.active,
        photo: location.photo ?? null,
        locations: this.data.location.locations,
        selectedPoi: this.data.poi ? this.data.poi : null
      });
    });
  }

  public save() {
    if (!this.isLoading$.value) {
      this.isLoading$.next(true);
      const location = this.form.value;
      let updateStream$ = this.locationService.updatePoi({
        archId: location.archId,
        name: location.name,
        archId2: location.archId2,
        description: location.description,
        photo: location.photo,
        area: location.area,
        floor: this.data.location.floor,
        categoryId: location.category?.id ?? null,
        locationIds: location.poi ? location.locations.map(loc => loc.archId) : [],
        active: location.active,
        poi: location.poi,
      })
      if (!this.location.poi || this.location.poi === location.poi) {
        if (location.selectedPoi) {
          updateStream$ = this.locationService.addLocationToPoi(location.selectedPoi.archId, [location.archId]).pipe(
            switchMap(() => this.locationService.updatePoi({
              archId: location.archId,
              name: location.name,
              description: location.description,
              archId2: location.archId2,
              photo: location.photo,
              area: location.area,
              floor: this.data.location.floor,
              categoryId: location.category?.id ?? null,
              locationIds: [],
              active: location.active,
              poi: false,
            }))
          );
        } else {
          if (location.selectedPoi) {
            updateStream$ = this.locationService.updatePoi({
              archId: location.archId,
              archId2: location.archId2,
              name: location.name,
              description: location.description,
              photo: location.photo,
              area: location.area,
              floor: this.data.location.floor,
              categoryId: location.category?.id ?? null,
              locationIds: location.poi ? location.locations.map(loc => loc.archId) : [],
              active: location.active,
              poi: location.poi,
            })
          }
        }
      } else {
        if (location.selectedPoi) {
          updateStream$ = this.locationService.deletePois([location.archId]).pipe(
            switchMap(() => this.locationService.addLocationToPoi(location.selectedPoi.archId, [location.archId])),
            switchMap(() => this.locationService.updatePoi({
              archId: location.archId,
              name: location.name,
              archId2: location.archId2,
              description: location.description,
              photo: location.photo,
              area: location.area,
              floor: this.data.location.floor,
              categoryId: location.category?.id ?? null,
              locationIds: [],
              active: location.active,
              poi: false,
            }))
          )
        } else {
          updateStream$ = this.locationService.deletePois([location.archId]).pipe(
            switchMap(() => this.locationService.updatePoi({
              archId: location.archId,
              name: location.name,
              archId2: location.archId2,
              description: location.description,
              photo: location.photo,
                area: location.area,
              floor: this.data.location.floor,
              categoryId: location.category?.id ?? null,
              locationIds: [],
              active: location.active,
              poi: false,
            }))
          )
        }
      }
      updateStream$.pipe().subscribe(() => this.dialogRef.close(true));
    }
  }

  public clearPoi() {
    this.cdr.markForCheck();
    this.form.get('selectedPoi').setValue(null);
    this.form.updateValueAndValidity();
  }
  public cancel() {
    this.dialogRef.close();
  }

  public removeLocation(row: Location) {
    this.form.patchValue({
      locations: this.form.value.locations.filter(loc => !(loc.archId === row.archId))
    });
  }
}
