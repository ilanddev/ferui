import { Component } from '@angular/core';
import * as jsBeautify from 'js-beautify';

@Component({
  selector: 'get-started',
  templateUrl: './get-started.component.html'
})
export class GetStartedComponent {
  codeExample1: string = jsBeautify.html(`
    <!--FERUI ICONS STYLE-->
    <link rel="stylesheet" href="path/to/node_modules/@ferui/icons/ferui-icons.min.css">

    <!--FERUI ICONS DEPENDENCY: CUSTOM ELEMENTS POLYFILL-->
    <script src="path/to/node_modules/@webcomponents/custom-elements/custom-elements.min.js"></script>

    <!--FERUI ICONS API & ALL ICON SETS -->
    <script src="path/to/node_modules/@ferui/icons/ferui-icons.min.js"></script>
  `);

  codeExample2: string = jsBeautify.html(`
    <!--FERUI ICONS STYLE-->
    <link rel="stylesheet" href="path/to/node_modules/@clr/icons/clr-icons.min.css">

    <!--FERUI ICONS DEPENDENCY: CUSTOM ELEMENTS POLYFILL-->
    <script src="path/to/node_modules/@webcomponents/custom-elements/custom-elements.min.js"></script>

    <!--FERUI ICONS API & CORE SHAPES SET-->
    <script src="path/to/node_modules/@clr/icons/clr-icons-lite.min.js"></script>

    <!--ICON SETS-->
    <script src="path/to/node_modules/@clr/icons/shapes/social-shapes.min.js"></script>
    <script src="path/to/node_modules/@clr/icons/shapes/travel-shapes.min.js"></script>`);

  codeExample3: string = jsBeautify.js(`
    import '@clr/icons';
    import '@clr/icons/shapes/essential-shapes';
    import '@clr/icons/shapes/technology-shapes';`);

  codeExample4: string = jsBeautify.js(`
    import '@clr/icons';
    import '@clr/icons/shapes/all-shapes';`);

  codeExample5: string = jsBeautify.js(`
    import { ClarityIcons } from '@clr/icons';
    import { ClrShapePin } from '@clr/icons/shapes/essential-shapes';
    import { ClrShapeStar } from '@clr/icons/shapes/social-shapes';
    import { ClrShapeCar } from '@clr/icons/shapes/travel-shapes';

    ClarityIcons.add({
    pin: ClrShapePin,
    star: ClrShapeStar,
    car: ClrShapeCar
    });`);
}
