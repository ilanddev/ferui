import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HighlightModule } from 'ngx-highlightjs';
import { FeruiModule } from '@ferui/components';
import { DropdownDemo } from './dropdown.demo';
import { RouterModule } from '@angular/router';
import { DropdownExample } from './pages/dropdown-example';
import { UtilsModule } from '../../utils/utils.module';

const FUI_DEMO_COMPONENTS_DIRECTIVES: Type<any>[] = [DropdownDemo, DropdownExample];

@NgModule({
  imports: [CommonModule, FormsModule, UtilsModule, FeruiModule, RouterModule, HighlightModule],
  declarations: [FUI_DEMO_COMPONENTS_DIRECTIVES],
  exports: [FUI_DEMO_COMPONENTS_DIRECTIVES, RouterModule],
})
export class DropdownDemoModule {}
