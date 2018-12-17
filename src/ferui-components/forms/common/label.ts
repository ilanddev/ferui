import { Directive, ElementRef, HostBinding, Input, OnDestroy, OnInit, Optional, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';

import { ControlIdService } from './providers/control-id.service';
import { NgControlService } from './providers/ng-control.service';
import { PlaceholderService } from './providers/placeholder.service';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

@Directive({ selector: 'label' })
export class FuiLabel implements OnInit, OnDestroy {
  constructor(
    @Optional() private controlIdService: ControlIdService,
    @Optional() private ngControlService: NgControlService,
    @Optional() private placeholderService: PlaceholderService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  @HostBinding('attr.for')
  @Input('for')
  forAttr: string;

  private placeholderChild: any;
  private labelRequiredChild: any;
  private subscriptions: Subscription[] = [];
  private _labelRequired: Subject<boolean> = new Subject<boolean>();

  get _isLabelRequired(): Observable<boolean> {
    return this._labelRequired.asObservable();
  }

  setLabelRequired(required: boolean) {
    this._labelRequired.next(required);
  }

  ngOnInit() {
    // Only add the fui-control-label if it is inside a control container
    if (this.controlIdService || this.ngControlService) {
      this.renderer.addClass(this.el.nativeElement, 'fui-control-label');

      this._isLabelRequired.subscribe(isRequired => {
        if (this.labelRequiredChild) {
          this.renderer.removeChild(this.el.nativeElement, this.labelRequiredChild);
        }
        if (isRequired) {
          this.labelRequiredChild = this.renderer.createElement('span');
          this.renderer.addClass(this.labelRequiredChild, 'fui-label-required-star');
          this.renderer.appendChild(this.labelRequiredChild, this.renderer.createText('*'));
          // We add the star just after the label text.
          this.renderer.appendChild(this.el.nativeElement, this.labelRequiredChild);
        }
      });
      // If there is a placeholder set over the control.
      if (this.placeholderService) {
        this.subscriptions.push(
          this.placeholderService.placeholderChanges.subscribe(value => {
            if (this.placeholderChild) {
              this.renderer.removeChild(this.el.nativeElement, this.placeholderChild);
            }
            if (value) {
              this.placeholderChild = this.renderer.createElement('span');
              this.renderer.addClass(this.placeholderChild, 'fui-placeholder');
              this.renderer.appendChild(this.placeholderChild, this.renderer.createText(value));
              // We add the placeholder text just after the label one.
              this.renderer.appendChild(this.el.nativeElement, this.placeholderChild);
            }
          })
        );
      }
    }
    if (this.controlIdService && !this.forAttr) {
      this.subscriptions.push(this.controlIdService.idChange.subscribe(id => (this.forAttr = id)));
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
