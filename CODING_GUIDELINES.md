# Coding guidelines

To ensure the highest quality and maintainability for FerUI components, we adhere to the following guidelines when coding.

## File names

* Components or directives should be named without a suffix like `input-container.ts`, and be placed in the main module folder like `/forms/input/input-container.ts`.
* Providers, factories, services should be named with the same suffix like `if-error.service.ts`.
  * If the component has a single provider, the provider file can be placed directly in the same folder as the component itself.
  * In the case of more complex components where many providers are needed for the various subcomponents to communicate, the providers should be placed inside of a `providers` sub-folder of the module folder like `/forms/datepicker/providers/date-io.service.ts`.
* Interfaces and abstract classes used as interfaces should be named with a suffix like `myabstract.interface.ts` \* If the component has a single provider, the provider file can be placed directly in the same folder as the component itself
  * If the component has one or two interfaces/abstract classes the file can be placed in the same folder as the component itself
  * In the case of more complex components (w/ 3 or more interfaces) interfaces/abstract classes should be placed inside an `interfaces` sub-folder like `/mycomponent/interfaces/myinterface.interface.ts`
* Enums should be named with a suffix like `myenum.enum.ts`.
  * If the component has one or two enums the file can be placed in the same folder as the component
  * In the case of more complex components(w/ 3 or more enums) they should be placed in an `enums` sub-folder like `/mycomponent/enums/myenum.enum.ts`

## Naming conventions

### General guidelines

* Prefer full words over abbreviations
* Anything public and meant to be used by consumers should have the `fui` prefix.

### SCSS

* SCSS variables should follow the `kebab-case` convention: `$some-variable`.

### Typescript

#### Constants

Constants internal to FerUI are named following the `SCREAMING_SNAKE_CASE` convention.
Constants exported as part of our public API follow the same convention but need to be prefixed: `FUI_SCREAMING_SNAKE_CASE`.

#### Enums

The enum itself is prefixed by `Fui` since it is public, and each of the values are `SCREAMING_SNAKE_CASE` because they are constant. For instance:

```typescript
FuiDirection.DOWN;
```

#### Class names

Any class exported publicly needs to be prefixed with `Fui`. For instance:

```typescript
class FuiInput {}
class FuiCheckbox {}
```

#### Properties and methods

Properties and methods on Typescript classes should not be prefixed or suffixed. In particular, private properties should **not** be prefixed with `_`.

```typescript
public open: boolean;
public next() { ... }
private subscription: Subscription;
```

There are 2 exceptions to this rule, and they're the only cases where we allow the use of an `_` prefix:

* A private property is hidden behind a getter (and maybe a setter) that has the same name:

```typescript
private _open: boolean;
public get open(): boolean;
public set open(value: boolean);

private _openChange: Subject<boolean>;
public get openChange(): Observable<boolean>;
```

* A property or method needs to be public for integration purposes but should not be considered public by the consumer:

```typescript
@ContentChildren(Something) _children: QueryList<Something>;
_internalMethodCalledFromAnotherClass()
```

### Angular

#### Components and directives selector

All Angular selectors are prefixed with `fui`, then follow the typical `snake_case` or `camelCase` depending on whether they're element or attribute selectors:

```
fui-component
[fuiDirective]
```

When larger components have sub-components, the sub-component should use these selectors:

```
fui-component-subcomponent
[fuiComponentSubdirective]
```

This is slightly verbose, but will prevent conflicts between components. This is a case where abbreviations are acceptable to reduce verbosity.

#### Inputs and outputs

To avoid conflict with non-Clarity components, inputs and outputs of our directives and components should be prefixed with `fui`:

```
[fuiInput]
(fuiInputChange)
(fuiOutput)
```

Remember that for `[(fuiProperty)]` two-way binding to work, you need to expose both a `[fuiProperty]` input and
a `(fuiPropertyChange)` output.

#### Components and directives class names

Components and directives are exported Typescript classes, so they respect the earlier convention and are prefixed with `Fui`. Contrary to the recommendation on the Angular style guide, they do not have any `Component` or `Directive` suffix, in order to allow us to switch from one to the other without breaking changes. For instance:

```
FuiInput (directive)
FuiIfError (structural directive)
FuiInputContainer (component)
```

#### Providers and services class names

Once again, providers are exported Typescript classes so they are prefixed. To avoid conflicts with similar component names, they are suffixed with `Service`:

```
FuiSomeService
FuiIfErrorService
```

#### Modules

Prefixed with `Fui` as usual, and suffixed with `Module`:

```
FuiSomeModule
FuiFormsModule
```

`FeruiModule` is the exception, since the actual "Ferui" name is already there.

## Typescript and Angular

### Public API

