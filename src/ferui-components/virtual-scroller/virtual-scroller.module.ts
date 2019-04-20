import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VIRTUAL_SCROLLER_DEFAULT_OPTIONS_FACTORY } from './virtual-scroller-factory';
import { FuiVirtualScrollerComponent } from './virtual-scroller';

@NgModule({
  exports: [FuiVirtualScrollerComponent],
  declarations: [FuiVirtualScrollerComponent],
  imports: [CommonModule],
  providers: [
    {
      provide: 'virtual-scroller-default-options',
      useFactory: VIRTUAL_SCROLLER_DEFAULT_OPTIONS_FACTORY,
    },
  ],
})
export class FuiVirtualScrollerModule {}
