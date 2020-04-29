// @dynamic
import { FeruiUtils } from '../../utils/ferui-utils';

export class DatagridUtils extends FeruiUtils {
  // This is an util class, we shouldn't be able to create an instance of this.
  protected constructor() {
    super();
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

  static sortNumberArray(numberArray: number[]): void {
    numberArray.sort((a: number, b: number) => a - b);
  }

  static getWindowSrollY(): number {
    return window.pageYOffset || document.documentElement.scrollTop;
  }

  static getWindowSrollX(): number {
    return window.pageXOffset || document.documentElement.scrollLeft;
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
}
