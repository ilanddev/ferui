import { AbstractControlTemplate } from '../abstract-control-demo.component';

/**
 * This template class is used only to make our day easier.
 * To avoid writing the code within a template and copy/pate it to another variable for highlight directive.
 * The typescript class allow us to write the elements only once within variables that
 * both template and highlight directive can be fed with.
 */
export class InputsComponentTemplate extends AbstractControlTemplate {
  private static instance: InputsComponentTemplate;

  static getInstance() {
    if (!InputsComponentTemplate.instance) {
      InputsComponentTemplate.instance = new InputsComponentTemplate();
    }
    return InputsComponentTemplate.instance;
  }

  private constructor() {
    // We set the global page title.
    super('Inputs Page');
    this.examplesCode = [
      {
        title: 'No label, no wrapper :',
        code: `<input fuiInput name="one" [(ngModel)]="model.one"/>`,
        resultModels: ['one'],
      },
      {
        title: 'No label, wrapper :',
        code: `<fui-input-container>
  <input fuiInput name="two" [(ngModel)]="model.two"/>
</fui-input-container>`,
        resultModels: ['two'],
      },
      {
        title: 'Label, wrapper and <span class="text-danger">required</span> validator :',
        code: `<fui-input-container>
  <label>Full example</label>
  <input placeholder="With placeholder" fuiInput name="three" [(ngModel)]="model.three" required/>
  <fui-control-error>This field is required (this message overwrite any other ones)</fui-control-error>
</fui-input-container>`,
        resultModels: ['three'],
      },
      {
        title:
          'Label, wrapper, <span class="text-danger">required</span> validator but <span class="text-danger">disabled</span> :',
        code: `<fui-input-container>
  <label>Full example (disabled)</label>
  <input fuiInput name="four" [(ngModel)]="model.four" required [disabled]="disabled"/>
  <fui-control-error *fuiIfError="'required'">This field is required (this message overwrite any other ones)</fui-control-error>
</fui-input-container>`,
        resultModels: ['four'],
      },
      {
        title: 'Label, wrapper, <span class="text-danger">required</span> validator, disabled and filled :',
        code: `<fui-input-container>
  <label>Full example (disabled, filled)</label>
  <input fuiInput name="five" [(ngModel)]="model.five" required [disabled]="disabled"/>
  <!-- All the validator messages are default ones -->
</fui-input-container>`,
        resultModels: ['five'],
      },
      {
        title: 'Multiple validators',
        code: `<fui-input-container>
  <label>Full example (multiple validators)</label>
  <input fuiInput name="six" [(ngModel)]="model.six" required email/>
  <!-- All the validator messages are default ones -->
</fui-input-container>`,
        resultModels: ['six'],
      },
      {
        title: 'Custom IPV4Adress validator',
        code: `<fui-input-container>
  <label>Custom example (ipv4 validator)</label>
  <input fuiInput name="seven" [(ngModel)]="model.seven" required ipv4Address />
  <fui-control-error *fuiIfError="'required'">This field is required (this message overwrite default require message)</fui-control-error>
</fui-input-container>`,
        resultModels: ['seven'],
      },
    ];
    super.init();
  }
}
