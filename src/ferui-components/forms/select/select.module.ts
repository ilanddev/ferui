import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FuiCommonFormsModule } from '../common/common.module';

import { ClrIconModule } from '../../icon/icon.module';
import { FuiSelect } from './select';
import { FuiSelectContainer } from './select-container';
import { FuiSelectIcon } from './select-icon';
import { NgSelectModule } from './ng-select/ng-select.module';

@NgModule({
  imports: [CommonModule, FormsModule, NgSelectModule, ClrIconModule, FuiCommonFormsModule],
  declarations: [FuiSelect, FuiSelectContainer, FuiSelectIcon],
  exports: [NgSelectModule, FuiSelect, FuiSelectContainer, FuiSelectIcon],
  entryComponents: [FuiSelectContainer],
})
export class FuiSelectModule {}
