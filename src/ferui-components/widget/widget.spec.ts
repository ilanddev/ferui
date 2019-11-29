import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuiWidgetModule } from './widget.module';
import { By } from '@angular/platform-browser';
import { FuiWidget } from './widget.component';
import { FuiWidgetBody } from './widget-body.component';
import { FuiWidgetHeader } from './widget-header.component';
import { FuiWidgetTitle } from './widget-title.component';
import { FuiWidgetSubtitle } from './widget-subtitle.component';
import { FuiWidgetFooter } from './widget-footer.component';
import { FuiWidgetActions } from './widget-actions.component';
import { FuiDate, FuiDateContainer } from '../forms/date/index';
import { FuiCheckbox, FuiCheckboxWrapper } from '../forms/checkbox/index';
import { FuiDatetimeModelTypes } from '../forms/common/datetime-model-types.enum';

@Component({
  template: `
    <fui-widget>
      <fui-widget-header>
        <fui-widget-title>Widget title</fui-widget-title>
        <fui-widget-subtitle>Widget subtitle</fui-widget-subtitle>
      </fui-widget-header>
      <fui-widget-body>Widget Body</fui-widget-body>
      <fui-widget-footer>Widget footer</fui-widget-footer>
    </fui-widget>
  `,
})
class WidgetWithTextContent {}

@Component({
  template: `
    <fui-widget>
      <fui-widget-header>
        <fui-widget-title>Widget title</fui-widget-title>
        <fui-widget-subtitle>Widget subtitle</fui-widget-subtitle>
        <fui-widget-actions>
          <fui-date-container class="m-0">
            <label>Start Date</label>
            <input
              name="userDate"
              type="date"
              placeholder="Choose a date from datepicker"
              [fuiDate]="params.dateType"
              [(ngModel)]="models.date"
            />
          </fui-date-container>
        </fui-widget-actions>
      </fui-widget-header>
      <fui-widget-body>
        <fui-checkbox-wrapper>
          <input type="checkbox" fuiCheckbox name="checkboxTwo" [(ngModel)]="models.checkbox" />
          <label>Option 2</label>
        </fui-checkbox-wrapper>
      </fui-widget-body>
      <fui-widget-footer>Widget footer</fui-widget-footer>
    </fui-widget>
  `,
})
class WidgetWithComponents {
  params = {
    dateType: FuiDatetimeModelTypes.DATE,
  };
  models = {
    date: new Date(),
    checkbox: false,
  };
}

export default function(): void {
  describe('FuiWidget component', () => {
    let fixture: ComponentFixture<any>;

    describe('FuiWidget with text content', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [FuiWidgetModule],
          declarations: [WidgetWithTextContent],
        });
        fixture = TestBed.createComponent(WidgetWithTextContent);
        fixture.detectChanges();
      });

      it('FuiWidget directive is created', () => {
        const elmt = fixture.debugElement.query(By.directive(FuiWidget));
        expect(elmt).toBeDefined();
      });

      describe('Widget body', () => {
        it('FuiWidgetBody directive is created', () => {
          const elmt = fixture.debugElement.query(By.directive(FuiWidgetBody));
          expect(elmt).toBeDefined();
        });

        it('FuiWidgetBody has text content', () => {
          const elmt = fixture.debugElement.query(By.directive(FuiWidgetBody));
          expect(elmt.nativeElement.textContent).toEqual('Widget Body');
        });
      });

      describe('Widget header', () => {
        it('FuiWidgetHeader directive is created', () => {
          const elmt = fixture.debugElement.query(By.directive(FuiWidgetHeader));
          expect(elmt).toBeDefined();
        });

        it('FuiWidgetTitle directive is created', () => {
          const elmt = fixture.debugElement.query(By.directive(FuiWidgetTitle));
          expect(elmt).toBeDefined();
        });

        it('FuiWidgetTitle has text content', () => {
          const elmt = fixture.debugElement.query(By.directive(FuiWidgetTitle));
          expect(elmt.nativeElement.textContent).toEqual('Widget title');
        });

        it('FuiWidgetSubtitle directive is created', () => {
          const elmt = fixture.debugElement.query(By.directive(FuiWidgetSubtitle));
          expect(elmt).toBeDefined();
        });

        it('FuiWidgetSubtitle has text content', () => {
          const elmt = fixture.debugElement.query(By.directive(FuiWidgetSubtitle));
          expect(elmt.nativeElement.textContent).toEqual('Widget subtitle');
        });
      });

      describe('Widget footer', () => {
        it('FuiWidgetFooter directive is created', () => {
          const elmt = fixture.debugElement.query(By.directive(FuiWidgetFooter));
          expect(elmt).toBeDefined();
        });

        it('FuiWidgetTitle has text content', () => {
          const elmt = fixture.debugElement.query(By.directive(FuiWidgetFooter));
          expect(elmt.nativeElement.textContent).toEqual('Widget footer');
        });
      });
    });

    describe('FuiWidget with components', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [FuiWidgetModule],
          declarations: [WidgetWithTextContent],
        });
        fixture = TestBed.createComponent(WidgetWithTextContent);
        fixture.detectChanges();
      });

      it('FuiWidget directive is created', () => {
        const elmt = fixture.debugElement.query(By.directive(FuiWidget));
        expect(elmt).toBeDefined();
      });

      describe('Widget header', () => {
        it('FuiWidgetHeader directive is created', () => {
          const elmt = fixture.debugElement.query(By.directive(FuiWidgetHeader));
          expect(elmt).toBeDefined();
        });

        it('FuiWidgetActions directive is created', () => {
          const elmt = fixture.debugElement.query(By.directive(FuiWidgetActions));
          expect(elmt).toBeDefined();
        });

        it('FuiWidgetActions directive contains a component', () => {
          let elmt = fixture.debugElement.query(By.directive(FuiDateContainer));
          expect(elmt).toBeDefined();
          elmt = fixture.debugElement.query(By.directive(FuiDate));
          expect(elmt).toBeDefined();
        });
      });

      describe('Widget body', () => {
        it('FuiWidgetBody directive is created', () => {
          const elmt = fixture.debugElement.query(By.directive(FuiWidgetBody));
          expect(elmt).toBeDefined();
        });

        it('FuiWidgetBody contains a component', () => {
          let elmt = fixture.debugElement.query(By.directive(FuiCheckboxWrapper));
          expect(elmt).toBeDefined();
          elmt = fixture.debugElement.query(By.directive(FuiCheckbox));
          expect(elmt).toBeDefined();
        });
      });
    });
  });
}
