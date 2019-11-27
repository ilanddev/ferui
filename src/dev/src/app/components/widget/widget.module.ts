import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HighlightModule } from 'ngx-highlightjs';
import { FeruiModule } from '@ferui/components';
import { WidgetDemo } from './widget.demo';
import { UtilsModule } from '../../utils/utils.module';

const FUI_DEMO_COMPONENTS_DIRECTIVES: Type<any>[] = [WidgetDemo];

@NgModule({
  imports: [CommonModule, FormsModule, FeruiModule, HighlightModule, UtilsModule],
  declarations: [FUI_DEMO_COMPONENTS_DIRECTIVES],
  exports: [FUI_DEMO_COMPONENTS_DIRECTIVES],
})
export class WidgetDemoModule {}
