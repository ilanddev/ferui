import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './default/default.component';
import { InputsComponent } from './inputs/inputs.component';
import { FormsLandingComponent } from './forms-landing.component';

const ROUTES: Routes = [
  {
    path: '',
    component: FormsLandingComponent,
    children: [
      { path: '', redirectTo: 'default', pathMatch: 'full' },
      { path: 'default', component: DefaultComponent },
      { path: 'inputs', component: InputsComponent }
    ]
  }
];

export const ROUTING: ModuleWithProviders = RouterModule.forChild(ROUTES);
