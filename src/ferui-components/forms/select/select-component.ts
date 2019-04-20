import { NgSelectComponent } from '@ng-select/ng-select';
import { Component } from '@angular/core';

@Component({
  selector: 'fui-select',
  template: `<ng-content></ng-content>`,
})
export class FuiSelectComponent extends NgSelectComponent {}
