import { Component } from '@angular/core';
import * as jsBeautify from 'js-beautify';

@Component({
  selector: 'spacings',
  templateUrl: './spacings.component.html'
})
export class UiDesignSpacingsComponent {
  exampleCode1: string = jsBeautify.css(`
  .mt-0 {
  margin-top: 0 !important;
}

.ml-1 {
  margin-left: ($spacer * .3125) !important;
}

.px-2 {
  padding-left: ($spacer * .625) !important;
  padding-right: ($spacer * .625) !important;
}

.p-3 {
  padding: $spacer * .9375 !important;
}`);

  exampleCode2: string = jsBeautify.html(`
  <div class="mx-auto" style="width: 200px;">
  Centered element
</div>`);

  exampleCode3: string = jsBeautify.css(`.mt-n1 {
  margin-top: -0.25rem !important;
}`);

  exampleCode4: string = jsBeautify.html(`<div class="row mx-md-n5">
      <div class="col px-md-5"><div class="p-3 border bg-light">Custom column padding</div></div>
      <div class="col px-md-5"><div class="p-3 border bg-light">Custom column padding</div></div>
    </div>`);
}
