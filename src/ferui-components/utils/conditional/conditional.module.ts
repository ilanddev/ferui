import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CONDITIONAL_DIRECTIVES } from './index';

@NgModule({ imports: [CommonModule], declarations: [CONDITIONAL_DIRECTIVES], exports: [CONDITIONAL_DIRECTIVES] })
export class FuiConditionalModule {}
