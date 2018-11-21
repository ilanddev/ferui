import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsDemo } from './icons.demo';
import { ROUTING } from './icons.demo.routing';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule, ROUTING],
  declarations: [IconsDemo],
  exports: [IconsDemo],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IconsDemoModule {
}
