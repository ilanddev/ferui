import { AbstractControlTemplate } from '../abstract-control-demo.component';

/**
 * This template class is used only to make our day easier.
 * To avoid writing the code within a template and copy/pate it to another variable for highlight directive.
 * The typescript class allow us to write the elements only once within variables that
 * both template and highlight directive can be fed with.
 */
export class RadioComponentTemplate extends AbstractControlTemplate {
  private static instance: RadioComponentTemplate;

  static getInstance() {
    if (!RadioComponentTemplate.instance) {
      RadioComponentTemplate.instance = new RadioComponentTemplate();
    }
    return RadioComponentTemplate.instance;
  }

  private constructor() {
    super('Radio Page');
    this.examplesCode = [
      {
        title: 'No label, no wrapper :',
        code: `<input type="radio" value="yes" fuiRadio name="one" [(ngModel)]="model.one"/>`,
        resultModels: ['one'],
      },
      {
        title: 'Radio with label :',
        code: `<fui-radio-wrapper>
  <input type="radio" fuiRadio name="two" value="yes" [(ngModel)]="model.two"/>
  <label>Option 1</label>
</fui-radio-wrapper>
<fui-radio-wrapper>
  <input type="radio" fuiRadio name="twobis" value="yes" [(ngModel)]="model.twobis"/>
  <label>Option 2</label>
</fui-radio-wrapper>`,
        resultModels: ['two', 'twobis'],
      },
      {
        title: 'Label, wrapper and <span class="text-danger">required</span> validator :',
        code: `<fui-radio-container>
  <fui-radio-wrapper>
    <input type="radio" fuiRadio name="option" required value="option1" [(ngModel)]="model.three" />
    <label>Option 1</label>
  </fui-radio-wrapper>
  <fui-radio-wrapper>
    <input type="radio" fuiRadio name="option" required value="option2" [(ngModel)]="model.three" />
    <label>Option 2</label>
  </fui-radio-wrapper>
  <fui-control-error>This field is required!</fui-control-error>
</fui-radio-container>`,
        resultModels: ['three'],
      },
    ];
    super.init();
  }
}
