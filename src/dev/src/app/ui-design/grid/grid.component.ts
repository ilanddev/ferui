import { Component } from '@angular/core';
import * as jsBeautify from 'js-beautify';

@Component({
  selector: 'ui-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class UiDesignGridComponent {
  exampleCode1: string = jsBeautify.html(`<div class="container">
        <div class="row">
          <div class="col-sm bg-light">
            One of three columns
          </div>
          <div class="col-sm bg-bg-secondary">
            One of three columns
          </div>
          <div class="col-sm bg-light">
            One of three columns
          </div>
        </div>
      </div>`);

  exampleCode2: string = jsBeautify.html(`<div class="container">
        <div class="row">
          <div class="col bg-light">
            1 of 2
          </div>
          <div class="col bg-secondary">
            2 of 2
          </div>
        </div>
        <div class="row">
          <div class="col bg-secondary">
            1 of 3
          </div>
          <div class="col bg-light">
            2 of 3
          </div>
          <div class="col bg-secondary">
            3 of 3
          </div>
        </div>
      </div>`);

  exampleCode3: string = jsBeautify.html(`<div class="container">
        <div class="row">
          <div class="col bg-light">col</div>
          <div class="col bg-secondary">col</div>
          <div class="w-100"></div>
          <div class="col bg-secondary">col</div>
          <div class="col bg-light">col</div>
        </div>
      </div>`);

  exampleCode4: string = jsBeautify.html(`<div class="container">
        <div class="row">
          <div class="col bg-light">
            1 of 3
          </div>
          <div class="col-6 bg-secondary">
            2 of 3 (wider)
          </div>
          <div class="col bg-light">
            3 of 3
          </div>
        </div>
        <div class="row">
          <div class="col bg-secondary">
            1 of 3
          </div>
          <div class="col-5 bg-light">
            2 of 3 (wider)
          </div>
          <div class="col bg-secondary">
            3 of 3
          </div>
        </div>
      </div>`);

  exampleCode5: string = jsBeautify.html(`<div class="container">
        <div class="row justify-content-md-center">
          <div class="col col-lg-2 bg-light">
            1 of 3
          </div>
          <div class="col-md-auto bg-secondary">
            Variable width content
          </div>
          <div class="col col-lg-2 bg-light">
            3 of 3
          </div>
        </div>
        <div class="row">
          <div class="col bg-secondary">
            1 of 3
          </div>
          <div class="col-md-auto bg-light">
            Variable width content
          </div>
          <div class="col col-lg-2 bg-secondary">
            3 of 3
          </div>
        </div>
      </div>`);

  exampleCode6: string = jsBeautify.html(`<div class="container">
        <div class="row">
          <div class="col bg-light">col</div>
          <div class="col bg-secondary">col</div>
          <div class="col bg-light">col</div>
          <div class="col bg-secondary">col</div>
        </div>
        <div class="row">
          <div class="col-8 bg-secondary">col-8</div>
          <div class="col-4 bg-light">col-4</div>
        </div>
      </div>`);

  exampleCode7: string = jsBeautify.html(`<div class="container">
        <div class="row">
          <div class="col-sm-8 bg-light">col-sm-8</div>
          <div class="col-sm-4 bg-secondary">col-sm-4</div>
        </div>
        <div class="row">
          <div class="col-sm bg-secondary">col-sm</div>
          <div class="col-sm bg-light">col-sm</div>
          <div class="col-sm bg-secondary">col-sm</div>
        </div>
      </div>`);

  exampleCode8: string = jsBeautify.html(`<div class="container">
        <!-- Stack the columns on mobile by making one full-width and the other half-width -->
        <div class="row">
          <div class="col-md-8 bg-light">.col-md-8</div>
          <div class="col-6 col-md-4 bg-secondary">.col-6 .col-md-4</div>
        </div>

        <!-- Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop -->
        <div class="row">
          <div class="col-6 col-md-4 bg-secondary">.col-6 .col-md-4</div>
          <div class="col-6 col-md-4 bg-light">.col-6 .col-md-4</div>
          <div class="col-6 col-md-4 bg-secondary">.col-6 .col-md-4</div>
        </div>

        <!-- Columns are always 50% wide, on mobile and desktop -->
        <div class="row">
          <div class="col-6 bg-light">.col-6</div>
          <div class="col-6 bg-secondary">.col-6</div>
        </div>
      </div>`);

  exampleCode9: string = jsBeautify.html(`<div class="container px-lg-5">
      <div class="row mx-lg-n5">
        <div class="col py-3 px-lg-5 border bg-light">Custom column padding</div>
        <div class="col py-3 px-lg-5 border bg-secondary">Custom column padding</div>
      </div>
    </div>`);

  exampleCode10: string = jsBeautify.html(`<div class="container">
        <div class="row row-cols-2">
          <div class="col bg-light">Column</div>
          <div class="col bg-secondary">Column</div>
          <div class="col bg-light">Column</div>
          <div class="col bg-secondary">Column</div>
        </div>
      </div>`);

  exampleCode11: string = jsBeautify.html(`<div class="container">
        <div class="row row-cols-3">
          <div class="col bg-light">Column</div>
          <div class="col bg-secondary">Column</div>
          <div class="col bg-light">Column</div>
          <div class="col bg-secondary">Column</div>
        </div>
      </div>`);

  exampleCode12: string = jsBeautify.html(`<div class="container">
        <div class="row row-cols-4">
          <div class="col">Column</div>
          <div class="col">Column</div>
          <div class="col">Column</div>
          <div class="col">Column</div>
        </div>
      </div>`);

  exampleCode13: string = jsBeautify.html(`<div class="container">
        <div class="row row-cols-4">
          <div class="col">Column</div>
          <div class="col">Column</div>
          <div class="col-6">Column</div>
          <div class="col">Column</div>
        </div>
      </div>`);

  exampleCode14: string = jsBeautify.html(`<div class="container">
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4">
          <div class="col">Column</div>
          <div class="col">Column</div>
          <div class="col">Column</div>
          <div class="col">Column</div>
        </div>
      </div>`);

  exampleCode15: string = jsBeautify.css(`.element {
  // Three columns to start
  @include row-cols(3);

  // Five columns from medium breakpoint up
  @include media-breakpoint-up(md) {
    @include row-cols(5);
  }
}`);

  exampleCode16: string = jsBeautify.html(`<div class="container">
        <div class="row align-items-start">
          <div class="col">
            One of three columns
          </div>
          <div class="col">
            One of three columns
          </div>
          <div class="col">
            One of three columns
          </div>
        </div>
        <div class="row align-items-center">
          <div class="col">
            One of three columns
          </div>
          <div class="col">
            One of three columns
          </div>
          <div class="col">
            One of three columns
          </div>
        </div>
        <div class="row align-items-end">
          <div class="col">
            One of three columns
          </div>
          <div class="col">
            One of three columns
          </div>
          <div class="col">
            One of three columns
          </div>
        </div>
      </div>`);

  exampleCode17: string = jsBeautify.html(`<div class="container">
        <div class="row">
          <div class="col align-self-start">
            One of three columns
          </div>
          <div class="col align-self-center">
            One of three columns
          </div>
          <div class="col align-self-end">
            One of three columns
          </div>
        </div>
      </div>`);

  exampleCode18: string = jsBeautify.html(`<div class="container">
        <div class="row justify-content-start">
          <div class="col-4">
            One of two columns
          </div>
          <div class="col-4">
            One of two columns
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-4">
            One of two columns
          </div>
          <div class="col-4">
            One of two columns
          </div>
        </div>
        <div class="row justify-content-end">
          <div class="col-4">
            One of two columns
          </div>
          <div class="col-4">
            One of two columns
          </div>
        </div>
        <div class="row justify-content-around">
          <div class="col-4">
            One of two columns
          </div>
          <div class="col-4">
            One of two columns
          </div>
        </div>
        <div class="row justify-content-between">
          <div class="col-4">
            One of two columns
          </div>
          <div class="col-4">
            One of two columns
          </div>
        </div>
      </div>`);

  exampleCode19: string = jsBeautify.css(`.no-gutters {
  margin-right: 0;
  margin-left: 0;

  > .col,
  > [class*="col-"] {
    padding-right: 0;
    padding-left: 0;
  }
}`);

  exampleCode20: string = jsBeautify.html(`<div class="row no-gutters">
        <div class="col-sm-6 col-md-8">.col-sm-6 .col-md-8</div>
        <div class="col-6 col-md-4">.col-6 .col-md-4</div>
      </div>`);

  exampleCode21: string = jsBeautify.html(`<div class="container">
        <div class="row">
          <div class="col-9">.col-9</div>
          <div class="col-4">
            .col-4<br />Since 9 + 4 = 13 &gt; 12, this 4-column-wide div gets wrapped onto a new line as one contiguous unit.
          </div>
          <div class="col-6">.col-6<br />Subsequent columns continue along the new line.</div>
        </div>
      </div>`);

  exampleCode22: string = jsBeautify.html(`<div class="container">
        <div class="row">
          <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>
          <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>

          <!-- Force next columns to break to new line -->
          <div class="w-100"></div>

          <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>
          <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>
        </div>
      </div>`);
  exampleCode23: string = jsBeautify.html(`<div class="container">
        <div class="row">
          <div class="col-6 col-sm-4">.col-6 .col-sm-4</div>
          <div class="col-6 col-sm-4">.col-6 .col-sm-4</div>

          <!-- Force next columns to break to new line at md breakpoint and up -->
          <div class="w-100 d-none d-md-block"></div>

          <div class="col-6 col-sm-4">.col-6 .col-sm-4</div>
          <div class="col-6 col-sm-4">.col-6 .col-sm-4</div>
        </div>
      </div>`);
  exampleCode24: string = jsBeautify.html(`<div class="container">
        <div class="row">
          <div class="col">
            First in DOM, no order applied
          </div>
          <div class="col order-12">
            Second in DOM, with a larger order
          </div>
          <div class="col order-1">
            Third in DOM, with an order of 1
          </div>
        </div>
      </div>`);

  exampleCode25: string = jsBeautify.html(`<div class="container">
        <div class="row">
          <div class="col order-last">
            First in DOM, ordered last
          </div>
          <div class="col">
            Second in DOM, unordered
          </div>
          <div class="col order-first">
            Third in DOM, ordered first
          </div>
        </div>
      </div>`);

  exampleCode26: string = jsBeautify.html(`<div class="container">
        <div class="row">
          <div class="col-md-4">.col-md-4</div>
          <div class="col-md-4 offset-md-4">.col-md-4 .offset-md-4</div>
        </div>
        <div class="row">
          <div class="col-md-3 offset-md-3">.col-md-3 .offset-md-3</div>
          <div class="col-md-3 offset-md-3">.col-md-3 .offset-md-3</div>
        </div>
        <div class="row">
          <div class="col-md-6 offset-md-3">.col-md-6 .offset-md-3</div>
        </div>
      </div>`);

  exampleCode27: string = jsBeautify.html(`<div class="container">
        <div class="row">
          <div class="col-sm-5 col-md-6">.col-sm-5 .col-md-6</div>
          <div class="col-sm-5 offset-sm-2 col-md-6 offset-md-0">.col-sm-5 .offset-sm-2 .col-md-6 .offset-md-0</div>
        </div>
        <div class="row">
          <div class="col-sm-6 col-md-5 col-lg-6">.col-sm-6 .col-md-5 .col-lg-6</div>
          <div class="col-sm-6 col-md-5 offset-md-2 col-lg-6 offset-lg-0">
            .col-sm-6 .col-md-5 .offset-md-2 .col-lg-6 .offset-lg-0
          </div>
        </div>
      </div>`);
  exampleCode28: string = jsBeautify.html(`<div class="container">
        <div class="row">
          <div class="col-md-4">.col-md-4</div>
          <div class="col-md-4 ml-auto">.col-md-4 .ml-auto</div>
        </div>
        <div class="row">
          <div class="col-md-3 ml-md-auto">.col-md-3 .ml-md-auto</div>
          <div class="col-md-3 ml-md-auto">.col-md-3 .ml-md-auto</div>
        </div>
        <div class="row">
          <div class="col-auto mr-auto">.col-auto .mr-auto</div>
          <div class="col-auto">.col-auto</div>
        </div>
      </div>`);
  exampleCode29: string = jsBeautify.html(`<div class="container">
        <div class="row">
          <div class="col-sm-9">
            Level 1: .col-sm-9
            <div class="row">
              <div class="col-8 col-sm-6">
                Level 2: .col-8 .col-sm-6
              </div>
              <div class="col-4 col-sm-6">
                Level 2: .col-4 .col-sm-6
              </div>
            </div>
          </div>
        </div>
      </div>`);

  exampleCode30: string = jsBeautify.css(`$grid-columns:      12;
$grid-gutter-width: 30px;

$grid-breakpoints: (
  // Extra small screen / phone
  xs: 0,
  // Small screen / phone
  sm: 576px,
  // Medium screen / tablet
  md: 768px,
  // Large screen / desktop
  lg: 992px,
  // Extra large screen / wide desktop
  xl: 1200px
);

$container-max-widths: (
  sm: 540px,
  md: 720px,
  lg: 960px,
  xl: 1140px
);`);

  exampleCode31: string = jsBeautify.css(`// Creates a wrapper for a series of columns
@include make-row();

// Make the element grid-ready (applying everything but the width)
@include make-col-ready();
@include make-col($size, $columns: $grid-columns);

// Get fancy by offsetting, or changing the sort order
@include make-col-offset($size, $columns: $grid-columns);`);

  exampleCode32: string = jsBeautify.css(`.example-container {
  @include make-container();
  // Make sure to define this width after the mixin to override
  // \`width: 100%\` generated by \`make-container()\`
  width: 800px;
}

.example-row {
  @include make-row();
}

.example-content-main {
  @include make-col-ready();

  @include media-breakpoint-up(sm) {
    @include make-col(6);
  }
  @include media-breakpoint-up(lg) {
    @include make-col(8);
  }
}

.example-content-secondary {
  @include make-col-ready();

  @include media-breakpoint-up(sm) {
    @include make-col(6);
  }
  @include media-breakpoint-up(lg) {
    @include make-col(4);
  }
}`);

  exampleCode33: string = jsBeautify.html(`<div class="example-container">
  <div class="example-row">
    <div class="example-content-main">Main content</div>
    <div class="example-content-secondary">Secondary content</div>
  </div>
</div>`);

  exampleCode34: string = jsBeautify.css(`$grid-columns: 12 !default;
$grid-gutter-width: 30px !default;`);

  exampleCode35: string = jsBeautify.css(`$grid-breakpoints: (
  xs: 0,
  sm: 480px,
  md: 768px,
  lg: 1024px
);

$container-max-widths: (
  sm: 420px,
  md: 720px,
  lg: 960px
);`);
  exampleCode36: string = jsBeautify.html(``);
  exampleCode37: string = jsBeautify.html(``);
  exampleCode38: string = jsBeautify.html(``);
  exampleCode39: string = jsBeautify.html(``);
}
