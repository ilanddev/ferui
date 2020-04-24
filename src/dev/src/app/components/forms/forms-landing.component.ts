import { Component } from '@angular/core';

@Component({
  selector: 'forms-landing',
  styleUrls: ['./forms-demo.component.scss'],
  template: `
    <h1 class="mt-4">FerUI forms Components</h1>
    <hr />
    <router-outlet></router-outlet>
  `
})
export class FormsLandingComponent {}
