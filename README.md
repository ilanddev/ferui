# Ferui design system

[![CircleCI](https://circleci.com/gh/ilanddev/ferui.svg?style=shield)](https://circleci.com/gh/ilanddev/ferui)
[![codecov](https://codecov.io/gh/ilanddev/ferui/branch/master/graph/badge.svg)](https://codecov.io/gh/ilanddev/ferui)
[![License](https://img.shields.io/badge/license-BSD--3--Clause-blue.svg)](https://github.com/ilanddev/ferui/blob/master/LICENSE)

**FerUI** stand for : **F**ast **E**asy **R**eusable **UI** and `Fer` sounds like `Fair` which is what we expect from a UI/UX web framework 😃.

The Ferui project is an open sourced design system based on the amazing [Clarity](https://github.com/vmware/clarity/) project that brings together UX guidelines, an HTML/CSS framework, and Angular components.
This repository includes everything you need to build, customize, test, and deploy Ferui. For complete documentation, visit our [Ferui docs](https://ilanddev.github.io/ferui/) (Still in construction).

## Getting Started

Like Clarity, we've published three npm packages:

* **@ferui/icons**. We just added our custom set of icons to the existing set from [Clarity](https://github.com/vmware/clarity/). By default we load all Clarity `core icons`.
* **@ferui/design**. We have used [Bootstrap](https://github.com/twbs/bootstrap) as a base for our design system. So you'll found the same methods but we have a totaly custom design system for `forms`. You can find the complete list of what we load from botstrap [there](https://github.com/ilanddev/ferui/blob/master/src/ferui-design/scss/ferui-design.scss).
* **@ferui/components**. This part is a fork of [@clr/angular](https://github.com/vmware/clarity/tree/master/src/clr-angular) which is part of [Clarity](https://github.com/vmware/clarity/). It contains all Angular components. This package depends on `@ferui/design` and `@ferui/icons` for styles and icons.

If you already have an Angular application, you can follow the installation steps below to include and use Ferui in your application.

### Installing Ferui/icons

1.  Install Ferui/icons package

```shell
npm install @ferui/icons --save
```

2.  Install the polyfill for Custom Elements:

```shell
npm install @webcomponents/custom-elements --save
```

3.  Include the clr-icons.min.css and `ferui-icons.min.js` in your HTML. As `ferui-icons.min.js` is dependent on the Custom Elements polyfill, make sure to include it before ferui-icons.min.js:

```html
<link rel="stylesheet" href="path/to/node_modules/@ferui/icons/ferui-icons.min.css"/>

<script src="path/to/node_modules/@webcomponents/custom-elements/custom-elements.min.js"></script>
<script src="path/to/node_modules/@ferui/icons/ferui-icons.min.js"></script>
```

If your site is built with [angular-cli (v6+)](https://github.com/angular/angular-cli) you can achieve the above by adding the files to the styles array and scripts array in `angular-cli.json`:

```javascript
"styles": [
    ...
    "../node_modules/@ferui/icons/ferui-icons.min.css",
    ...
],
"scripts": [
    ...
    "../node_modules/@webcomponents/custom-elements/custom-elements.min.js",
    "../node_modules/@ferui/icons/ferui-icons.min.js"
    ...
]
```

### Installing Ferui design

1.  Install Ferui Design package through npm:

```shell
npm install @ferui/design --save
```

2.  Include the ferui-design.min.css in your HTML file:

```html
<link rel="stylesheet" href="path/to/node_modules/@ferui/design/ferui-design.min.css">
```

If your site is built with [angular-cli (v6+)](https://github.com/angular/angular-cli), you can achieve the above by adding the file to the styles array in `angular-cli.json`:

```javascript
"styles": [
    ...
    "../node_modules/@ferui/design/ferui-design.min.css"
    ...
]
```

3.  Write your HTML with the Ferui CSS class names and markup.

### Installing Ferui Components

1.  Follow steps above to install Ferui Icons and Ferui Design (angular-cli usage).

2.  Install the Ferui Components package through npm:

```shell
npm install --save @ferui/components
```

> Note: No need to install other packages since they will automatically be added by this one.

3.  Import the FeruiModule into your Angular application's module. Your application's main module might look like this:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FeruiModule } from '@ferui/components';
import { AppComponent } from './app.component';

@NgModule({
    imports: [
        BrowserModule,
        FeruiModule,
        ...,
     ],
     declarations: [ AppComponent ],
     bootstrap: [ AppComponent ]
})
export class AppModule {}
```

If your application uses systemjs, add the configuration as in the example below.

```javascript
System.config({
	...
	map: {
	   ...
	   '@ferui/components': 'node_modules/@ferui/components/bundles/ferui-components.umd.js',
	   '@ferui/icons': 'node_modules/@ferui/icons/bundles/ferui-icons.umd.js',
	},
	...
});
```

## Contributing

The Clarity project team welcomes contributions from the community. For more detailed information, see [CONTRIBUTING.md](CONTRIBUTING.md).
