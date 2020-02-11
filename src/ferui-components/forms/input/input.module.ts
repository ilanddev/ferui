import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FuiCommonFormsModule } from '../common/common.module';

import { FuiInput } from './input';
import { FuiInputContainer } from './input-container';
import { ClrIconModule } from '../../icon/icon.module';

@NgModule({
  imports: [CommonModule, FormsModule, ClrIconModule, FuiCommonFormsModule],
  declarations: [FuiInput, FuiInputContainer],
  exports: [FuiInput, FuiInputContainer],
  entryComponents: [FuiInputContainer]
})
export class FuiInputModule {}
