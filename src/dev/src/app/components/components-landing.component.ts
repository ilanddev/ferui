import { Component } from '@angular/core';

@Component({
  selector: 'components-landing',
  template: `
    <h1 class="mt-4">FerUI Components</h1>
    <hr />
    <router-outlet></router-outlet>
  `,
})
export class ComponentsLandingComponent {}
