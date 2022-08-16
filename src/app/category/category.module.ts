import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryTableWrapperComponent } from './components/category-table-wrapper/category-table-wrapper.component';
import { CategoryTableComponent } from './components/category-table/category-table.component';
import { SharedModule } from '../shared/shared.module';
import { CategoryDialogComponent } from './components/category-dialog/category-dialog.component';


@NgModule({
  declarations: [
    CategoryTableWrapperComponent,
    CategoryTableComponent,
    CategoryDialogComponent
  ],
  imports: [
    SharedModule,
    CategoryRoutingModule
  ]
})
export class CategoryModule { }
