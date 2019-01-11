import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './default/default.component';
import { InputsComponent } from './inputs/inputs.component';
import { FormsLandingComponent } from './forms-landing.component';
import { TextareaComponent } from './textarea/textarea.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { SelectsComponent } from './select/selects.component';
import { RadiosComponent } from './radios/radios.component';
import { PasswordComponent } from './password/password.component';

const FORM_ROUTES: Routes = [
  {
    path: '',
    component: FormsLandingComponent,
    children: [
      { path: '', redirectTo: 'default', pathMatch: 'full' },
      { path: 'default', component: DefaultComponent },
      { path: 'inputs', component: InputsComponent },
      { path: 'passwords', component: PasswordComponent },
      { path: 'textareas', component: TextareaComponent },
      { path: 'checkboxes', component: CheckboxComponent },
      { path: 'radios', component: RadiosComponent },
      { path: 'selects', component: SelectsComponent },
    ],
  },
];

export const ROUTING: ModuleWithProviders = RouterModule.forChild(FORM_ROUTES);
