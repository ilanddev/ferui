### Installing Ferui Design

1.  Install Ferui Design package through npm:

    ```
    npm install @ferui/design
    ```

2.  (Optional) Install Ferui Icons package through npm:

    ```
    npm install @ferui/icons
    ```

    * Don't forget to add the polyfill for Custom Elements if not already done:

    ```
    npm install @webcomponents/custom-elements
    ```

3.  Include the `ferui-design.min.css` and `ferui-icons.min.css` files in your HTML file:

    ```
    <link rel="stylesheet" href="path/to/node_modules/@ferui/design/ferui-design.min.css">
    <link rel="stylesheet" href="path/to/node_modules/@ferui/icons/ferui-icons.min.css">
    ```

4.  Include the `ferui-icons.min.js` in your HTML file (don't forget the _custom-elements_ polyfill) :

    ```
    <script src="path/to/node_modules/@webcomponents/custom-elements/custom-elements.min.js"></script>
    <script src="path/to/node_modules/@ferui/icons/ferui-icons.min.js"></script>
    ```

5.  Write your HTML with the Ferui Design CSS class names and markup.
