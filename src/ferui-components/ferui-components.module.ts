import { NgModule } from '@angular/core';
import { FuiInputModule } from './forms/input/input.module';
import { ClrIconModule } from './icon/icon.module';

@NgModule({
  exports: [
    ClrIconModule,
    FuiInputModule
  ]
})
export class FeruiModule {
}
