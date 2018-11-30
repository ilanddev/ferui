import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FuiCommonFormsModule } from '../common/common.module';

import { FuiInput } from './input';
import { FuiInputContainer } from './input-container';

@NgModule({
  imports: [CommonModule, FormsModule, FuiCommonFormsModule],
  declarations: [FuiInput, FuiInputContainer],
  exports: [FuiCommonFormsModule, FuiInput, FuiInputContainer],
  entryComponents: [FuiInputContainer],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FuiInputModule {
}
