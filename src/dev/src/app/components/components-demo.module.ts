import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FeruiModule } from '@ferui/components';
import { HighlightModule } from 'ngx-highlightjs';

import { ComponentsLandingComponent } from './components-landing.component';
import { DatagridDemoModule } from './datagrid/datagrid.module';
import { ComponentsDashboardComponent } from './default/default.component';
import { ComponentsRoutingModule } from './components-demo.routing';
import { FormsDemoModule } from './forms/forms-demo.module';
import { DropdownDemoModule } from './dropdown/dropdown.module';
import { UtilsModule } from '../utils/utils.module';
import { TreeViewDemoModule } from './tree-view/tree-view.module';
import { WidgetDemoModule } from './widget/widget.module';
import { TabsDemoModule } from './tabs/tabs.module';
import { VirtualScrollerModule } from './virtual-scroller/virtual-scroller.module';

export const FUI_DEMO_COMPONENTS_DIRECTIVES: Type<any>[] = [ComponentsDashboardComponent, ComponentsLandingComponent];

@NgModule({
  imports: [
    UtilsModule,
    CommonModule,
    FormsModule,
    ComponentsRoutingModule,
    FormsDemoModule,
    FeruiModule,
    DatagridDemoModule,
    DropdownDemoModule,
    HighlightModule,
    TreeViewDemoModule,
    WidgetDemoModule,
    TabsDemoModule,
    VirtualScrollerModule
  ],
  declarations: [FUI_DEMO_COMPONENTS_DIRECTIVES],
  exports: [FUI_DEMO_COMPONENTS_DIRECTIVES]
})
export class ComponentsDemoModule {}
