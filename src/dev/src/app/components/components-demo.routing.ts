import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ComponentsLandingComponent } from './components-landing.component';
import { DatagridDemo } from './datagrid/datagrid.demo';
import { DatagridServerSideComponent } from './datagrid/pages/datagrid-server-side.component';
import { DatagridInfiniteServerSideComponent } from './datagrid/pages/datagrid-infinite-server-side.component';
import { DatagridHome } from './datagrid/pages/datagrid-home';

import { FormsLandingComponent } from './forms/forms-landing.component';
import { ComponentsDashboardComponent } from './default/default.component';
import { InputsComponent } from './forms/inputs/inputs.component';
import { FormsDashboardComponent } from './forms/dashboard/forms-dashboard.component';
import { PasswordComponent } from './forms/password/password.component';
import { DatetimeComponent } from './forms/datetime/datetime.component';
import { TextareaComponent } from './forms/textarea/textarea.component';
import { CheckboxComponent } from './forms/checkbox/checkbox.component';
import { RadiosComponent } from './forms/radios/radios.component';
import { SelectsComponent } from './forms/select/selects.component';
import { DatagridClientSideComponent } from './datagrid/pages/datagrid-client-side.component';
import { DropdownDemo } from './dropdown/dropdown.demo';
import { DropdownExample } from './dropdown/pages/dropdown-example';
import { TreeViewClientSideDemo } from './tree-view/tree-view-client-side-demo';
import { WidgetDemo } from './widget/widget.demo';
import { NumberComponent } from './forms/number/number';
import { DatagridTreeviewInfiniteServerSideComponent } from './datagrid/pages/datagrid-treeview.component';
import { TreeViewServerSideDemo } from './tree-view/tree-view-server-side-demo';
import { TreeViewOverviewDemo } from './tree-view/tree-view-overview-demo';
import { TreeViewDashboardDemo } from './tree-view/tree-view-dashboard-demo';

export const COMPONENTS_ROUTES: Routes = [
  {
    path: 'components',
    component: ComponentsLandingComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ComponentsDashboardComponent },
      {
        path: 'forms',
        component: FormsLandingComponent,
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: FormsDashboardComponent },
          { path: 'inputs', component: InputsComponent },
          { path: 'number', component: NumberComponent },
          { path: 'datetimes', component: DatetimeComponent },
          { path: 'passwords', component: PasswordComponent },
          { path: 'textareas', component: TextareaComponent },
          { path: 'checkboxes', component: CheckboxComponent },
          { path: 'radios', component: RadiosComponent },
          { path: 'selects', component: SelectsComponent }
        ]
      },
      {
        path: 'datagrid',
        component: DatagridDemo,
        children: [
          { path: '', redirectTo: 'home', pathMatch: 'full' },
          { path: 'home', component: DatagridHome },
          { path: 'client-side', component: DatagridClientSideComponent },
          { path: 'server-side', component: DatagridServerSideComponent },
          { path: 'infinite-server-side', component: DatagridInfiniteServerSideComponent },
          { path: 'treeview-infinite-server-side', component: DatagridTreeviewInfiniteServerSideComponent }
        ]
      },
      {
        path: 'dropdown',
        component: DropdownDemo,
        children: [
          { path: '', redirectTo: 'home', pathMatch: 'full' },
          { path: 'home', component: DropdownExample }
        ]
      },
      {
        path: 'treeview',
        component: TreeViewOverviewDemo,
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: TreeViewDashboardDemo },
          { path: 'client-side', component: TreeViewClientSideDemo },
          { path: 'server-side', component: TreeViewServerSideDemo }
        ]
      },
      {
        path: 'widget',
        component: WidgetDemo
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(COMPONENTS_ROUTES)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule {}
