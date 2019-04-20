import { Injectable } from '@angular/core';

// Original JavaScript code by Chirp Internet: www.chirp.com.au
// Please acknowledge use of this code by including this header.
// Forked and adapted from https://www.the-art-of-web.com/javascript/search-highlight/
@Injectable()
export class HilitorService {
  // private variables
  private readonly hiliteTag: string = 'MARK';
  private readonly hiliteClass: string = 'fui-datagrid-search-term';
  private readonly skipTags: RegExp = new RegExp('^(?:' + this.hiliteTag + '|SCRIPT|FORM|SPAN)$');

  private targetNode: HTMLElement;
  private matchRegExp: RegExp = null;
  private openLeft: boolean = false;
  private openRight: boolean = false;
  // characters to strip from start and end of the input string
  private endRegExp = new RegExp('^[^\\w]+|[^\\w]+$', 'g');
  // characters used to break up the input string into words
  private breakRegExp = new RegExp("[^\\w'-]+", 'g');

  setTargetNode(id: string) {
    this.targetNode = document.getElementById(id) || document.body;
  }

  setEndRegExp(regex) {
    this.endRegExp = regex;
    return this.endRegExp;
  }

  setBreakRegExp(regex) {
    this.breakRegExp = regex;
    return this.breakRegExp;
  }

  setMatchType(type) {
    switch (type) {
      case 'left':
        this.openLeft = false;
        this.openRight = true;
        break;
      case 'right':
        this.openLeft = true;
        this.openRight = false;
        break;
      case 'open':
        this.openLeft = this.openRight = true;
        break;
      default:
        this.openLeft = this.openRight = false;
    }
  }

  getRegex() {
    let retval = this.matchRegExp.toString();
    retval = retval.replace(/(^\/(\\b)?|\(|\)|(\\b)?\/i$)/g, '');
    retval = retval.replace(/\|/g, ' ');
    return retval;
  }

  // remove highlighting
  remove() {
    const arr: HTMLCollectionOf<Element> = this.targetNode.getElementsByClassName(this.hiliteClass);
    while (arr.length) {
      const el = arr[0];
      const parent = el.parentNode;
      parent.replaceChild(el.firstChild, el);
      parent.normalize();
    }
  }

  // start highlighting at target node
  apply(input: string) {
    this.remove();
    input = input ? input.replace(/(^\s+|\s+$)/g, '') : null;
    if (!input) {
      return;
    }
    if (this.setRegex(input)) {
      this.hiliteWords(this.targetNode);
    }
    return this.matchRegExp;
  }

  private setRegex(input) {
    input = input.replace(this.endRegExp, '');
    input = input.replace(this.breakRegExp, '|');
    input = input.replace(/^\||\|$/g, '');
    if (input) {
      let re = '(' + input + ')';
      if (!this.openLeft) {
        re = '\\b' + re;
      }
      if (!this.openRight) {
        re = re + '\\b';
      }
      this.matchRegExp = new RegExp(re, 'i');
      return this.matchRegExp;
    }
    return false;
  }

  // recursively apply word highlighting
  private hiliteWords(node) {
    if (node === undefined || !node) {
      return;
    }
    if (!this.matchRegExp) {
      return;
    }
    if (this.skipTags.test(node.nodeName)) {
      return;
    }
    if (node.hasChildNodes()) {
      node.childNodes.forEach(childNode => {
        this.hiliteWords(childNode);
      });
    }

    if (node.nodeType === 3) {
      // NODE_TEXT
      const nv: string = node.nodeValue;
      const regs: RegExpExecArray | null = this.matchRegExp.exec(nv);
      if (nv && regs) {
        const match = document.createElement(this.hiliteTag);
        match.className = this.hiliteClass;
        match.appendChild(document.createTextNode(regs[0]));
        const after = node.splitText(regs.index);
        after.nodeValue = after.nodeValue.substring(regs[0].length);
        node.parentNode.insertBefore(match, after);
      }
    }
  }
}
