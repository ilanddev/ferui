import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuiCommonFormsModule } from './common/common.module';
import { FuiInputModule } from './input/input.module';
import { FuiTextareaModule } from './textarea/textarea.module';
import { FuiCheckboxModule } from './checkbox/checkbox.module';

@NgModule({
  imports: [CommonModule],
  exports: [FuiCommonFormsModule, FuiInputModule, FuiTextareaModule, FuiCheckboxModule],
})
export class FuiFormsModule {}
