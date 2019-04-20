import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsLandingComponent } from './components-landing.component';
import { DefaultComponent } from './default/default.component';
import { DatagridDemo } from './datagrid/datagrid.demo';
import { DatagridServerSideComponent } from './datagrid/datagrid-server-side.component';
import { DatagridComponent } from './datagrid/datagrid.component';
import { DatagridInfiniteServerSideComponent } from './datagrid/datagrid-infinite-server-side.component';

const COMPONENTS_ROUTES: Routes = [
  {
    path: '',
    component: ComponentsLandingComponent,
    children: [
      { path: '', redirectTo: 'default', pathMatch: 'full' },
      { path: 'default', component: DefaultComponent },
      {
        path: 'datagrid',
        component: DatagridDemo,
        children: [
          { path: '', redirectTo: 'client-side', pathMatch: 'full' },
          { path: 'client-side', component: DatagridComponent },
          { path: 'server-side', component: DatagridServerSideComponent },
          { path: 'infinite-server-side', component: DatagridInfiniteServerSideComponent },
        ],
      },
    ],
  },
];

export const ROUTING: ModuleWithProviders = RouterModule.forChild(COMPONENTS_ROUTES);
