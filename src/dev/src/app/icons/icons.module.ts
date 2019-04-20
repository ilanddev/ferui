import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconsComponent } from './icons-list/icons.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { IconsLandingComponent } from './icons-landing.component';
import { ClrIconModule, FeruiModule } from '@ferui/components';
import { HighlightModule } from 'ngx-highlightjs';
import { IconsRoutingModule } from './icons.routing';

@NgModule({
  imports: [CommonModule, FormsModule, IconsRoutingModule, ClrIconModule, FeruiModule, HighlightModule],
  declarations: [IconsComponent, GetStartedComponent, IconsLandingComponent],
  exports: [IconsComponent, GetStartedComponent],
})
export class IconsModule {}
