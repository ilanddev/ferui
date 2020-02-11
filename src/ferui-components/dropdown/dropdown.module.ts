import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FuiDropdown } from './dropdown';
import { FuiConditionalModule } from '../utils/conditional/conditional.module';
import { ClrIconModule } from '../icon/icon.module';
import { FuiDropdownMenu } from './dropdown-menu';
import { FuiDropdownTrigger } from './dropdown-trigger';
import { FuiDropdownItem } from './dropdown-item';

export const FUI_DROPDOWN_DIRECTIVES: Type<any>[] = [FuiDropdown, FuiDropdownMenu, FuiDropdownTrigger, FuiDropdownItem];

@NgModule({
  imports: [CommonModule],
  declarations: [FUI_DROPDOWN_DIRECTIVES],
  exports: [FUI_DROPDOWN_DIRECTIVES, FuiConditionalModule, ClrIconModule]
})
export class FuiDropdownModule {}
