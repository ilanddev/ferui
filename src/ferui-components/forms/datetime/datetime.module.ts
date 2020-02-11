import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FuiCommonFormsModule } from '../common/common.module';

import { ClrIconModule } from '../../icon/icon.module';
import { FuiDatetime } from './datetime';
import { FuiDatetimeContainer } from './datetime-container';
import { FuiDateModule } from '../date/date.module';
import { FuiTimeModule } from '../time/time.module';

export const FUI_DATETIME_DIRECTIVES: Type<any>[] = [FuiDatetime, FuiDatetimeContainer];

@NgModule({
  imports: [CommonModule, FormsModule, ClrIconModule, FuiCommonFormsModule, FuiDateModule, FuiTimeModule],
  declarations: [FUI_DATETIME_DIRECTIVES],
  exports: [FUI_DATETIME_DIRECTIVES],
  entryComponents: [FuiDatetimeContainer]
})
export class FuiDatetimeModule {}
