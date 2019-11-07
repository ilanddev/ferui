import { NgModule } from '@angular/core';
import { DemoComponent } from './demo.component';
import { DemoPageComponent } from './demo-page.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeruiModule } from '@ferui/components';
import { HighlightModule } from 'ngx-highlightjs';

@NgModule({
  imports: [CommonModule, FormsModule, FeruiModule, HighlightModule],
  declarations: [DemoComponent, DemoPageComponent],
  exports: [DemoComponent, DemoPageComponent],
})
export class UtilsModule {}
