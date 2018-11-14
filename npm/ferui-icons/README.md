### Installing FerUI Icons

1.  Install FerUI Icons package through npm:

    ```
    npm install @ferui/icons
    ```

2.  Install the polyfill for Custom Elements:

    ```
    npm install @webcomponents/custom-elements
    ```

3.  Include the ferui-icons.min.css and ferui-icons.min.js in your HTML. As ferui-icons.min.js is dependent on the Custom Elements polyfill, make sure to include it before ferui-icons.min.js:

    ```
    <link rel="stylesheet" href="path/to/node_modules/ferui-icons/ferui-icons.min.css">

    <script src="path/to/node_modules/@webcomponents/custom-elements/custom-elements.min.js"></script>
    <script src="path/to/node_modules/ferui-icons/ferui-icons.min.js"></script>
    ```
