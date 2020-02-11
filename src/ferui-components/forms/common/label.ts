import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Renderer2
} from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

import { ControlIdService } from './providers/control-id.service';
import { NgControlService } from './providers/ng-control.service';
import { PlaceholderService } from './providers/placeholder.service';
import { RequiredControlService } from './providers/required-control.service';

@Directive({ selector: 'label' })
export class FuiLabel implements OnInit, OnDestroy {
  @HostBinding('attr.tabindex') tabindex: number = 0;
  @HostBinding('attr.for')
  @Input('for')
  forAttr: string;

  @Output() focusChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _value: Subject<string> = new Subject<string>();
  private placeholderChild: HTMLSpanElement;
  private labelRequiredChild: HTMLSpanElement;
  private subscriptions: Subscription[] = [];

  constructor(
    @Optional() private readonly controlIdService: ControlIdService,
    @Optional() private readonly ngControlService: NgControlService,
    @Optional() private readonly placeholderService: PlaceholderService,
    @Optional() private readonly requiredControlService: RequiredControlService,
    private renderer: Renderer2,
    public elementRef: ElementRef
  ) {}

  ngOnInit() {
    // Only add the fui-control-label if it is inside a control container
    // We also avoid all 'fui-control-icons' labels.
    if (
      !this.elementRef.nativeElement.classList.contains('fui-control-icons') &&
      (this.controlIdService || this.ngControlService)
    ) {
      this.init();
    }
    this._value.next(this.elementRef.nativeElement.innerText);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  @HostListener('focus')
  onLabelFocused() {
    this.focusChange.emit(true);
    const element = document.getElementById(this.forAttr);
    if (element) {
      element.focus();
    }
  }

  @HostListener('blur')
  onLabelBlured() {
    this.focusChange.emit(false);
  }

  get value(): Observable<string> {
    return this._value.asObservable();
  }

  private init() {
    this.renderer.addClass(this.elementRef.nativeElement, 'fui-control-label');

    if (this.requiredControlService) {
      this.subscriptions.push(
        this.requiredControlService.requiredChange.subscribe(isRequired => {
          if (this.labelRequiredChild) {
            this.renderer.removeChild(this.elementRef.nativeElement, this.labelRequiredChild);
          }
          if (isRequired) {
            this.labelRequiredChild = this.renderer.createElement('span');
            this.renderer.addClass(this.labelRequiredChild, 'fui-label-required-star');
            this.renderer.appendChild(this.labelRequiredChild, this.renderer.createText('*'));
            // We add the star just after the label text.
            this.updateLabel();
          }
        })
      );
    }
    // If there is a placeholder set over the control.
    if (this.placeholderService) {
      this.subscriptions.push(
        this.placeholderService.placeholderChanges.subscribe(value => {
          if (this.placeholderChild) {
            this.renderer.removeChild(this.elementRef.nativeElement, this.placeholderChild);
          }
          if (value) {
            this.placeholderChild = this.renderer.createElement('span');
            this.renderer.addClass(this.placeholderChild, 'fui-placeholder');
            this.renderer.appendChild(this.placeholderChild, this.renderer.createText(value));
            // We add the placeholder text just after the label text or star (if the field is required).
            this.updateLabel();
          }
        })
      );
    }
    if (this.controlIdService && !this.forAttr) {
      this.subscriptions.push(this.controlIdService.idChange.subscribe(id => (this.forAttr = id)));
    }
  }

  private updateLabel() {
    if (this.labelRequiredChild) {
      this.renderer.appendChild(this.elementRef.nativeElement, this.labelRequiredChild);
    }
    if (this.placeholderChild) {
      this.renderer.appendChild(this.elementRef.nativeElement, this.placeholderChild);
    }
    this._value.next(this.elementRef.nativeElement.innerText);
  }
}
