import { Directive, ElementRef, HostBinding, Input, OnDestroy, OnInit, Optional, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';

import { ControlIdService } from './providers/control-id.service';
import { NgControlService } from './providers/ng-control.service';

@Directive({ selector: 'label' })
export class FuiLabel implements OnInit, OnDestroy {
  constructor(
    @Optional() private controlIdService: ControlIdService,
    @Optional() private ngControlService: NgControlService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  @HostBinding('attr.for')
  @Input('for')
  forAttr: string;

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    // Only add the fui-control-label if it is inside a control container
    if (this.controlIdService || this.ngControlService) {
      this.renderer.addClass(this.el.nativeElement, 'fui-control-label');
    }
    if (this.controlIdService && !this.forAttr) {
      this.subscriptions.push(this.controlIdService.idChange.subscribe(id => (this.forAttr = id)));
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
