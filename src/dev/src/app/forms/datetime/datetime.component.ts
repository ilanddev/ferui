import { Component, Inject, LOCALE_ID } from '@angular/core';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';
import { OnInit } from '@angular/core';
import { FuiDatetimeModelTypes } from '../../../../../ferui-components/forms/common/datetime-model-types.enum';

const date1: Date = new Date();
const date2: Date = new Date('2019-05-20 10:20:43');
const date3: Date = new Date('2017-06-10 12:00:00');
const date4: Date = new Date('2019-03-11 17:07:00');

@Component({
  template: `
    <form fuiForm class="container-fluid" #demoForm="ngForm">
      <default-template-wrapper [pageTitle]="'Datetime input Page'" [(disabled)]="disabled" [examples]="examples"
                                [results]="results" (toggleEvent)="toggle($event)">

        <p class="alert alert-primary mt-4">Note: All those components depends on Angular locale to format the date.
          Currently the locale is : <code>{{locale}}</code>.</p>
        <br/>
        <h4>Input date (<code>&lt;input type=&quot;time&quot; fuiDate /&gt;</code>)</h4>
        <hr/>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[0]"
                                  [examples]="examples" [results]="results" [idx]="0" [resultModelNames]="'one'">
          <h5 #title>Default date input. Returning a <code>Date</code> object</h5>
          <p #description>If you want to get a Date object from this component just specify it by setting the <code>[fuiDate]</code>
            value to <code>FuiDatetimeModelTypes.DATE</code>. By default it will return a <span class="font-weight-bold">string</span>.
          </p>
          <fui-date-container>
            <label>Start Date</label>
            <input name="one" type="date" placeholder="Choose a date from datepicker" [fuiDate]="modelTypeDate"
                   [(ngModel)]="model.one"/>
          </fui-date-container>
        </default-template-content>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[1]"
                                  [examples]="examples" [results]="results" [idx]="1" [resultModelNames]="'two'">
          <h5 #title>Default date input. Returning a string.</h5>
          <p #description>Note that the component will format the chosen date using Angular locale. <br/>For instance :
            <br/>if the locale is <code>en</code>, then the string will be formatted like <span class="font-weight-bold">'MM/DD/YYYY'</span>,
            <br/>if the locale is <code>fr</code> the string will looks like <span
              class="font-weight-bold">'DD/MM/YYYY'</span></p>
          <fui-date-container>
            <label>Date</label>
            <input name="two" fuiDate [(ngModel)]="model.two"/>
          </fui-date-container>
        </default-template-content>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[2]"
                                  [examples]="examples" [results]="results" [idx]="2" [resultModelNames]="'eight'">
          <h5 #title>Default date input. <code>Without container</code>. Returning a <code>Date</code> object</h5>
          <fui-date-container>
            <label>Date</label>
            <input name="eight" type="date" placeholder="Choose a date from datepicker" [fuiDate]="modelTypeDate"
                   [(ngModel)]="model.eight"/>
          </fui-date-container>
        </default-template-content>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[3]"
                                  [examples]="examples" [results]="results" [idx]="3" [resultModelNames]="'nine'">
          <h5 #title>Default date input. <code>Without container</code>. Returning a <code>Date</code> object
          </h5>
          <input name="nine" type="date" [fuiDate]="modelTypeDate" [(ngModel)]="model.nine"/>
        </default-template-content>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[4]"
                                  [examples]="examples" [results]="results" [idx]="4" [resultModelNames]="'ten'">
          <h5 #title>Default date input. <code>Without container nor wrapper</code>. This control has no ngControl
            bounding.</h5>
          <input name="ten" type="date" (fuiDateChange)="dateChange($event, 'ten')" [fuiDate]="modelTypeDate"/>
        </default-template-content>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[14]"
                                  [examples]="examples" [results]="results" [idx]="14" [resultModelNames]="'fourteen'">
          <h5 #title>Error message handling (validation).</h5>
          <fui-date-container>
            <label>Date (required)</label>
            <input name="fourteen" type="date" required placeholder="Choose a date from datepicker" [fuiDate]="modelTypeDate"
                   [(ngModel)]="model.fourteen"/>
          </fui-date-container>
        </default-template-content>

        <br/>
        <h4>Input time (<code>&lt;input type=&quot;time&quot; fuiTime /&gt;</code>)</h4>
        <hr/>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[5]"
                                  [examples]="examples" [results]="results" [idx]="5" [resultModelNames]="'three'">
          <h5 #title>Default time input. Returning a string</h5>
          <p #description>The time input has the same behaviour than the date input. Both can return a string or Date
            object depending on the return value chosen. By default the input return a locale dependent formatted
            string.</p>
          <fui-time-container>
            <input type="time" step="1" name="three" fuiTime [(ngModel)]="model.three"/>
          </fui-time-container>
        </default-template-content>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[6]"
                                  [examples]="examples" [results]="results" [idx]="6" [resultModelNames]="'four'">
          <h5 #title>Default time input (filled with US formatted time string value). Returning a <code>{{locale}}</code>
            formatted string.</h5>
          <fui-time-container>
            <input type="time" step="1" name="four" fuiTime [(ngModel)]="model.four"/>
          </fui-time-container>
        </default-template-content>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[7]"
                                  [examples]="examples" [results]="results" [idx]="7" [resultModelNames]="'five'">
          <h5 #title>Default time input (filled with EU formatted time string value). Returning a <code>{{locale}}</code>
            formatted string.</h5>
          <fui-time-container>
            <label>Time picker</label>
            <input type="time" step="1" name="five" fuiTime [(ngModel)]="model.five"/>
          </fui-time-container>
        </default-template-content>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[8]"
                                  [examples]="examples" [results]="results" [idx]="8" [resultModelNames]="'six'">
          <h5 #title>Default time input filled with date object. Returning a Date object.</h5>
          <input type="time" step="1" name="six" [fuiTime]="modelTypeDate" [(ngModel)]="model.six"/>
        </default-template-content>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[9]"
                                  [examples]="examples" [results]="results" [idx]="9" [resultModelNames]="'sixbis'">
          <h5 #title>Time input displaying only hours and minutes.</h5>
          <fui-time-container [showSeconds]="false">
            <label>Time picker</label>
            <input type="time" placeholder="Select a time from selects" name="sixbis" [fuiTime]="modelTypeDate"
                   [(ngModel)]="model.sixbis"/>
          </fui-time-container>
        </default-template-content>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[15]"
                                  [examples]="examples" [results]="results" [idx]="15" [resultModelNames]="'fifteen'">
          <h5 #title>Error message handling (validation).</h5>
          <fui-time-container>
            <label>Time</label>
            <input name="fifteen" type="time" placeholder="Select a time from selects" required [fuiTime]="modelTypeDate"
                   [(ngModel)]="model.fifteen"/>
          </fui-time-container>
        </default-template-content>

        <br/>
        <h4>Input datetime (<code>&lt;input type=&quot;datetime-local&quot; fuiDatetime /&gt;</code>)</h4>
        <hr/>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[10]"
        [examples]="examples" [results]="results" [idx]="10" [resultModelNames]="'seven'">
        <h5 #title>Default datetime input filled with date object. Returning a Date object.</h5>
        <p #description>This component is a combination of the two above. It works the same and you also can decide which
        kind of returning type you want (Date or string).</p>
        <fui-datetime-container>
          <input type="datetime-local" name="seven" [fuiDatetime]="modelTypeDate" [(ngModel)]="model.seven"/>
        </fui-datetime-container>
        </default-template-content>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[11]"
                                  [examples]="examples" [results]="results" [idx]="11" [resultModelNames]="'eleven'">
          <h5 #title>Datetime input <code>without container</code></h5>
          <input type="datetime-local" name="eleven" fuiDatetime [(ngModel)]="model.eleven"/>
        </default-template-content>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[12]"
                                  [examples]="examples" [results]="results" [idx]="12" [resultModelNames]="'twelve'">
          <h5 #title>Datetime input <code>without seconds displayed</code>. Returning a Date object</h5>
          <fui-datetime-container [showSeconds]="false">
            <input type="datetime-local" name="twelve" [fuiDatetime]="modelTypeDate" [(ngModel)]="model.twelve"/>
          </fui-datetime-container>
        </default-template-content>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[13]"
                                  [examples]="examples" [results]="results" [idx]="13" [resultModelNames]="'thirteen'">
          <h5 #title>Required Datetime input <code>without seconds displayed</code>. Returning a Date object.</h5>
          <fui-datetime-container [showSeconds]="false">
            <label>My datetime input</label>
            <input type="datetime-local" placeholder="This field is required" required name="thirteen" [fuiDatetime]="modelTypeDate" [(ngModel)]="model.thirteen"/>
          </fui-datetime-container>
        </default-template-content>

      </default-template-wrapper>

      <div class="footer">
        <button class="btn btn-primary" [disabled]="!demoForm.form.valid" type="submit">Submit</button>
        <button class="btn btn-success" type="button" (click)="validate()">Validate</button>
        <button class="btn btn-light" type="button" (click)="demoForm.reset()">Reset</button>
      </div>
    </form>
  `,
})
export class DatetimeComponent extends AbstractControlDemoComponent implements OnInit {
  model = {
    one: date1,
    two: date2.getMonth() + 1 + '/' + date2.getDate() + '/' + date2.getFullYear(),
    three: null,
    four: '6:20:00 AM',
    five: '19:20:40',
    six: date2,
    sixbis: null,
    seven: date3,
    eight: date3,
    nine: date3,
    ten: '01/02/2015',
    eleven: '10/20/2017, 5:20:00 PM',
    twelve: date4,
    thirteen: null,
    fourteen: null,
    fifteen: null,
  };

