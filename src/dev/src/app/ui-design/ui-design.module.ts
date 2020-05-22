import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClrIconModule, FeruiModule } from '@ferui/components';
import { HighlightModule } from 'ngx-highlightjs';
import { UiDesignRoutingModule } from './ui-design.routing';
import { UiDesignGetStartedComponent } from './get-started/get-started.component';
import { UiDesignLandingComponent } from './ui-design-landing.component';
import { UiDesignSpacingsComponent } from './spacings/spacings.component';
import { UiDesignGridComponent } from './grid/grid.component';

@NgModule({
  imports: [CommonModule, FormsModule, UiDesignRoutingModule, ClrIconModule, FeruiModule, HighlightModule],
  declarations: [UiDesignGetStartedComponent, UiDesignSpacingsComponent, UiDesignGridComponent, UiDesignLandingComponent],
  exports: [UiDesignGetStartedComponent, UiDesignSpacingsComponent, UiDesignGridComponent]
})
export class UiDesignModule {}
