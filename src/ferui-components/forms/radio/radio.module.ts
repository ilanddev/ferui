import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClrIconModule } from '../../icon/icon.module';
import { FuiCommonFormsModule } from '../common/common.module';
import { FuiHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';
import { FuiRadio } from './radio';
import { FuiRadioContainer } from './radio-container';
import { FuiRadioWrapper } from './radio-wrapper';
import { RadioReference } from './radio-reference';

@NgModule({
  imports: [CommonModule, FuiCommonFormsModule, FuiHostWrappingModule, ClrIconModule],
  declarations: [FuiRadio, FuiRadioContainer, FuiRadioWrapper, RadioReference],
  exports: [FuiCommonFormsModule, FuiRadio, FuiRadioContainer, FuiRadioWrapper],
  entryComponents: [FuiRadioWrapper],
})
export class FuiRadioModule {}
