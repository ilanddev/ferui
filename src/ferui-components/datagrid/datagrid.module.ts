import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuiDatagrid } from './components/datagrid';
import { FuiHeaderRoot } from './components/header/header-root';
import { FuiHeaderContainer } from './components/header/header-container';
import { FuiHeaderRow } from './components/header/header-row';
import { FuiHeaderCell } from './components/header/header-cell';
import { FuiBodyRoot } from './components/body/body-root';
import { FuiBodyContainer } from './components/body/body-container';
import { FuiBodyRow } from './components/body/body-row';
import { FuiBodyCell } from './components/body/body-cell';
import { FuiHeaderViewport } from './components/header/header-viewport';
import { ClrIconModule } from '../icon/icon.module';
import { FuiUnselectableModule } from '../unselectable/unselectable.module';
import { FuiVirtualScrollerModule } from '../virtual-scroller/virtual-scroller.module';
import { FuiDatagridFilters } from './components/filters/filters';
import { FuiDatagridPager } from './components/pager/pager';
import { FuiSelectModule } from '../forms/select/select.module';
import { FormsModule } from '@angular/forms';
import { FuiDatagridFilterColumnVisibility } from './components/filters/column-visibility';
import { FuiDatagridSearchFilterButton } from './components/filters/search-filters-button';
import { FuiDatagridFiltersPopover } from './components/filters/filters-popover';
import { FuiConditionalModule } from '../utils/conditional/conditional.module';
import { FuiDatagridTextFilter } from './components/filters/filter/text-filter';
import { FuiInputModule } from '../forms/input/input.module';
import { FuiCommonFormsModule } from '../forms/common/common.module';
import { FuiDatagridBooleanFilter } from './components/filters/filter/boolean-filter';
import { FuiRadioModule } from '../forms/radio/radio.module';
import { FuiCheckboxModule } from '../forms/checkbox/checkbox.module';
import { FuiDatagridNumberFilter } from './components/filters/filter/number-filter';
import { FuiDatagridGlobalSearchFilter } from './components/filters/filter/global-search-filter';
import { FuiDatagridDateFilter } from './components/filters/filter/date-filter';
import { FuiDateModule } from '../forms/date/date.module';
import { FuiBodyEmpty } from './components/body/body-empty';
import { FuiDatagridActionMenu } from './components/action-menu/action-menu';
import { FuiDropdownModule } from '../dropdown/dropdown.module';

export const FUI_DATAGRID_DIRECTIVES: Type<any>[] = [
  FuiDatagridActionMenu,
  FuiDatagridGlobalSearchFilter,
  FuiDatagridDateFilter,
  FuiDatagridTextFilter,
  FuiDatagridNumberFilter,
  FuiDatagridBooleanFilter,
  FuiDatagridSearchFilterButton,
  FuiDatagridFiltersPopover,
  FuiDatagridFilters,
  FuiDatagridFilterColumnVisibility,
  FuiDatagridPager,
  FuiHeaderRoot,
  FuiHeaderViewport,
  FuiHeaderContainer,
  FuiHeaderRow,
  FuiHeaderCell,
  FuiBodyRoot,
  FuiBodyContainer,
  FuiBodyRow,
  FuiBodyCell,
  FuiBodyEmpty,
  FuiDatagrid,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FuiCommonFormsModule,
    FuiInputModule,
    FuiCheckboxModule,
    FuiRadioModule,
    FuiDateModule,
    ClrIconModule,
    FuiVirtualScrollerModule,
    FuiUnselectableModule,
    FuiSelectModule,
    FuiConditionalModule,
    FuiDropdownModule,
  ],
  declarations: [FUI_DATAGRID_DIRECTIVES],
  exports: [FUI_DATAGRID_DIRECTIVES],
  entryComponents: [],
})
export class FuiDatagridModule {}
