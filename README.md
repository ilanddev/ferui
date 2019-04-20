# Ferui design system

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![CircleCI](https://circleci.com/gh/ilanddev/ferui.svg?style=shield)](https://circleci.com/gh/ilanddev/ferui)
[![codecov](https://codecov.io/gh/ilanddev/ferui/branch/master/graph/badge.svg)](https://codecov.io/gh/ilanddev/ferui)
[![License](https://img.shields.io/badge/license-BSD--3--Clause-blue.svg)](https://github.com/ilanddev/ferui/blob/master/LICENSE)

**FerUI** stand for : **F**ast **E**asy **R**eusable **UI** and `Fer` sounds like `Fair` which is what we expect from a UI/UX web framework 😃.

The Ferui project is an open sourced design system inspired from the amazing [Clarity](https://github.com/vmware/clarity/) project that brings together UX guidelines, an HTML/CSS framework, and Angular components.
This repository includes everything you need to build, customize, test, and deploy Ferui. For complete documentation, visit our [Ferui docs](https://objective-booth-cd63b3.netlify.com/#/) (Still in construction).

## Getting Started

Like Clarity, we publish three npm packages:

- **@ferui/icons**. We just added our custom set of icons to the existing set from [Clarity](https://github.com/vmware/clarity/). By default we load all Clarity `core icons`.
- **@ferui/design**. We have used [Bootstrap](https://github.com/twbs/bootstrap) as a base for our design system. So you'll found the same methods but we have a totaly custom design system for `forms`. You can find the complete list of what we load from botstrap [there](https://github.com/ilanddev/ferui/blob/master/src/ferui-design/scss/ferui-design.scss).
- **@ferui/components**. This part is a fork of [@clr/angular](https://github.com/vmware/clarity/tree/master/src/clr-angular) which is part of [Clarity](https://github.com/vmware/clarity/). It contains all Angular components. This package depends on `@ferui/design` and `@ferui/icons` for styles and icons.

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
<link rel="stylesheet" href="path/to/node_modules/@ferui/icons/ferui-icons.min.css" />

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
<link rel="stylesheet" href="path/to/node_modules/@ferui/design/ferui-design.min.css" />
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

The FerUI project team welcomes contributions from the community. For more detailed information, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Netlify testing/deploys

If you want to deploy your current work through netlify, you'll need to have your own netlify account
([create an account](https://app.netlify.com/signup/)) and create a new site from github
(choose the `ferui` repo from `ilanddev` team when asking - click on the little arrow near your name in the modal dialog to switch team.) and fill-in those information:

- Build command: `npm install && npm run build:dev`
- Publish directory: `dist/dev`

Then click on `Deploy site` button when you're done. It will take some time to deploy the site. Then you'll be able to go to next steps. (I recommend you to change the site name as soon as you can. See Note 2 below for more info).

Then, open Ferui project with your favorite IDE and create the `.netlify/state.json` file at the root of ferui directory. Add the : `siteId` attribute and add your netlify `API ID` (go to [netlify website](https://app.netlify.com/) then log-in into your account, look for the site you've just created from the step below then click on `Site settings` link. It should be display within the general tab, under `Site details`.)

```json
{
  "siteId": "YOUR_API_ID_GOES_HERE"
}
```

Once you've did this, you'll be able to run `npm run netlify:deploy` to publish your work through your netlify account. That will generate a new link that you can share with anybody :-)

Good luck !

- Note: To keep using the free version of netlify, we need to let all developers have their own netlify account and configure their own site (API ID).
- Note 2: If you want, you can change your demo page URL for easy tracking. We recommend you to name your netlify site like this: `YOUR_NAME-ferui-demo` (replace YOUR_NAME by your actual name or unique identifier, i.e: john-ferui-demo.netlify.com). Just log in to [netlify website](https://app.netlify.com/), go to your site, then click on `Site Settings` then click on `Change site name`.
