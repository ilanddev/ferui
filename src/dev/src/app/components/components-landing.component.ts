import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'components-landing',
  template: `
    <ul class="nav nav-pills mt-3">
      <li class="nav-item">
        <a class="nav-link" [routerLinkActive]="'active'" [routerLink]="['./default']">Components</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" [routerLinkActive]="'active'" [routerLink]="['./datagrid']">Datagrid</a>
      </li>
    </ul>
    <hr />
    <router-outlet></router-outlet>
  `,
})
export class ComponentsLandingComponent {}
