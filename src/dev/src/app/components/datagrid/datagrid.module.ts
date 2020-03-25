import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HighlightModule } from 'ngx-highlightjs';
import { FeruiModule, DateIOService, LocaleHelperService } from '@ferui/components';
import { DatagridDemo } from './datagrid.demo';
import { DatagridClientSideComponent } from './pages/datagrid-client-side.component';
import { DatagridServerSideComponent } from './pages/datagrid-server-side.component';
import { CustomBrowserFilter } from './custom-browser-filter';
import { RouterModule } from '@angular/router';
import { RowDataApiService } from './server-side-api/datagrid-row.service';

import { SafeHTML } from './safe-html.pipe';
import { DatagridInfiniteServerSideComponent } from './pages/datagrid-infinite-server-side.component';
import { DefaultDatagridOptionsMenu } from './default-datagrid-options-menu';
import { DatagridHome } from './pages/datagrid-home';
import { DatagridTreeviewInfiniteServerSideComponent } from './pages/datagrid-treeview.component';

const FUI_DEMO_COMPONENTS_DIRECTIVES: Type<any>[] = [
  SafeHTML,
  DatagridDemo,
  DatagridClientSideComponent,
  DatagridServerSideComponent,
  DatagridInfiniteServerSideComponent,
  DatagridTreeviewInfiniteServerSideComponent,
  DefaultDatagridOptionsMenu,
  CustomBrowserFilter,
  DatagridHome
];

@NgModule({
  imports: [CommonModule, FormsModule, FeruiModule, RouterModule, HighlightModule],
  declarations: [FUI_DEMO_COMPONENTS_DIRECTIVES],
  exports: [FUI_DEMO_COMPONENTS_DIRECTIVES],
  providers: [LocaleHelperService, DateIOService, RowDataApiService]
})
export class DatagridDemoModule {}
