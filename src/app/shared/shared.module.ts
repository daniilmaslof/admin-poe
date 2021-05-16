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

const declarations = [
  HeaderComponent,
  MainLayoutComponent,
  MapComponent,
  PaginatorComponent,
  MapContainerComponent,
];
const materialModules = [
  MatTableModule,
  MatSortModule,
  MatSelectModule,
  MatDividerModule,
  MatTabsModule,
  MatRadioModule,
  MatCheckboxModule,
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatSlideToggleModule,
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
  ],
  imports: [
    CommonModule,
    ...materialModules,
    ReactiveFormsModule,
    FormsModule,
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
