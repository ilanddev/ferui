import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClrIconModule } from '../../icon/icon.module';
import { FuiCommonFormsModule } from '../common/common.module';

import { FuiPassword } from './password';
import { FuiPasswordContainer } from './password-container';
import { PasswordReference } from './password-reference';

@NgModule({
  imports: [CommonModule, FormsModule, ClrIconModule, FuiCommonFormsModule],
  declarations: [FuiPassword, FuiPasswordContainer, PasswordReference],
  exports: [FuiCommonFormsModule, FuiPassword, FuiPasswordContainer, PasswordReference],
  entryComponents: [FuiPasswordContainer],
})
export class FuiPasswordModule {}
