import { NgModule } from '@angular/core';
import { ClrIconModule } from './icon/icon.module';
import { FuiFormsModule } from './forms/forms.module';
import { FuiDatagridModule } from './datagrid/datagrid.module';
import { FuiUnselectableModule } from './unselectable/unselectable.module';
import { FuiVirtualScrollerModule } from './virtual-scroller/virtual-scroller.module';

@NgModule({
  exports: [ClrIconModule, FuiFormsModule, FuiDatagridModule, FuiUnselectableModule, FuiVirtualScrollerModule],
})
export class FeruiModule {}
