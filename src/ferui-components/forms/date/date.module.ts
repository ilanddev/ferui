import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FuiHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';
import { FuiConditionalModule } from '../../utils/conditional/conditional.module';
import { ClrIconModule } from '../../icon/icon.module';
import { FuiFocusTrapModule } from '../../utils/focus-trap/focus-trap.module';
import { FuiCommonFormsModule } from '../common/common.module';
import { FuiDateContainer } from './date-container';
import { FuiDate } from './date';
import { FuiDatepickerModule } from '../datepicker/datepicker.module';

export const FUI_DATE_DIRECTIVES: Type<any>[] = [FuiDateContainer, FuiDate];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FuiHostWrappingModule,
    FuiConditionalModule,
    ClrIconModule,
    FuiFocusTrapModule,
    FuiCommonFormsModule,
    FuiDatepickerModule
  ],
  declarations: [FUI_DATE_DIRECTIVES],
  exports: [FUI_DATE_DIRECTIVES],
  entryComponents: [FuiDateContainer]
})
export class FuiDateModule {}
