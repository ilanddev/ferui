import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { ClrIconModule } from '../../icon/icon.module';
import { FuiFocusTrapModule } from '../../utils/focus-trap/focus-trap.module';
import { FuiDay } from './day';
import { FuiDatepickerViewManager } from './datepicker-view-manager';
import { FuiMonthpicker } from './monthpicker';
import { FuiYearpicker } from './yearpicker';
import { FuiDaypicker } from './daypicker';
import { FuiCalendar } from './calendar';
import { FuiHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';
import { FuiConditionalModule } from '../../utils/conditional/conditional.module';
import { FuiCommonFormsModule } from '../common/common.module';
import { FormsModule } from '@angular/forms';
import { FuiDateContainer } from '../date/date-container';

export const FUI_DATEPICKER_DIRECTIVES: Type<any>[] = [
  FuiDay,
  FuiDatepickerViewManager,
  FuiMonthpicker,
  FuiYearpicker,
  FuiDaypicker,
  FuiCalendar
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FuiHostWrappingModule,
    FuiConditionalModule,
    ClrIconModule,
    FuiFocusTrapModule,
    FuiCommonFormsModule
  ],
  declarations: [FUI_DATEPICKER_DIRECTIVES],
  exports: [FUI_DATEPICKER_DIRECTIVES],
  entryComponents: [FuiDateContainer]
})
export class FuiDatepickerModule {}
