import { NgModule } from '@angular/core';
import { ClrIconModule } from './icon/icon.module';
import { FuiFormsModule } from './forms/forms.module';
import { FuiDatagridModule } from './datagrid/datagrid.module';
import { FuiUnselectableModule } from './unselectable/unselectable.module';
import { FuiVirtualScrollerModule } from './virtual-scroller/virtual-scroller.module';
import { FuiTabsModule } from './tabs/tabs.module';
import { FuiDropdownModule } from './dropdown/dropdown.module';

@NgModule({
  exports: [
    ClrIconModule,
    FuiTabsModule,
    FuiFormsModule,
    FuiDatagridModule,
    FuiUnselectableModule,
    FuiVirtualScrollerModule,
    FuiDropdownModule,
  ],
})
export class FeruiModule {}
