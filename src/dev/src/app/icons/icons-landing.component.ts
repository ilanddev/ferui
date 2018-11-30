import { Component } from '@angular/core';

@Component({
  template: `
    <h1>Icons</h1>
    <ul class="nav">
      <li class="nav-item"><a class="nav-link" [routerLinkActive]="'active'" [routerLink]="['./get-started']">How to</a></li>
      <li class="nav-item"><a class="nav-link" [routerLinkActive]="'active'" [routerLink]="['./icons-list']">Icons List</a></li>
    </ul>
    <router-outlet></router-outlet>
  `
})
export class IconsLandingComponent {
}
