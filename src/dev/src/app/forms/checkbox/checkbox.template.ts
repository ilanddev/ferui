import { AbstractControlTemplate } from '../abstract-control-demo.component';

/**
 * This template class is used only to make our day easier.
 * To avoid writing the code within a template and copy/pate it to another variable for highlight directive.
 * The typescript class allow us to write the elements only once within variables that
 * both template and highlight directive can be fed with.
 */
export class CheckboxComponentTemplate extends AbstractControlTemplate {
  private static instance: CheckboxComponentTemplate;

  static getInstance() {
    if (!CheckboxComponentTemplate.instance) {
      CheckboxComponentTemplate.instance = new CheckboxComponentTemplate();
    }
    return CheckboxComponentTemplate.instance;
  }

  private constructor() {
    super('Checkbox Page');
    this.examplesCode = [
      {
        title: 'No label, no wrapper :',
        code: `<input type="checkbox" fuiCheckbox name="one" [(ngModel)]="model.one"/>`,
        resultModels: ['one'],
      },
      {
        title: 'Checkbox with label :',
        code: `<fui-checkbox-wrapper>
  <input type="checkbox" fuiCheckbox name="two" [(ngModel)]="model.two"/>
  <label>Option 1</label>
</fui-checkbox-wrapper>
<fui-checkbox-wrapper>
  <input type="checkbox" fuiCheckbox name="twobis" [(ngModel)]="model.twobis"/>
  <label>Option 2</label>
</fui-checkbox-wrapper>`,
        resultModels: ['two', 'twobis'],
      },
      {
        title: 'Label, wrapper and <span class="text-danger">required</span> validator :',
        code: `<fui-checkbox-container>
  <fui-checkbox-wrapper>
    <input type="checkbox" fuiCheckbox name="option1" value="option1" [(ngModel)]="model.three" />
    <label>Option 1</label>
  </fui-checkbox-wrapper>
  <fui-checkbox-wrapper>
    <input type="checkbox" fuiCheckbox name="option2" required value="option2" [(ngModel)]="model.threebis" />
    <label>Option 2</label>
  </fui-checkbox-wrapper>
  <fui-control-error>This field is required!</fui-control-error>
</fui-checkbox-container>`,
        resultModels: ['three', 'threebis'],
      },
    ];
    super.init();
  }
}
