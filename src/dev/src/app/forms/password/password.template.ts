import { AbstractControlTemplate } from '../abstract-control-demo.component';

/**
 * This template class is used only to make our day easier.
 * To avoid writing the code within a template and copy/pate it to another variable for highlight directive.
 * The typescript class allow us to write the elements only once within variables that
 * both template and highlight directive can be fed with.
 */
export class PasswordsComponentTemplate extends AbstractControlTemplate {
  private static instance: PasswordsComponentTemplate;

  static getInstance() {
    if (!PasswordsComponentTemplate.instance) {
      PasswordsComponentTemplate.instance = new PasswordsComponentTemplate();
    }
    return PasswordsComponentTemplate.instance;
  }

  private constructor() {
    // We set the global page title.
    super('Inputs Page');
    this.examplesCode = [
      {
        title: 'No label, wrapper :',
        code: `<fui-password-container>
  <input fuiPassword name="two" [(ngModel)]="model.two"/>
</fui-password-container>`,
        resultModels: ['two'],
      },
      {
        title: 'Label, wrapper and <span class="text-danger">required</span> validator :',
        code: `<fui-password-container>
  <label>Full example</label>
  <input placeholder="With placeholder" fuiPassword name="three" [(ngModel)]="model.three" required/>
  <fui-control-error>This field is required (this message overwrite any other ones)</fui-control-error>
</fui-password-container>`,
        resultModels: ['three'],
      },
      {
        title:
          'Label, wrapper, <span class="text-danger">required</span> validator but <span class="text-danger">disabled</span> :',
        code: `<fui-password-container>
  <label>Full example (disabled)</label>
  <input fuiPassword name="four" [(ngModel)]="model.four" required [disabled]="disabled"/>
  <fui-control-error *fuiIfError="'required'">This field is required (this message overwrite any other ones)</fui-control-error>
</fui-password-container>`,
        resultModels: ['four'],
      },
      {
        title: 'Label, wrapper, <span class="text-danger">required</span> validator, disabled and filled :',
        code: `<fui-password-container>
  <label>Full example (disabled, filled)</label>
  <input fuiPassword name="five" [(ngModel)]="model.five" required [disabled]="disabled"/>
  <!-- All the validator messages are default ones -->
</fui-password-container>`,
        resultModels: ['five'],
      },
    ];
    super.init();
  }
}
