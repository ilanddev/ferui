import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuiWidget } from './widget.component';
import { FuiWidgetTitle } from './widget-title.component';
import { FuiWidgetSubtitle } from './widget-subtitle.component';
import { FuiWidgetFooter } from './widget-footer.component';
import { FuiWidgetHeader } from './widget-header.component';
import { FuiWidgetActions } from './widget-actions.component';
import { FuiWidgetBody } from './widget-body.component';

@NgModule({
  imports: [CommonModule],
  declarations: [FuiWidget, FuiWidgetHeader, FuiWidgetTitle, FuiWidgetSubtitle, FuiWidgetActions, FuiWidgetBody, FuiWidgetFooter],
  exports: [FuiWidget, FuiWidgetHeader, FuiWidgetTitle, FuiWidgetSubtitle, FuiWidgetActions, FuiWidgetBody, FuiWidgetFooter]
})
export class FuiWidgetModule {}
