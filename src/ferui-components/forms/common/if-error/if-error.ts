import { Directive, Input, Optional, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { IfErrorService } from './if-error.service';
import { NgControlService } from '../providers/ng-control.service';
import { NgControl } from '@angular/forms';

@Directive({ selector: '[fuiIfError]' })
export class FuiIfError {
  @Input('fuiIfError') error: string;

  private subscriptions: Subscription[] = [];
  private displayed: boolean = false;
  private control: NgControl;

  @Input()
  set displayOn(condition: boolean) {
    this.displayError(!condition);
  }

  constructor(
    @Optional() private ifErrorService: IfErrorService,
    @Optional() private ngControlService: NgControlService,
    private template: TemplateRef<any>,
    private container: ViewContainerRef
  ) {
    if (!this.ifErrorService) {
      throw new Error('fuiIfError can only be used within a form control container element like fui-input-container');
    } else {
      this.displayError(false);
    }
    this.subscriptions.push(
      this.ngControlService.controlChanges.subscribe(control => {
        this.control = control;
      })
    );
    this.subscriptions.push(
      this.ifErrorService.statusChanges.subscribe(invalid => {
        // If there is a specific error to track, check it, otherwise check overall validity
        if (this.error && this.control) {
          this.displayError(this.control.hasError(this.error));
        } else {
          this.displayError(invalid);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private displayError(invalid: boolean) {
    if (invalid && !this.displayed) {
      this.container.createEmbeddedView(this.template);
      this.displayed = true;
    } else if (!invalid && this.displayed) {
      this.container.clear();
      this.displayed = false;
    }
  }
}
