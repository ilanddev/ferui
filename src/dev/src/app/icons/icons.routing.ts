import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { IconsLandingComponent } from './icons-landing.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { IconsComponent } from './icons-list/icons.component';

const ROUTES: Routes = [
  {
    path: '',
    component: IconsLandingComponent,
    children: [
      { path: '', redirectTo: 'get-started', pathMatch: 'full' },
      { path: 'get-started', component: GetStartedComponent },
      { path: 'icons-list', component: IconsComponent }
    ]
  }
];
export const ROUTING: ModuleWithProviders = RouterModule.forChild(ROUTES);
