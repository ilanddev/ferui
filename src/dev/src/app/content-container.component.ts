import { Component } from '@angular/core';
import { Route } from '@angular/router';

import { APP_ROUTES } from './app.routing';

@Component({
  selector: 'my-app-content-container',
  template: `
    <main class="content-area">
      <router-outlet></router-outlet>
    </main>
    <nav class="sidenav">
      <section class="sidenav-content">
        <section class="nav-group collapsible">
          <input id="tab1" type="checkbox">
          <label for="tab1">FerUI Navigation</label>
          <ul class="nav-list">
            <li *ngFor="let route of routes">
              <a *ngIf="route.path != ''" class="nav-link" [routerLink]="[route.path]"
                 [routerLinkActive]="['active']">{{route.path}}</a>
            </li>
          </ul>
        </section>
      </section>
    </nav>`
})
export class AppContentContainerComponent {
  public routes: Route[] = APP_ROUTES;
}
