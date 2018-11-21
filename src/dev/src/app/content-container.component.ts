import { Component } from '@angular/core';
import { Route } from '@angular/router';

import { APP_ROUTES } from './app.routing';

@Component({
  selector: 'my-app-content-container',
  templateUrl: './content-container.component.html'
})
export class AppContentContainerComponent {
  public routes: Route[] = APP_ROUTES;
}
