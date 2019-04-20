import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HighlightModule } from 'ngx-highlightjs';
import { FeruiModule } from '@ferui/components';
import { DatagridDemo } from './datagrid.demo';
import { DatagridComponent } from './datagrid.component';
import { DatagridServerSideComponent } from './datagrid-server-side.component';
import { CustomBrowserFilter } from './custom-browser-filter';
import { RouterModule } from '@angular/router';
import { RowDataApiService } from './server-side-api/datagrid-row.service';
import { DateIOService } from '../../../../../ferui-components/forms/date/providers/date-io.service';
import { LocaleHelperService } from '../../../../../ferui-components/forms/datepicker/providers/locale-helper.service';
import { SafeHTML } from './safe-html.pipe';
import { DatagridInfiniteServerSideComponent } from './datagrid-infinite-server-side.component';
import { DefaultDatagridOptionsMenu } from './default-datagrid-options-menu';

const FUI_DEMO_COMPONENTS_DIRECTIVES: Type<any>[] = [
  SafeHTML,
  DatagridDemo,
  DatagridComponent,
  DatagridServerSideComponent,
  DatagridInfiniteServerSideComponent,
  DefaultDatagridOptionsMenu,
  CustomBrowserFilter,
];

@NgModule({
  imports: [CommonModule, FormsModule, FeruiModule, RouterModule, HighlightModule],
  declarations: [FUI_DEMO_COMPONENTS_DIRECTIVES],
  exports: [FUI_DEMO_COMPONENTS_DIRECTIVES],
  providers: [LocaleHelperService, DateIOService, RowDataApiService],
})
export class DatagridDemoModule {}
