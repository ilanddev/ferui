import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './default/default.component';
import { InputsComponent } from './inputs/inputs.component';
import { FormsLandingComponent } from './forms-landing.component';
import { TextareaComponent } from './textarea/textarea.component';
import { CheckboxComponent } from './checkbox/checkbox.component';

const FORM_ROUTES: Routes = [
  {
    path: '',
    component: FormsLandingComponent,
    children: [
      { path: '', redirectTo: 'default', pathMatch: 'full' },
      { path: 'default', component: DefaultComponent },
      { path: 'inputs', component: InputsComponent },
      { path: 'textareas', component: TextareaComponent },
      { path: 'checkboxes', component: CheckboxComponent },
    ],
  },
];

export const ROUTING: ModuleWithProviders = RouterModule.forChild(FORM_ROUTES);
