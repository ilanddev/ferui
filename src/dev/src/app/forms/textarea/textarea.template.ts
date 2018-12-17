import { AbstractControlTemplate } from '../abstract-control-demo.component';

/**
 * This template class is used only to make our day easier.
 * To avoid writing the code within a template and copy/pate it to another variable for highlight directive.
 * The typescript class allow us to write the elements only once within variables that
 * both template and highlight directive can be fed with.
 */
export class TextareaComponentTemplate extends AbstractControlTemplate {
  private static instance: TextareaComponentTemplate;

  static getInstance() {
    if (!TextareaComponentTemplate.instance) {
      TextareaComponentTemplate.instance = new TextareaComponentTemplate();
    }
    return TextareaComponentTemplate.instance;
  }

  private constructor() {
    super('Textarea Page');
    this.examplesCode = [
      {
        title: 'No label, no wrapper :',
        code: `<textarea fuiTextarea name="one" [(ngModel)]="model.one"></textarea>`,
        resultModels: ['one'],
      },
      {
        title: 'No label, wrapper :',
        code: `<fui-textarea-container>
  <textarea fuiTextarea name="two" [(ngModel)]="model.two"></textarea>
</fui-textarea-container>`,
        resultModels: ['two'],
      },
      {
        title: 'Label, wrapper and <span class="text-danger">required</span> validator :',
        code: `<fui-textarea-container>
  <label for="three">Full example</label>
  <textarea placeholder="With placeholder" fuiTextarea id="three" name="three" [(ngModel)]="model.three"
            required></textarea>
  <fui-control-error>There was an error</fui-control-error>
</fui-textarea-container>`,
        resultModels: ['three'],
      },
      {
        title:
          'Label, wrapper, <span class="text-danger">required</span> validator but <span class="text-danger">disabled</span> :',
        code: `<fui-textarea-container>
  <label for="four">Full example (disabled)</label>
  <textarea fuiTextarea id="four" name="four" [(ngModel)]="model.four" required [disabled]="disabled"></textarea>
  <fui-control-error>This field is required</fui-control-error>
</fui-textarea-container>`,
        resultModels: ['four'],
      },
      {
        title: 'Label, wrapper, <span class="text-danger">required</span> validator, disabled and filled :',
        code: `<fui-textarea-container>
  <label for="five">Full example (disabled, filled)</label>
  <textarea fuiTextarea id="five" name="five" [(ngModel)]="model.five" required [disabled]="disabled"></textarea>
  <fui-control-error>This field is required</fui-control-error>
</fui-textarea-container>`,
        resultModels: ['five'],
      },
      {
        title: 'Multiple validators',
        code: `<fui-textarea-container>
  <label for="six">Full example (multiple validators)</label>
  <textarea fuiTextarea id="six" name="six" [(ngModel)]="model.six" required email></textarea>
  <fui-control-error *fuiIfError="'required'">This field is required</fui-control-error>
  <fui-control-error *fuiIfError="'email'">You didn't type an email address</fui-control-error>
</fui-textarea-container>`,
        resultModels: ['six'],
      },
    ];
    super.init();
  }
}
