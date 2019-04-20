import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeruiModule } from '@ferui/components';
import { HighlightModule } from 'ngx-highlightjs';
import { ComponentsLandingComponent } from './components-landing.component';
import { DefaultComponent } from './default/default.component';
import { ROUTING } from './components-demo.routing';
import { DatagridDemoModule } from './datagrid/datagrid.module';

export const FUI_DEMO_COMPONENTS_DIRECTIVES: Type<any>[] = [DefaultComponent, ComponentsLandingComponent];

@NgModule({
  imports: [CommonModule, FormsModule, FeruiModule, ROUTING, DatagridDemoModule, HighlightModule],
  declarations: [FUI_DEMO_COMPONENTS_DIRECTIVES],
  exports: [FUI_DEMO_COMPONENTS_DIRECTIVES],
})
export class ComponentsDemoModule {}
