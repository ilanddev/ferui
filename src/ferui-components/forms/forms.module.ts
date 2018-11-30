import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuiCommonFormsModule } from './common/common.module';

@NgModule({
  imports: [CommonModule],
  exports: [FuiCommonFormsModule, FuiFormsModule]
})
export class FuiFormsModule {
}
