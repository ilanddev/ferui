import { Component } from '@angular/core';

@Component({
  selector: 'forms-landing',
  styleUrls: ['./forms-demo.component.scss'],
  template: `
    <h1 class="mt-3">Forms</h1>
    <ul class="nav nav-pills">
      <li class="nav-item"><a class="nav-link" [routerLinkActive]="'active'" [routerLink]="['./default']">Forms</a></li>
      <li class="nav-item"><a class="nav-link" [routerLinkActive]="'active'" [routerLink]="['./inputs']">Inputs</a></li>
      <li class="nav-item"><a class="nav-link" [routerLinkActive]="'active'" [routerLink]="['./passwords']">Passwords</a></li>
      <li class="nav-item"><a class="nav-link" [routerLinkActive]="'active'" [routerLink]="['./textareas']">Textareas</a></li>
      <li class="nav-item"><a class="nav-link" [routerLinkActive]="'active'" [routerLink]="['./checkboxes']">Checkboxes</a></li>
      <li class="nav-item"><a class="nav-link" [routerLinkActive]="'active'" [routerLink]="['./radios']">Radios</a></li>
      <li class="nav-item"><a class="nav-link" [routerLinkActive]="'active'" [routerLink]="['./selects']">Selects</a></li>
    </ul>
    <hr />
    <router-outlet></router-outlet>
  `,
})
export class FormsLandingComponent {}
