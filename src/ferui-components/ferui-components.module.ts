import { NgModule } from '@angular/core';
import { ClrIconModule } from './icon/icon.module';
import { FuiFormsModule } from './forms/forms.module';

@NgModule({
  exports: [ClrIconModule, FuiFormsModule],
})
export class FeruiModule {}
