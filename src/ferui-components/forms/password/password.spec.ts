import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ReactiveSpec, TemplateDrivenSpec } from '../tests/control.spec';
import { TestBed } from '@angular/core/testing';
import { ClrIconModule } from '../../icon/icon.module';
import { IfErrorService } from '../common/if-error/if-error.service';
import { FuiCommonFormsModule } from '../common/common.module';
import { NgControlService } from '../common/providers/ng-control.service';
import { FuiPassword } from './password';
import { FuiPasswordContainer } from './password-container';

@Component({
  template: `
    <input type="password" fuiPassword/>
  `,
})
class InvalidUseTest {}

@Component({
  template: `
    <fui-password-container>
      <input type="text" fuiPassword class="test-class" name="model" [(ngModel)]="model"/>
    </fui-password-container>
  `,
})
class TemplateDrivenTest {}

@Component({
  template: `
    <div [formGroup]="example">
      <fui-password-container>
        <input fuiPassword class="test-class" formControlName="model"/>
      </fui-password-container>
    </div>
  `,
})
class ReactiveTest {
  example = new FormGroup({
    model: new FormControl('', Validators.required),
  });
}

export default function(): void {
  describe('FuiPassword', () => {
    describe('invalid use', () => {
      it('should throw an error when used without a password container', () => {
        TestBed.configureTestingModule({
          imports: [FuiPassword],
          declarations: [InvalidUseTest],
        });
        expect(() => {
          const fixture = TestBed.createComponent(InvalidUseTest);
          fixture.detectChanges();
        }).toThrow();
      });
    });
    TemplateDrivenSpec(FuiPasswordContainer, FuiPassword, TemplateDrivenTest, 'fui-input');
    ReactiveSpec(FuiPasswordContainer, FuiPassword, ReactiveTest, 'fui-input');

    describe('set password type', () => {
      let fixture, containerDE, containerEl;
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrIconModule, FuiCommonFormsModule, FormsModule],
          declarations: [FuiPasswordContainer, FuiPassword, TemplateDrivenTest],
          providers: [NgControl, NgControlService, IfErrorService],
        });
        fixture = TestBed.createComponent(TemplateDrivenTest);
        containerDE = fixture.debugElement.query(By.directive(FuiPasswordContainer));
        containerEl = containerDE.nativeElement;
        fixture.detectChanges();
      });

      it('should set the password type attribute', () => {
        expect(containerEl.querySelector('input').type).toEqual('password');
      });
    });
  });
}
