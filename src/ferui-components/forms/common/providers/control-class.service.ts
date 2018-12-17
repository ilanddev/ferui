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

  initControlClass(renderer, element: HTMLElement) {
    if (element && element.className) {
      this.className = element.className;
      const klasses = element.className.split(' ');
      klasses.forEach(klass => {
        if (klass.startsWith('fui-')) {
          renderer.removeClass(element, klass);
        }
      });
    }
  }

  private cleanClasses(): string {
    const klassName = this.className.split(' ');
    return klassName
      .filter(c => {
        return c.indexOf('fui-') === -1;
      })
      .join(' ')
      .trim();
  }
}
