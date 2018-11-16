import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './landing.component';

export const APP_ROUTES: Routes = [
  { path: '', component: LandingComponent },
  { path: 'icons', loadChildren: 'src/app/icons/icons.demo.module#IconsDemoModule' }
];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);
