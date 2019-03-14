import { ElementRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable()

/*********
 * @class IfOpenService
 *
 * @description
 * An injectable service used by IfOpen structural directives and the components that implemnt IfOpen in their
 * templates. It holds the value of the open state and provides an Observable that both the directive and the
 * implementing component can subscribe to in order to take action on open value changes.
 *
 */
export class IfOpenService {
  /**
   * Sometimes, we need to remember the event that triggered the toggling to avoid loops.
   * This is for instance the case of components that open on a click, but close on a click outside.
   */
  public originalEvent: any;

  /*********
   * @property _open
   *
   * @description
   * A property holding the current value for open/closed state of an IfOpen structural directive.
   *
   */
  private _open: boolean;

  /********
   * @property _openChange
   *
   * @description
   * A RXJS Subject that updates and provides subscriptions to for the current open state of a component template
   * implemting the IfOpen structural directive.
   */
  private _openChange: Subject<boolean> = new Subject<boolean>();

  /**
   *  Popovers might need to ignore click events on an element
   *  (eg: popover opens on focus on an input field. Clicks should be ignored in this case)
   */
  private _ignoredElementChange: Subject<ElementRef> = new Subject<ElementRef>();

  /*********
   *
   * @description
   * A getter function that provides an observable for the _opened Subject.
   *
   */
  get openChange(): Observable<boolean> {
    return this._openChange.asObservable();
  }

  /*********
   *
   * @description
   * A setter function that updates the current state of _open for this instance of IfOpen structural directive. And,
   * broadcasts the new value to all subscribers.
   *
   * @param value
   */
  set open(value: boolean) {
    value = !!value;
    if (this._open !== value) {
      this._open = value;
      this._openChange.next(value);
    }
  }

  /*********
   *
   * @description
   * A getter that returns the current value of this IfOpen instance.
   *
   */
  get open(): boolean {
    return this._open;
  }

  get ignoredElementChange(): Observable<ElementRef> {
    return this._ignoredElementChange.asObservable();
  }

  toggleWithEvent(event: any) {
    this.originalEvent = event;
    this.open = !this.open;
    delete this.originalEvent;
  }

  registerIgnoredElement(element: ElementRef) {
    this._ignoredElementChange.next(element);
  }
}
