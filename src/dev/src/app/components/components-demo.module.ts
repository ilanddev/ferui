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

export const FUI_DEMO_COMPONENTS_DIRECTIVES: Type<any>[] = [ComponentsDashboardComponent, ComponentsLandingComponent];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsRoutingModule,
    FormsDemoModule,
    FeruiModule,
    DatagridDemoModule,
    HighlightModule,
  ],
  declarations: [FUI_DEMO_COMPONENTS_DIRECTIVES],
  exports: [FUI_DEMO_COMPONENTS_DIRECTIVES],
})
export class ComponentsDemoModule {}
