import {
  Directive,
  ElementRef,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  Self,
  ViewContainerRef
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NgControl } from '@angular/forms';

import { FuiPasswordContainer, ToggleService } from './password-container';
import { WrappedFormControl } from '../common/wrapped-control';

@Directive({
  selector: '[fuiPassword]',
  host: { '[class.fui-input]': 'true' }
})
export class FuiPassword extends WrappedFormControl<FuiPasswordContainer> implements OnInit, OnDestroy {
  protected index = 1;

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef,
    @Optional()
    @Inject(ToggleService)
    private toggleService: BehaviorSubject<boolean>
  ) {
    super(vcr, FuiPasswordContainer, injector, control, renderer, el);

    this.subscriptions.push(
      this.toggleService.subscribe(toggle => {
        renderer.setProperty(el.nativeElement, 'type', toggle ? 'text' : 'password');
      })
    );
  }
}
