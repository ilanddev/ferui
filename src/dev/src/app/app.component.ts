import { Component } from '@angular/core';
import { Route } from '@angular/router';
import { APP_ROUTES } from './app.routing';
import '@clr/icons';
import '@ferui/icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  public routes: Route[] = APP_ROUTES;
}
