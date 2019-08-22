import { Component } from '@angular/core';

@Component({
  template: `
    <p class="alert alert-primary mt-4">
      Forms are a grouping of input controls that allow a user to submit information to your application.
    </p>

    <h4 class="mt-4">Forms using Angular</h4>
    <p>
      We've created a set of directives to help manage forms with minimal effort. The structure is more condensed and
      easier to implement, so it is the recommended approach to use the following if you are using Angular.
    </p>

    <h5>Basic forms</h5>
    <p>
      Declaring a form start by adding the <code>fuiForm</code> directive to the form element. This will wire up some
      internals to manage the form itself.
    </p>
    <pre><code [highlight]="basicFormExample"></code></pre>

    <h5>Basic structure</h5>
    <p>
      When you start to fill in your form controls, each will should be wrapped in a container like you see here in this
      text input example. If you don't, then you'll miss all the validation icons and messages. But your element will still
      work.
    </p>
    <pre><code [highlight]="basicStructureExample"></code></pre>
    <p class="alert alert-primary">
      Note that the order of <code>label</code> and <code>inpput</code> fields doesn't matter there.
    </p>

    <h5>Validation messages</h5>
    <p>These Angular components also support built in validation with error messages.</p>
    <pre><code [highlight]="basicValidationExample"></code></pre>

    <h5>Multiple error messages</h5>
    <p>
      If you want to support multiple error messages, you can do this by defining an error message for each scenario using
      <code>fuiIfError</code>. It is recommended that you create an error message for each validator you specify. Use the
      validator name provided in the binding for <code>*fuiIfError="'errorName'"</code>, which might be your custom
      validator or a built in Angular one.
    </p>
    <pre><code [highlight]="multipleErrorMsgExample"></code></pre>

    <h5>Default error messages</h5>
    <p>
      Even if we recommend adding an error message for each validator you specify, we already have some defaults ones that
      you can rely on. We support all
      <a href="https://angular.io/api/forms/Validators" target="_blank">angular built-in validators</a> and some other
      custom ones that we've made (Ip-address validator...etc)
    </p>
    <pre><code [highlight]="defaultErrorMessages"></code></pre>

    <p class="alert alert-primary">
      Note that if you specify an error message without <code>*fuiIfError</code> value, it will override any other default
      ones, but if you specify a message for a specific validator name, then only this default validator message will be
      override.
    </p>
  `,
})
export class FormsDashboardComponent {
  basicFormExample = `<form fuiForm>
  ... form controls
</form>`;
  basicStructureExample = `<form fuiForm>
  <fui-input-container>
    <label>Field 1 label</label>
    <input fuiInput type="text" [(ngModel)]="model" name="example" />
  </fui-input-container>
  <fui-input-container>
    <label>Field 2 label</label>
    <input fuiInput type="text" [(ngModel)]="model" name="example" />
  </fui-input-container>
</form>`;
  basicValidationExample = `<form fuiForm>
  <fui-input-container>
    <label>Field 1 label</label>
    <input fuiInput type="text" [(ngModel)]="model" name="example" required />
    <fui-control-error>Error message that appears after focus is lost and control is invalid</fui-control-error>
  </fui-input-container>
</form>`;
  multipleErrorMsgExample = `<fui-input-container>
  <label>Full example (multiple validators)</label>
  <input fuiInput name="full" [(ngModel)]="model" required email/>
  <fui-control-error *fuiIfError="'required'">This field is required</fui-control-error>
  <fui-control-error *fuiIfError="'email'">You didn't type a valid email address</fui-control-error>
</fui-input-container>`;

  defaultErrorMessages = `<fui-input-container>
  <label>Full example</label>
  <input fuiInput name="full" [(ngModel)]="model" required email />
  <!-- All validator messages are default ones -->
</fui-input-container>`;
}
