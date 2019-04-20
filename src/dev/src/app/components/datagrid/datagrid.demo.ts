import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  template: `
    <h2>Datagrid</h2>
    <ul class="nav nav-pills mt-3">
      <li class="nav-item">
        <a class="nav-link" [routerLinkActive]="'active'" [routerLink]="['./client-side']">Client Side</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" [routerLinkActive]="'active'" [routerLink]="['./server-side']">Server side</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" [routerLinkActive]="'active'" [routerLink]="['./infinite-server-side']"
          >Infinite Server side</a
        >
      </li>
    </ul>
    <hr />
    <router-outlet></router-outlet>
  `,
})
export class DatagridDemo {}
