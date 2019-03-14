import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClrIconModule } from '../../icon/icon.module';
import { FuiCommonFormsModule } from '../common/common.module';

import { FuiPassword } from './password';
import { FuiPasswordContainer } from './password-container';

@NgModule({
  imports: [CommonModule, FormsModule, ClrIconModule, FuiCommonFormsModule],
  declarations: [FuiPassword, FuiPasswordContainer],
  exports: [FuiPassword, FuiPasswordContainer],
  entryComponents: [FuiPasswordContainer],
})
export class FuiPasswordModule {}
