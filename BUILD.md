# Local setup

FerUI uses NodeJS 8+ and NPM 5+ for development, so ensure you have them installed and up to date.

# Understanding the build

We have three packages:

* `@ferui/icons` - FerUI Icons package, which is a standalone web component library for icons
* `@ferui/design` - FerUI UI package, which is a standalone CSS library for FerUI styles
* `@ferui/components` - FerUI Angular package, which depends upon the other two packages to implement a set of Angular components

Each package has a slightly different build process, and this guide describes them each separately.

### `@ferui/icons`

FerUI Icons is built by running `npm run build:icons`, which calls the following tasks to build the package.

1.  `build:icons:css` - Sass compiles the styles
2.  `build:icons:optimize` - CSSO optimizes the CSS
3.  `build:icons:scss` - Copy the SCSS original file into the dist folder to be able to extend them if wanted.
4.  `build:icons:web` - Webpack compiles and bundles the TypeScript assets
5.  `build:icons:package` - Copy the `package.json` into the package, and set the version number

### `@ferui/design`

FerUI UI is built by running `npm run build:ui`, which calls the following tasks to build the package.

1.  `build:ui:css` - Sass compiles the light and dark theme files.
2.  `build:ui:prefix` - Autoprefixer adds prefixes to CSS properties based on browser compatibility.
3.  `build:ui:optimize` - CSSO Optimize the CSS.
4.  `build:ui:scss` - Copy in the source scss files for anyone building directly.
5.  `build:ui:package` - Copy the `package.json` into the package, and set the version number.

### `@ferui/components`

FerUI Components is built by running `npm run build:angular`, which calls the following tasks to build the package.

1.  `build:angular:ngpackagr` - Angular CLI and ng-packagr build the Angular modules
2.  `build:angular:package` - Copy the `package.json` into the package, and set the version number

# Globally Installed NPM packages

The following packages are installed globally in development environment. The purpose for each is listed below.
You won't need to install these for general development but may wish to do so if you want to run specific scripts for testing or publishing that require them:

* [@angular/cli](https://cli.angular.io/): This is used by the whole project for build, preview, and testing.

# Additional NPM Scripts

There are a few other NPM scripts that can be useful during build and development.

##### `npm start`

This will start up our demo app using the Angular CLI on port 9090 and watch for file changes for live reload.

##### `npm run build`

This script builds npm package candidates for all three packages we currently publish: `@ferui/components`, `@ferui/design`, and
`@ferui/icons` under the `/dist` folder.

##### `npm test` and `npm run test:watch`

The `test` script runs the unit tests using karma. The entry point for the tests is `tests/tests.entry.ts`.
You may locally modify this file to constrain which tests to run if you are testing for specific components and don't want
to run all the tests. You can run the tests in watch mode so they run continuously `npm run test:watch`.

##### `npm run build:angular`

This script produces the `@ferui/components` package using [ng-packagr](https://github.com/dherges/ng-packagr).

The script simply copies over the `package.json` template from our `npm` folder (this contains templates for `package.json` and
`README.md` for all of our packages) into `src/ferui-components` and sets the correct version number. This is necessary
because `ng-packagr` requires the `package.json` to be at the root of the `src` (defined in `ng-package.json`).

##### `npm run build:icons`

This script produces the `@ferui/icons` package by bundling js files that can be included in consuming app.
Note that this script partially relies on `webpack` as well, since the `webpack` script produces the `ferui-icons.css` and `ferui-icons.min.css` files.
The `webpack` script also processes the `package.json` and `README.md` files for all of our packages.
