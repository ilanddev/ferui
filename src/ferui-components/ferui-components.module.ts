import { NgModule } from '@angular/core';
import { FuiInputModule } from './forms/input/input.module';
import { ClrIconModule } from './icon/icon.module';
import { FuiTextareaModule } from './forms/textarea/textarea.module';
import { FuiCheckboxModule } from './forms/checkbox/checkbox.module';

@NgModule({
  exports: [ClrIconModule, FuiInputModule, FuiTextareaModule, FuiCheckboxModule],
})
export class FeruiModule {}
