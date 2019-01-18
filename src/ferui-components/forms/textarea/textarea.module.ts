import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FuiCommonFormsModule } from '../common/common.module';
import { FuiTextarea } from './textarea';
import { FuiTextareaContainer } from './textarea-container';
import { ClrIconModule } from '../../icon/icon.module';
import { TextareaReference } from './textarea-reference';

@NgModule({
  imports: [CommonModule, FormsModule, ClrIconModule, FuiCommonFormsModule],
  declarations: [FuiTextarea, FuiTextareaContainer, TextareaReference],
  exports: [FuiTextarea, FuiTextareaContainer, TextareaReference],
  entryComponents: [FuiTextareaContainer],
})
export class FuiTextareaModule {}
