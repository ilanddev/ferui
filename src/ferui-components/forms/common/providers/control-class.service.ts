import { Injectable } from '@angular/core';

@Injectable()
export class ControlClassService {
  className = '';

  controlClass(invalid = false, additional: string | Array<string> = '') {
    let controlClasses: Array<string> = [this.cleanClasses()];
    if (additional !== '' && typeof additional === 'string') {
      controlClasses.push(additional);
    } else if (additional instanceof Array) {
      controlClasses = controlClasses.concat(additional);
    }
    if (invalid) {
      controlClasses.push('fui-error');
    }
    return controlClasses.join(' ').trim();
  }

  initControlClass(element: HTMLElement) {
    if (element && element.className) {
      this.className = element.className;
    }
  }

  private cleanClasses(): string {
    const klassName = this.className.split(' ');
    return klassName.filter(c => {
      return c.indexOf('fui-') === -1;
    }).join(' ').trim();
  }
}
