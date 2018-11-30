import { FuiForm } from './form';
import { CommonModule } from '@angular/common';
import { FuiControlError } from './error';
import { FuiIfError } from './if-error/if-error';
import { FuiLabel } from './label';
import { NgModule } from '@angular/core';
import { FuiHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';

@NgModule({
  imports: [CommonModule, FuiHostWrappingModule],
  declarations: [FuiLabel, FuiControlError, FuiIfError, FuiForm],
  exports: [FuiLabel, FuiControlError, FuiIfError, FuiForm],
})
export class FuiCommonFormsModule {}
