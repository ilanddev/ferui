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

import { HighlightModule } from 'ngx-highlightjs';
import xml from 'highlight.js/lib/languages/xml';
import scss from 'highlight.js/lib/languages/scss';
import typescript from 'highlight.js/lib/languages/typescript';

export function hljsLanguages() {
  return [{ name: 'typescript', func: typescript }, { name: 'scss', func: scss }, { name: 'xml', func: xml }];
}

@NgModule({
  declarations: [AppComponent, LandingComponent, AppContentContainerComponent],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    FeruiModule,
    ROUTING,
    HighlightModule.forRoot({
      languages: hljsLanguages,
    }),
  ],
  bootstrap: [AppComponent],
  providers: [WINDOW_PROVIDERS],
})
export class AppModule {}