  modelTypeDate = FuiDatetimeModelTypes.DATE;

  // We need to rewrite the code there to be able to pass it to the highlight directive.
  // Keep in mind that the order is important there !
  exampleCodes: Array<string> = [
    `<fui-date-container>
  <label>Start Date</label>
  <input name="one" type="date" placeholder="Choose a date from datepicker" [fuiDate]="modelTypeDate"
         [(ngModel)]="model.one"/>
</fui-date-container>`,
    `<fui-date-container>
  <label>Date</label>
  <input name="two" fuiDate [(ngModel)]="model.two"/>
</fui-date-container>`,
    `<fui-date-container>
  <label>Date</label>
  <input name="eight" type="date" placeholder="Choose a date from datepicker" [fuiDate]="modelTypeDate"
         [(ngModel)]="model.eight"/>
</fui-date-container>`,
    `<input name="nine" type="date" [fuiDate]="modelTypeDate" [(ngModel)]="model.nine"/>`,
    `<input name="ten" type="date" (fuiDateChange)="dateChange($event, 'ten')" [fuiDate]="modelTypeDate"/>`,
    `<fui-time-container>
  <input type="time" step="1" name="three" fuiTime [(ngModel)]="model.three"/>
</fui-time-container>`,
    `<fui-time-container>
  <input type="time" step="1" name="four" fuiTime [(ngModel)]="model.four"/>
</fui-time-container>`,
    `<fui-time-container>
  <label>Time picker</label>
  <input type="time" step="1" name="five" fuiTime [(ngModel)]="model.five"/>
</fui-time-container>`,
    `<input type="time" step="1" name="six" [fuiTime]="modelTypeDate" [(ngModel)]="model.six"/>`,
    `<fui-time-container [showSeconds]="false">
  <label>Time picker</label>
  <input type="time" placeholder="Select a time from selects" name="sixbis" [fuiTime]="modelTypeDate"
         [(ngModel)]="model.sixbis"/>
</fui-time-container>`,
    `<fui-datetime-container>
  <input type="datetime-local" name="seven" [fuiDatetime]="modelTypeDate" [(ngModel)]="model.seven"/>
</fui-datetime-container>`,
    `<input type="datetime-local" name="eleven" [fuiDatetime]="modelTypeDate" [(ngModel)]="model.eleven"/>`,
    `<fui-datetime-container [showSeconds]="false">
  <input type="datetime-local" name="twelve" [fuiDatetime]="modelTypeDate" [(ngModel)]="model.twelve"/>
</fui-datetime-container>`,
    `<fui-datetime-container [showSeconds]="false">
  <label>My datetime input</label>
  <input type="datetime-local" placeholder="This field is required" required name="thirteen" [fuiDatetime]="modelTypeDate" [(ngModel)]="model.thirteen"/>
</fui-datetime-container>`,
    `<fui-date-container>
  <label>Date (required)</label>
  <input name="fourteen" type="date" required placeholder="Choose a date from datepicker" [fuiDate]="modelTypeDate"
         [(ngModel)]="model.fourteen"/>
</fui-date-container>`,
    `<fui-time-container>
  <label>Date (required)</label>
  <input name="fifteen" type="time" placeholder="Select a time from selects" required [fuiTime]="modelTypeDate"
         [(ngModel)]="model.fifteen"/>
</fui-time-container>`,
  ];

  constructor(@Inject(LOCALE_ID) public locale: string) {
    super();
  }

  dateChange(value: string | Date, modelName: string) {
    this.model[modelName] = value;
  }

  ngOnInit(): void {
    for (const idx in this.exampleCodes) {
      if (this.exampleCodes[idx]) {
        this.examples[idx] = this.defaultExampleValue;
        this.results[idx] = this.defaultResultValue;
      }
    }
  }
}
