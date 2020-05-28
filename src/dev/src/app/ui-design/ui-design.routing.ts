import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UiDesignLandingComponent } from './ui-design-landing.component';
import { UiDesignGetStartedComponent } from './get-started/get-started.component';
import { UiDesignSpacingsComponent } from './spacings/spacings.component';
import { UiDesignGridComponent } from './grid/grid.component';

export const UI_DESIGN_ROUTES: Routes = [
  {
    path: 'design',
    component: UiDesignLandingComponent,
    children: [
      { path: '', redirectTo: 'get-started', pathMatch: 'full' },
      { path: 'get-started', component: UiDesignGetStartedComponent },
      { path: 'grid', component: UiDesignGridComponent },
      { path: 'spacings', component: UiDesignSpacingsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(UI_DESIGN_ROUTES)],
  exports: [RouterModule]
})
export class UiDesignRoutingModule {}
