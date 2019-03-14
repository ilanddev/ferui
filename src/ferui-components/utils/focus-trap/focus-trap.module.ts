import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FOCUS_TRAP_DIRECTIVES } from './index';

@NgModule({
  imports: [CommonModule],
  declarations: [FOCUS_TRAP_DIRECTIVES],
  exports: [FOCUS_TRAP_DIRECTIVES],
})
export class FuiFocusTrapModule {}
