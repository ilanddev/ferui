### Installing Ferui Components

1.  Install Ferui Icons package through npm:

    ```
    npm install @ferui/icons
    ```

    * Don't forget to add the polyfill for Custom Elements if not already done:

    ```
    npm install @webcomponents/custom-elements
    ```

2.  Install Ferui Design package through npm:

    ```
    npm install @ferui/design
    ```

3.  Install the Ferui Components angular package through npm:

    ```
    npm install @ferui/angular
    ```

4.  Import the FeruiModule into your Angular application's module. Your application's main module might look like this:

    ```
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { ClarityModule } from '@ferui/components';
    import { AppComponent } from './app.component';

    @NgModule({
        imports: [
            BrowserModule,
            FeruiModule,
            ....
         ],
         declarations: [ AppComponent ],
         bootstrap: [ AppComponent ]
    })
    export class AppModule {    }
    ```
