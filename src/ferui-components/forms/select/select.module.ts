import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FuiCommonFormsModule } from '../common/common.module';

import { ClrIconModule } from '../../icon/icon.module';
import { FuiSelect } from './select';
import { FuiSelectContainer } from './select-container';
import { NgSelectModule } from '@ng-select/ng-select';
import { FuiSelectIcon } from './select-icon';

@NgModule({
  imports: [CommonModule, FormsModule, NgSelectModule, ClrIconModule, FuiCommonFormsModule],
  declarations: [FuiSelect, FuiSelectContainer, FuiSelectIcon],
  exports: [FuiSelect, FuiSelectContainer, NgSelectModule, FuiSelectIcon],
  entryComponents: [FuiSelectContainer],
})
export class FuiSelectModule {}
