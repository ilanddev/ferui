import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FuiCommonFormsModule } from '../common/common.module';

import { ClrIconModule } from '../../icon/icon.module';
import { FuiTime } from './time';
import { FuiTimeContainer } from './time-container';
import { FuiSelectModule } from '../select/select.module';

export const FUI_TIME_DIRECTIVES: Type<any>[] = [FuiTime, FuiTimeContainer];

@NgModule({
  imports: [CommonModule, FormsModule, ClrIconModule, FuiCommonFormsModule, FuiSelectModule],
  declarations: [FUI_TIME_DIRECTIVES],
  exports: [FUI_TIME_DIRECTIVES],
  entryComponents: [FuiTimeContainer],
})
export class FuiTimeModule {}
