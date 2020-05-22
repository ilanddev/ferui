import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { FeruiModule } from '@ferui/components';
import { HighlightModule } from 'ngx-highlightjs';
import xml from 'highlight.js/lib/languages/xml';
import scss from 'highlight.js/lib/languages/scss';
import css from 'highlight.js/lib/languages/css';
import typescript from 'highlight.js/lib/languages/typescript';
import json from 'highlight.js/lib/languages/json';

import { AppComponent } from './app.component';
import { LandingComponent } from './landing.component';
import { AppContentContainerComponent } from './content-container.component';
import { WINDOW_PROVIDERS } from './services/window.service';
import { ComponentsDemoModule } from './components/components-demo.module';
import { IconsModule } from './icons/icons.module';
import { AppRoutingModule } from './app.routing';
import { UtilsModule } from './utils/utils.module';
import { UiDesignModule } from './ui-design/ui-design.module';

export function hljsLanguages() {
  return [
    { name: 'typescript', func: typescript },
    { name: 'scss', func: scss },
    { name: 'css', func: css },
    { name: 'xml', func: xml },
    { name: 'json', func: json }
  ];
}

@NgModule({
  imports: [
    UtilsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    IconsModule,
    UiDesignModule,
    ComponentsDemoModule,
    FeruiModule,
    HighlightModule.forRoot({
      languages: hljsLanguages
    })
  ],
  declarations: [AppContentContainerComponent, AppComponent, LandingComponent],
  exports: [RouterModule, AppContentContainerComponent],
  bootstrap: [AppComponent],
  providers: [WINDOW_PROVIDERS]
})
export class AppModule {}
