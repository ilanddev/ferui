import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuiTabs } from './tabs';
import { FuiTab } from './tab';

@NgModule({
  imports: [CommonModule],
  declarations: [FuiTabs, FuiTab],
  exports: [FuiTabs, FuiTab]
})
export class FuiTabsModule {}
