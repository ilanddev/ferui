import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputsComponent } from './inputs/inputs.component';
import { FeruiModule } from '@ferui/components';
import { FormsLandingComponent } from './forms-landing.component';
import { FormsModule } from '@angular/forms';
import { HighlightModule } from 'ngx-highlightjs';
import { TextareaComponent } from './textarea/textarea.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { SelectsComponent } from './select/selects.component';
import { RadiosComponent } from './radios/radios.component';
import { PasswordComponent } from './password/password.component';
import { DefaultTemplateWrapper } from './default-template-wrapper';
import { DefaultTemplateContent } from './default-template-content';
import { DatetimeComponent } from './datetime/datetime.component';
import { FormsDashboardComponent } from './dashboard/forms-dashboard.component';
import { RouterModule } from '@angular/router';
import { UtilsModule } from '../../utils/utils.module';

export const FUI_DEMO_FROMS_DIRECTIVES: Type<any>[] = [
  DefaultTemplateWrapper,
  DefaultTemplateContent,
  FormsDashboardComponent,
  InputsComponent,
  DatetimeComponent,
  TextareaComponent,
  CheckboxComponent,
  RadiosComponent,
  SelectsComponent,
  PasswordComponent,
  FormsLandingComponent,
  FormsDashboardComponent,
];

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule, UtilsModule, FeruiModule, HighlightModule],
  declarations: [FUI_DEMO_FROMS_DIRECTIVES],
  exports: [FUI_DEMO_FROMS_DIRECTIVES, RouterModule],
})
export class FormsDemoModule {}
