import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'locations',
        loadChildren: () => import('./location/location.module').then(m => m.LocationModule),
      },
      {
        path: 'floors',
        loadChildren: () => import('./floor/floor.module').then(m => m.FloorModule),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'locations',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
