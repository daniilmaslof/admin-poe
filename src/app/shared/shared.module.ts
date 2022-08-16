import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { HeaderComponent } from './components/header/header.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MapComponent } from './components/map/map.component';
import { MapContainerComponent } from './components/map-container/map-container.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { UploadDialogComponent } from './components/upload-dialog/upload-dialog.component';
import { FileComponent } from './components/file/file.component';
import { UploaderComponent } from './components/uploader/uploader.component';
import { FormatFileSizePipe } from './pipes/format-file-size.pipe';
import { ProgressDirective } from './progress.directive';
import { HighlightableItemDirective } from './directives/highlightable-item.directive';
import { A11yModule } from '@angular/cdk/a11y';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CdkTableModule } from '@angular/cdk/table';
import { CropperComponent } from './components/cropper/cropper.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { ValidationMessagesComponent } from './components/validation-messages/validation-messages.component';
import { SelectedDirective } from './directives/selected.directive';
import { LocationStatusDirective } from './directives/location-status.directive';
import { GroundFloorComponent } from './components/ground-floor/ground-floor.component';
import { FirstFloorComponent } from './components/first-floor/first-floor.component';
import { ThirdFloorComponent } from './components/third-floor/third-floor.component';
import { FifthFloorComponent } from './components/fifth-floor/fifth-floor.component';
import { SixthFloorComponent } from './components/sixth-floor/sixth-floor.component';

import { FourthFloorComponent } from './components/fourth-floor/fourth-floor.component';
import { SecondFloorComponent } from './components/second-floor/second-floor.component';
import { SevenFloorComponent } from './components/seven-floor/seven-floor.component';
import { SelectWithSearchComponent } from './components/select-with-search/select-with-search.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AssetsComponent } from './pipes/assets/assets.component';
import { AssetsPipe } from './pipes/assets.pipe';
import { AreaDirective } from './directives/area.directive';

const declarations = [
  HeaderComponent,
  UploadDialogComponent,
  MainLayoutComponent,
  SelectWithSearchComponent,
  MapComponent,
  PaginatorComponent,
  HighlightableItemDirective,
  FileComponent,
  ProgressDirective,
  UploaderComponent,
  CropperComponent,
  SelectedDirective,
  SecondFloorComponent,
  FourthFloorComponent,
  SevenFloorComponent,
  LocationStatusDirective,
  GroundFloorComponent,
  FirstFloorComponent,
  ThirdFloorComponent,
  FifthFloorComponent,
  SixthFloorComponent,
  FormatFileSizePipe,
  ConfirmDialogComponent,
  ValidationMessagesComponent,
  MapContainerComponent,
  AssetsPipe,
];
const materialModules = [
  MatTableModule,
  NgxMatSelectSearchModule,
  CdkTableModule,
  MatMenuModule,
  MatSortModule,
  MatSelectModule,
  FormsModule,
  ReactiveFormsModule,
  MatDividerModule,
  MatTabsModule,
  MatRadioModule,
  MatCheckboxModule,
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatSlideToggleModule,
  A11yModule,
  MatFormFieldModule,
  MatProgressBarModule,
  MatDialogModule,
];

/**
 * Shared module.
 */
@NgModule({
  declarations: [
   ...declarations,
   AssetsComponent,
   AreaDirective,
  ],
  imports: [
    CommonModule,
    ...materialModules,
    ReactiveFormsModule,
    FormsModule,
    ImageCropperModule,
    RouterModule,
  ],
  exports: [
    ...materialModules,
    ...declarations,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ]
})
export class SharedModule {
}
