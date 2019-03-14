import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClrIconModule } from '../../icon/icon.module';
import { FuiCommonFormsModule } from '../common/common.module';
import { FuiHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';
import { FuiRadio } from './radio';
import { FuiRadioContainer } from './radio-container';
import { FuiRadioWrapper } from './radio-wrapper';

@NgModule({
  imports: [CommonModule, FuiCommonFormsModule, FuiHostWrappingModule, ClrIconModule],
  declarations: [FuiRadio, FuiRadioContainer, FuiRadioWrapper],
  exports: [FuiRadio, FuiRadioContainer, FuiRadioWrapper],
  entryComponents: [FuiRadioWrapper, FuiRadioContainer],
})
export class FuiRadioModule {}
