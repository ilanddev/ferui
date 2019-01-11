import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuiCommonFormsModule } from './common/common.module';
import { FuiInputModule } from './input/input.module';
import { FuiTextareaModule } from './textarea/textarea.module';
import { FuiCheckboxModule } from './checkbox/checkbox.module';
import { FuiSelectModule } from './select/select.module';
import { FuiRadioModule } from './radio/radio.module';
import { FuiPasswordModule } from './password/password.module';

@NgModule({
  imports: [CommonModule],
  exports: [
    FuiCommonFormsModule,
    FuiInputModule,
    FuiTextareaModule,
    FuiCheckboxModule,
    FuiRadioModule,
    FuiSelectModule,
    FuiPasswordModule,
  ],
})
export class FuiFormsModule {}