* Custom texts should almost always be received through content projection, **not** inputs. This will allow for icons, images, links, etc.
* Offer an output for every internal state change, whether it's triggered by a user action or an internal operation (expand/collapse, on/off, option selected, etc).
* Offer two-way binding rather than simple outputs when possible.
* Use structural directives to receive `TemplateRef` instances, in order to offer a less verbose API than `<ng-template>` to the consumer.
* Have related components (like parent / child) communicate by default through services.
* Never use explicitly named template reference variables as part of the API, to query them through `@ContentChild`. Simply receive structural directives or inputs.
* Never make HTTP calls, and never impose formatting constraints on their backend API.
* In cases where a directive cannot be used unless it is a child of another directive, it is usually best to throw a new Error in the constructor to alert developers that it is not supported.

Finally, and this is harder to put in black-or-white terms, keep the API as simple and natural as possible, even if it means more work on FerUI's side. Implementing multiple directives and components and making them communicate through services will lead to a much more pleasant integration than forcing your consumer to pass data manually from one to the other.

* **Don't:** Using an `<ng-template>` and passing an `$implicit` value to it, that the consumer will have to tie to a template local variable:

```html
<fui-carousel [fuiItems]="items">
  <ng-template let-item>
    <h1>{{item}}</h1>
  </ng-template>
</fui-carousel>
```

* **Don't:** Receive an input on the "wrong" component, and force the user to handle the communication between this component and the other, linked ones (in this case through a template reference variable):

```html
<fui-carousel #carousel [fuiItems]="items">
  <h1 *ngFor="let item of carousel.visible">
    {{item}}
  </h1>
</fui-carousel>
```

* **Do:** Introduce a new structural directive that behaves like an `*ngFor`, but will automatically communicate with the parent component through services:

```html
<fui-carousel>
  <h1 *fuiVisible="let item of items">
    {{item}}
  </h1>
</fui-carousel>
```

### Code style

* If the template is just a few lines, it should go inline in the component's metadata with `template`. Otherwise, it should be in a separate HTML file using `templateUrl`.
* Make sure to use CSS classnames with your components. We avoid using component tags in our CSS selectors. This often means adding a `host: { '[class.your-classname-here]': 'true' }` to your component definition. And in the CSS you would then use the classname defined on the host in your CSS selectors instead of the component element tag. So instead of using `fui-signpost { .. }` to apply styles to a component, you would use `.signpost { .. }`.
* Bindings that are always true should be declared directly in the component's metadata using the `host` option. Other bindings should be on the corresponding property or getter, using the `@HostBinding` annotation.
* Host listeners should always use the `@HostListener` annotation.
* Methods used as event listeners in a component or directive should be named in a way that describe **what** they do, not **when** they trigger. For instance, if a method is used when the user clicks a button to toggle the selection, the method name should **not** be `onClick()`, it should be `toggleSelection()`. Here are more typical method names that are commonly used but that you should avoid: `onClick()`, `onHover()`, `onFocus()`, `onScroll()`, etc.

### Gotchas

* Make sure your component or feature is fully accessible.
* Never hardcode any text in your template or in the component. Any text visible to the user should be received from the consumer.
* Avoid using native elements API as much as possible. Use simple bindings or the renderer to achieve the same effect.
* An `@Output` **should not** fire when we receive a new `@Input` value from the app.
* Any button in your template should have `type="button"`, in case the component is used inside of a form.

### Unit testing

* All tests files need to be suffixed with `spec` and must start with the file name you're testing (like : `input-container.ts => input-container.spec.ts`);
* We expect extensive unit test coverage of any code submitted.
* Unit tests should not duplicate coverage. In particular, avoid multiple unit tests failing for the same error.
* Do not test several components at the same time, unless you're specifically writing an integration test. You should manually declare parent components that might be needed for your test as **providers**, or even better mock them. In other words, make sure the only components your are declaring in your testing module are the currently tested component and the test host.
* Split your unit tests in Typescript API, Template API and View (details coming soon).
* During your testing sessions, it's possible to use `fdescribe` and `fit` to test specific chunks of tests but keep in mind that the tslint will not accept it ! And this is wanted, we're using `defocus` plugin to be sure that we do not miss any `fdescribe` or `fit` for production release. To be able to run your tests without issues, you must run the command : `npm run test:components`. This will avoid the tslint check.

## Static UI

* Remove unused HTML wrappers that might be left from previous prototypes of your code.
* Avoid styling elements themselves, use CSS classes. This also means applying CSS styles to the classes on your Angular components. For example, don't use `fui-signpost > .btn` as a selector in your CSS. Use `.signpost > .btn` instead.
* Keep your CSS selectors as flat as possible, try not to exceed 2 levels (e.g. `.parent .child`).
* Do not hardcode colors, use the SCSS variables provided in `_variables.scss`.
* Only use `rem` and `%` sizes. The only exception is `1px` borders that should remain 1px even on larger font sizes.
* All of your SCSS styles should be wrapped in an `@include exports('XXX.YYY') { ... }`, to avoid producing duplicates in the deliverable CSS.
