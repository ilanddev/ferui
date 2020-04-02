import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreeViewClientSideDemo } from './tree-view-client-side-demo';
import { FeruiModule } from '@ferui/components';
import { HighlightModule } from 'ngx-highlightjs';
import { TreeViewServerSideDemo } from './tree-view-server-side-demo';
import { TreeViewOverviewDemo } from './tree-view-overview-demo';
import { RouterModule } from '@angular/router';
import { TreeViewDashboardDemo } from './tree-view-dashboard-demo';

const FUI_DEMO_COMPONENTS_DIRECTIVES: Type<any>[] = [
  TreeViewClientSideDemo,
  TreeViewServerSideDemo,
  TreeViewOverviewDemo,
  TreeViewDashboardDemo
];

@NgModule({
  imports: [CommonModule, FormsModule, FeruiModule, HighlightModule, RouterModule],
  declarations: [FUI_DEMO_COMPONENTS_DIRECTIVES],
  exports: [FUI_DEMO_COMPONENTS_DIRECTIVES]
})
export class TreeViewDemoModule {}
