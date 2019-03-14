import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FuiCommonFormsModule } from '../common/common.module';

import { ClrIconModule } from '../../icon/icon.module';
import { FuiSelect } from './select';
import { FuiSelectContainer } from './select-container';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [CommonModule, FormsModule, NgSelectModule, ClrIconModule, FuiCommonFormsModule],
  declarations: [FuiSelect, FuiSelectContainer],
  exports: [FuiSelect, FuiSelectContainer, NgSelectModule],
  entryComponents: [FuiSelectContainer],
})
export class FuiSelectModule {}
