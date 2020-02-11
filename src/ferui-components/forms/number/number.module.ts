import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FuiCommonFormsModule } from '../common/common.module';
import { FuiNumber } from './number';
import { FuiNumberContainer } from './number-container';
import { ClrIconModule } from '../../icon/icon.module';

@NgModule({
  imports: [CommonModule, FormsModule, ClrIconModule, FuiCommonFormsModule],
  declarations: [FuiNumber, FuiNumberContainer],
  exports: [FuiNumber, FuiNumberContainer],
  entryComponents: [FuiNumberContainer]
})
export class FuiNumberModule {}
