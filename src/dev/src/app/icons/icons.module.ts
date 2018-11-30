import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ROUTING } from './icons.routing';
import { FormsModule } from '@angular/forms';
import { IconsComponent } from './icons-list/icons.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { IconsLandingComponent } from './icons-landing.component';
import { ClrIconModule } from '@ferui/components';

@NgModule({
  imports: [CommonModule, FormsModule, ClrIconModule, ROUTING],
  declarations: [IconsComponent, GetStartedComponent, IconsLandingComponent],
  exports: [IconsComponent, GetStartedComponent]
})
export class IconsModule {
}
