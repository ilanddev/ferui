import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuiUnselectable } from './unselectable';

@NgModule({
  imports: [CommonModule],
  declarations: [FuiUnselectable],
  exports: [FuiUnselectable],
})
export class FuiUnselectableModule {}
