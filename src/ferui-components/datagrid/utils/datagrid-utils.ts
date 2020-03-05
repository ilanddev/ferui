// @dynamic
export class DatagridUtils {
  private static isSafari: boolean;
  private static isIE: boolean;
  private static isEdge: boolean;
  private static isChrome: boolean;
  private static isFirefox: boolean;

  static isBrowserChrome(): boolean {
    if (this.isChrome === undefined) {
      const win = window as any;
      this.isChrome =
        (!!win.chrome && (!!win.chrome.webstore || !!win.chrome.runtime)) ||
        (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor));
    }
    return this.isChrome;
  }

  static isBrowserFirefox(): boolean {
    if (this.isFirefox === undefined) {
      const win = window as any;
      this.isFirefox = typeof win.InstallTrigger !== 'undefined';
    }
    return this.isFirefox;
  }

  static isBrowserSafari(): boolean {
    if (this.isSafari === undefined) {
      const anyWindow = window as any;
      // taken from https://github.com/ag-grid/ag-grid/issues/550
      this.isSafari =
        Object.prototype.toString.call(anyWindow.HTMLElement).indexOf('Constructor') > 0 ||
        (function(p) {
          return p ? p.toString() === '[object SafariRemoteNotification]' : false;
        })(!anyWindow.safari || anyWindow.safari.pushNotification);
    }
    return this.isSafari;
  }

  /**
   * https://stackoverflow.com/questions/24004791/can-someone-explain-the-debounce-function-in-javascript
   */
  static debounce(func: () => void, wait: number, immediate: boolean = false) {
    // 'private' variable for instance
    // The returned function will be able to reference this due to closure.
    // Each call to the returned function will share this common timer.
    let timeout: any;

    // Calling debounce returns a new anonymous function
    return function(...args: any[]) {
      // reference the context and args for the setTimeout function
      // tslint:disable-next-line
      const context = this;

      // Should the function be called now? If immediate is true
      //   and not already in a timeout then the answer is: Yes
      const callNow = immediate && !timeout;

      // This is the basic debounce behaviour where you can call this
      //   function several times, but it will only execute once
      //   [before or after imposing a delay].
      //   Each time the returned function is called, the timer starts over.
      window.clearTimeout(timeout);

      // Set the new timeout
      timeout = window.setTimeout(function() {
        // Inside the timeout function, clear the timeout variable
        // which will let the next execution run when in 'immediate' mode
        timeout = null;

        // Check if the function already ran with the immediate flag
        if (!immediate) {
          // Call the original function with apply
          // apply lets you define the 'this' object as well as the arguments
          //    (both captured before setTimeout)
          func.apply(context, args);
        }
      }, wait);

      // Immediate mode and no wait timer? Execute the function..
      if (callNow) {
        func.apply(context, args);
      }
    };
  }

  static removeFromArray<T>(array: T[], object: T) {
    if (array.indexOf(object) >= 0) {
      array.splice(array.indexOf(object), 1);
    }
  }

  static moveInArray<T>(array: T[], objectsToMove: T[], toIndex: number) {
    // first take out it items from the array
    objectsToMove.forEach(obj => {
      this.removeFromArray(array, obj);
    });

    // now add the objects, in same order as provided to us, that means we start at the end
    // as the objects will be pushed to the right as they are inserted
    objectsToMove
      .slice()
      .reverse()
      .forEach(obj => {
        this.insertIntoArray(array, obj, toIndex);
      });
  }

  static insertIntoArray<T>(array: T[], object: T, toIndex: number) {
    array.splice(toIndex, 0, object);
  }

  static clearElement(el: HTMLElement): void {
    while (el && el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  static missingOrEmpty(value: any[] | string | undefined): boolean {
    return !value || this.missing(value) || value.length === 0;
  }

  // returns true if the event is close to the original event by X pixels either vertically or horizontally.
  // we only start dragging after X pixels so this allows us to know if we should start dragging yet.
  static areEventsNear(e1: MouseEvent | Touch, e2: MouseEvent | Touch, pixelCount: number): boolean {
    // by default, we wait 4 pixels before starting the drag
    if (pixelCount === 0) {
      return false;
    }
    const diffX = Math.abs(e1.clientX - e2.clientX);
    const diffY = Math.abs(e1.clientY - e2.clientY);

    return Math.max(diffX, diffY) <= pixelCount;
  }

  static getScrollLeft(element: HTMLElement, rtl: boolean): number {
    let scrollLeft = element.scrollLeft;
    if (rtl) {
      // Absolute value - for FF that reports RTL scrolls in negative numbers
      scrollLeft = Math.abs(scrollLeft);

      // Get Chrome to return the same value as well
      if (this.isBrowserChrome()) {
        scrollLeft = element.scrollWidth - element.clientWidth - scrollLeft;
      }
    }
    return scrollLeft;
  }

  static setScrollLeft(element: HTMLElement, value: number, rtl: boolean): void {
    if (rtl) {
      // Chrome and Safari when doing RTL have the END position of the scroll as zero, not the start
      if (this.isBrowserSafari() || this.isBrowserChrome()) {
        value = element.scrollWidth - element.clientWidth - value;
      }
      // Firefox uses negative numbers when doing RTL scrolling
      if (this.isBrowserFirefox()) {
        value *= -1;
      }
    }
    element.scrollLeft = value;
  }

  static missing(value: any): boolean {
    return !this.exists(value);
  }

  static exists(value: any, allowEmptyString: boolean = false): boolean {
    return value != null && (value !== '' || allowEmptyString);
  }

  static sortNumberArray(numberArray: number[]): void {
    numberArray.sort((a: number, b: number) => a - b);
  }

  static getWindowSrollY(): number {
    return window.pageYOffset || document.documentElement.scrollTop;
  }

  static getWindowSrollX(): number {
    return window.pageXOffset || document.documentElement.scrollLeft;
  }

  static mergeObjects(object1, object2): object {
    return object2 ? { ...object1, ...object2 } : object1;
  }

  static mergeDeep<T>(target: T, source: T): T {
    const isObject = obj => obj && typeof obj === 'object';

    if (!isObject(target) || !isObject(source)) {
      return source;
    }

    Object.keys(source).forEach(key => {
      const targetValue = target[key];
      const sourceValue = source[key];

      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        target[key] = targetValue.concat(sourceValue);
      } else if (isObject(targetValue) && isObject(sourceValue)) {
        target[key] = DatagridUtils.mergeDeep(Object.assign({}, targetValue), sourceValue);
      } else {
        target[key] = sourceValue;
      }
    });

    return target;
  }

  static isNumeric(value: any): boolean {
    if (value === '' || value === null || value === undefined) {
      return false;
    }
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  static isObjectEmpty(object) {
    return Object.keys(object).length === 0 && object.constructor === Object;
  }

  static parseYyyyMmDdToDate(yyyyMmDd: string, separator: string): Date | null {
    try {
      if (!yyyyMmDd) {
        return null;
      }
      if (yyyyMmDd.indexOf(separator) === -1) {
        return null;
      }

      const fields: string[] = yyyyMmDd.split(separator);
      if (fields.length !== 3) {
        return null;
      }
      return new Date(Number(fields[0]), Number(fields[1]) - 1, Number(fields[2]));
    } catch (e) {
      return null;
    }
  }

  static serializeDateToYyyyMmDd(date: Date, separator: string): string | null {
    if (!date) {
      return null;
    }
    return (
      date.getFullYear() +
      separator +
      DatagridUtils.pad(date.getMonth() + 1, 2) +
      separator +
      DatagridUtils.pad(date.getDate(), 2)
    );
  }

  static pad(num: number, totalStringSize: number): string {
    let asString: string = num + '';
    while (asString.length < totalStringSize) {
      asString = '0' + asString;
    }
    return asString;
  }

  static toStringOrNull(value: any): string | null {
    if (this.exists(value) && value.toString) {
      return value.toString();
    } else {
      return null;
    }
  }

  static inRange(value: number, min: number, max: number) {
    return value >= min && value <= max;
  }

  static generateUniqueId(prefix: string = 'fui'): string {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return (
      prefix +
      '-' +
      Math.random()
        .toString(36)
        .substr(2, 9)
    );
  }

  static iterateObject<T>(object: { [p: string]: T } | T[] | undefined, callback: (key: string, value: T) => void) {
    if (!object || this.missing(object)) {
      return;
    }

    if (Array.isArray(object)) {
      object.forEach((value, index) => {
        callback(index + '', value);
      });
    } else {
      const keys = Object.keys(object);
      for (const key of keys) {
        const value = object[key];
        callback(key, value);
      }
    }
  }

  static assign(object: any, ...sources: any[]): any {
    sources.forEach(source => {
      if (this.exists(source)) {
        this.iterateObject(source, function(key: string, value: any) {
          object[key] = value;
        });
      }
    });

    return object;
  }
}
