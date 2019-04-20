import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './landing.component';

export const APP_ROUTES: Routes = [
  { path: '', component: LandingComponent },
  { path: 'icons', loadChildren: 'src/app/icons/icons.module#IconsModule' },
  { path: 'forms', loadChildren: 'src/app/forms/forms-demo.module#FormsDemoModule' },
  { path: 'components', loadChildren: 'src/app/components/components-demo.module#ComponentsDemoModule' },
];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES, { useHash: true });
