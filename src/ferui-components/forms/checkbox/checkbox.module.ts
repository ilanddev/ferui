import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClrIconModule } from '../../icon/icon.module';

import { FuiCommonFormsModule } from '../common/common.module';
import { FuiHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';
import { FuiCheckbox } from './checkbox';
import { FuiCheckboxContainer } from './checkbox-container';
import { FuiCheckboxWrapper } from './checkbox-wrapper';
import { CheckboxReference } from './checkbox-reference';

@NgModule({
  imports: [CommonModule, ClrIconModule, FuiCommonFormsModule, FuiHostWrappingModule],
  declarations: [FuiCheckbox, FuiCheckboxContainer, FuiCheckboxWrapper, CheckboxReference],
  exports: [FuiCheckbox, FuiCheckboxContainer, FuiCheckboxWrapper],
  entryComponents: [FuiCheckboxWrapper],
})
export class FuiCheckboxModule {}
