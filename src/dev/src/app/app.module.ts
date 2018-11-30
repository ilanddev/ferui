import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ROUTING } from './app.routing';
import { LandingComponent } from './landing.component';
import { AppContentContainerComponent } from './content-container.component';
import { WINDOW_PROVIDERS } from './services/window.service';
import { FeruiModule } from '@ferui/components';

@NgModule({
  declarations: [AppComponent, LandingComponent, AppContentContainerComponent],
  imports: [BrowserAnimationsModule, CommonModule, FormsModule, FeruiModule, ROUTING],
  bootstrap: [AppComponent],
  providers: [WINDOW_PROVIDERS]
})
export class AppModule {
}
