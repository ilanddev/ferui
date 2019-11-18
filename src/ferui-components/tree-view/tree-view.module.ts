import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FuiTreeNodeComponent } from './tree-node-component';
import { FuiTreeViewComponent } from './tree-view-component';
import { ClrIconModule } from '../icon/icon.module';
import { FuiVirtualScrollerModule } from '../virtual-scroller/virtual-scroller.module';

export const FUI_TREEVIEW_DIRECTIVES: Type<any>[] = [FuiTreeViewComponent, FuiTreeNodeComponent];

@NgModule({
  imports: [CommonModule, FormsModule, ClrIconModule, FuiVirtualScrollerModule],
  declarations: [FUI_TREEVIEW_DIRECTIVES],
  exports: [FUI_TREEVIEW_DIRECTIVES],
})
export class TreeViewModule {}
