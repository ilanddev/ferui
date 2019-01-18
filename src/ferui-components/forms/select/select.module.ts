import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FuiCommonFormsModule } from '../common/common.module';

import { ClrIconModule } from '../../icon/icon.module';
import { FuiSelect } from './select';
import { FuiSelectContainer } from './select-container';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectReference } from './select-reference';

@NgModule({
  imports: [CommonModule, FormsModule, NgSelectModule, ClrIconModule, FuiCommonFormsModule],
  declarations: [FuiSelect, FuiSelectContainer, SelectReference],
  exports: [FuiSelect, FuiSelectContainer, NgSelectModule, SelectReference],
  entryComponents: [FuiSelectContainer],
})
export class FuiSelectModule {}
