import {
  AfterViewChecked,
  ElementRef,
  HostBinding,
  Injectable,
  Injector,
  OnDestroy,
  Optional,
  Renderer2,
  SkipSelf,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { IfOpenService } from '../../utils/conditional/if-open.service';
import { ESC } from '../../utils/key-codes/key-codes';

import { Point, Popover } from './popover';
import { PopoverOptions } from './popover-options.interface';

// Literally any annotation would work here, but writing our own @HoneyBadger annotation feels overkill.
@Injectable()
export abstract class AbstractPopover implements AfterViewChecked, OnDestroy {
  closeOnOutsideClick = false;

  protected el: ElementRef;
  protected ifOpenService: IfOpenService;
  protected renderer: Renderer2;

  protected anchorElem: any;
  protected anchorPoint: Point;
  protected popoverPoint: Point;
  protected popoverOptions: PopoverOptions = {};
  protected ignoredElement: any;

  private hostClickListener: () => void;
  private documentClickListener: () => void;
  private documentESCListener: () => void;
  private ignoredElementClickListener: () => void;
  private ignore: any;
  private popoverInstance: Popover;
  private subscription: Subscription;
  private updateAnchor = false;

  protected constructor(
    injector: Injector,
    @SkipSelf() protected parentHost: ElementRef,
    @Optional() forcedMarginTop?: number,
    @Optional() forcedMarginLeft?: number
  ) {
    this.el = injector.get(ElementRef);
    this.ifOpenService = injector.get(IfOpenService);
    this.renderer = injector.get(Renderer2);
    // Default anchor is the parent host
    this.anchorElem = parentHost.nativeElement;

    this.popoverInstance = new Popover(this.el.nativeElement, forcedMarginTop, forcedMarginLeft);
    this.subscription = this.ifOpenService.openChange.subscribe(change => {
      if (change) {
        this.anchor();
        this.attachESCListener();
      } else {
        this.release();
        this.detachESCListener();
      }
    });
    if (this.ifOpenService.open) {
      this.anchor();
      this.attachESCListener();
    }
  }

  ngAfterViewChecked() {
    if (this.updateAnchor) {
      this.updateAnchor = false;
      this.popoverInstance
        .anchor(this.anchorElem, this.anchorPoint, this.popoverPoint, this.popoverOptions)
        .subscribe(() => {
          // if a scroll event is detected, close the popover
          this.ifOpenService.open = false;
        });
      this.attachOutsideClickListener();
    }
  }

  ngOnDestroy() {
    this.release();
    this.detachESCListener();
    this.subscription.unsubscribe();
  }

  /*
     * Fallback to hide when *clrIfOpen is not being used
     */

  @HostBinding('class.is-off-screen')
  get isOffScreen() {
    return !this.ifOpenService.open;
  }

  protected anchor() {
    this.updateAnchor = true;
    // Ugh
    this.ignore = this.ifOpenService.originalEvent;
  }

  protected release() {
    this.detachOutsideClickListener();
    this.popoverInstance.release();
  }

  /*
     * Until https://github.com/angular/angular/issues/8785 is supported, we don't have any way to instantiate
     * a separate directive on the host. So let's do dirty but performant for now.
     */
  private attachESCListener(): void {
    this.documentESCListener = this.renderer.listen('document', 'keydown', event => {
      if (event && event.keyCode === ESC) {
        this.ifOpenService.open = false;
      }
    });
  }

  private detachESCListener(): void {
    if (this.documentESCListener) {
      this.documentESCListener();
      delete this.documentESCListener;
    }
  }

  private attachOutsideClickListener() {
    if (this.closeOnOutsideClick) {
      this.hostClickListener = this.renderer.listen(this.el.nativeElement, 'click', event => (this.ignore = event));
      if (this.ignoredElement) {
        this.ignoredElementClickListener = this.renderer.listen(
          this.ignoredElement,
          'click',
          event => (this.ignore = event)
        );
      }
      this.documentClickListener = this.renderer.listen('document', 'click', event => {
        if (event === this.ignore) {
          delete this.ignore;
        } else {
          this.ifOpenService.open = false;
        }
      });
    }
  }

  private detachOutsideClickListener() {
    if (this.closeOnOutsideClick) {
      if (this.hostClickListener) {
        this.hostClickListener();
        delete this.hostClickListener;
      }
      if (this.ignoredElementClickListener) {
        this.ignoredElementClickListener();
        delete this.ignoredElementClickListener;
      }
      if (this.documentClickListener) {
        this.documentClickListener();
        delete this.documentClickListener;
      }
    }
  }
}
