import { Route } from '@angular/router';
import { Component } from '@angular/core';
import { COMPONENTS_ROUTES } from './components/components-demo.routing';
import { ICONS_ROUTES } from './icons/icons.routing';

@Component({
  selector: 'my-app-content-container',
  templateUrl: './content-container.component.html',
})
export class AppContentContainerComponent {
  public routes: Route[] = [...ICONS_ROUTES, ...COMPONENTS_ROUTES];
}
