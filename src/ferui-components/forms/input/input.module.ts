import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FuiCommonFormsModule } from '../common/common.module';

import { FuiInput } from './input';
import { FuiInputContainer } from './input-container';
import { ClrIconModule } from '../../icon/icon.module';
import { InputReference } from './input-reference';

@NgModule({
  imports: [CommonModule, FormsModule, ClrIconModule, FuiCommonFormsModule],
  declarations: [FuiInput, FuiInputContainer, InputReference],
  exports: [FuiCommonFormsModule, FuiInput, FuiInputContainer, InputReference],
  entryComponents: [FuiInputContainer],
})
export class FuiInputModule {}
