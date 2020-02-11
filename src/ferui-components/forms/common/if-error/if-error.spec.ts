import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { NgControlService } from '../providers/ng-control.service';
import { IfErrorService } from './if-error.service';
import { FuiIfError } from './if-error';
import { ClrIconModule } from '@ferui/components';
import { FuiInput } from '../../input/input';
import { FuiControlError } from '../error';
import { FuiInputContainer } from '../../input/input-container';
import { FuiDefaultControlError } from '../default-error';

const errorMessage = 'ERROR_MESSAGE';
const minLengthMessage = 'MIN_LENGTH_MESSAGE';

@Component({
  template: `
    <div *fuiIfError></div>
  `
})
class InvalidUseTest {}

@Component({
  template: `
    <fui-control-error *fuiIfError>${errorMessage}</fui-control-error>
  `,
  providers: [IfErrorService, NgControlService]
})
class GeneralErrorTest {}

@Component({
  template: `
    <fui-control-error *fuiIfError="'required'">${errorMessage}</fui-control-error>
    <fui-control-error *fuiIfError="'minlength'">${minLengthMessage}</fui-control-error>
  `,
  providers: [IfErrorService, NgControlService]
})
class SpecificErrorTest {}

export default function(): void {
  describe('FuiIfError', () => {
    describe('invalid use', () => {
      it('throws error when used outside of a control container', () => {
        TestBed.configureTestingModule({ declarations: [FuiIfError, InvalidUseTest] });
        expect(() => {
          const fixture = TestBed.createComponent(InvalidUseTest);
          fixture.detectChanges();
        }).toThrow();
      });
    });

    describe('general error', () => {
      let fixture, ifErrorService, ngControlService;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrIconModule, FormsModule],
          declarations: [FuiInput, FuiControlError, FuiInputContainer, FuiDefaultControlError, FuiIfError, GeneralErrorTest]
        });
        fixture = TestBed.createComponent(GeneralErrorTest);
        fixture.detectChanges();
        ngControlService = fixture.debugElement.injector.get(NgControlService);
        ifErrorService = fixture.debugElement.injector.get(IfErrorService);
      });

      it('hides the error initially', () => {
        expect(fixture.nativeElement.innerHTML).not.toContain(errorMessage);
      });

      it('displays the error message after touched on general errors', () => {
        expect(fixture.nativeElement.innerHTML).not.toContain(errorMessage);
        const control = new FormControl('', Validators.required);
        control.markAsTouched();
        ngControlService.setControl(control);
        ifErrorService.triggerStatusChange();
        fixture.detectChanges();
        expect(fixture.nativeElement.innerHTML).toContain(errorMessage);
      });
    });

    describe('specific error', () => {
      let fixture, ifErrorService, ngControlService;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrIconModule, FormsModule],
          declarations: [FuiInput, FuiControlError, FuiInputContainer, FuiDefaultControlError, FuiIfError, SpecificErrorTest]
        });
        fixture = TestBed.createComponent(SpecificErrorTest);
        fixture.detectChanges();
        ngControlService = fixture.debugElement.injector.get(NgControlService);
        ifErrorService = fixture.debugElement.injector.get(IfErrorService);
      });

      it('hides the error initially', () => {
        expect(fixture.nativeElement.innerHTML).not.toContain(errorMessage);
      });

      it('displays the error when the specific error is defined', () => {
        expect(fixture.nativeElement.innerHTML).not.toContain(errorMessage);
        const control = new FormControl('', [Validators.required, Validators.minLength(5)]);
        control.markAsTouched();
        ngControlService.setControl(control);
        ifErrorService.triggerStatusChange();
        fixture.detectChanges();
        expect(fixture.nativeElement.innerHTML).toContain(errorMessage);
      });

      it('hides the message even when it is invalid due to a different validation error', () => {
        expect(fixture.nativeElement.innerHTML).not.toContain(errorMessage);
        const control = new FormControl('abc', [Validators.required, Validators.minLength(5)]);
        ngControlService.setControl(control);
        ifErrorService.triggerStatusChange();
        fixture.detectChanges();
        expect(fixture.nativeElement.innerHTML).not.toContain(errorMessage);
        expect(fixture.nativeElement.innerHTML).toContain(minLengthMessage);
      });
    });
  });
}
