import { Component, Inject, OnInit } from '@angular/core';
import { WINDOW } from '../../services/window.service';
import { IconShapeSources } from '@clr/icons/interfaces/icon-interfaces';
import * as jsBeautify from 'js-beautify';

interface Window {
  ClarityIcons: any;
}

@Component({
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss'],
})
export class IconsComponent implements OnInit {
  icons: {} = {};
  colorHex: string;
  iconsColor: string = '';
  iconsType: boolean = false;
  classes: string = 'icon-shape';
  iconsVariation: string = '';

  iconSizeExamples: string = jsBeautify.html(`
    <!--A. SETTING THE SIZE THROUGH CLR-ICON SIZE ATTRIBUTE-->
    <clr-icon shape="info-circle" size="12"></clr-icon>
    <clr-icon shape="info-circle" size="16"></clr-icon>
    <clr-icon shape="info-circle" size="36"></clr-icon>
    <clr-icon shape="info-circle" size="48"></clr-icon>
    <clr-icon shape="info-circle" size="64"></clr-icon>
    <clr-icon shape="info-circle" size="72"></clr-icon>

    <!--B. SETTING THE SIZE IN STYLE ATTRIBUTE-->
    <clr-icon shape="info-circle" style="width: 12px; height: 12px;"></clr-icon>
    <clr-icon shape="info-circle" style="width: 16px; height: 16px;"></clr-icon>
    <clr-icon shape="info-circle" style="width: 36px; height: 36px;"></clr-icon>
    <clr-icon shape="info-circle" style="width: 48px; height: 48px;"></clr-icon>
    <clr-icon shape="info-circle" style="width: 64px; height: 64px;"></clr-icon>
    <clr-icon shape="info-circle" style="width: 72px; height: 72px;"></clr-icon>`);

  iconRotateExample: string = jsBeautify.html(`
    <!--A. SETTING THE ROTATION DIRECTION THROUGH CLR-ICON SHAPE ATTRIBUTE-->
    <clr-icon shape="fui-caret up"></clr-icon>
    <clr-icon shape="fui-caret right"></clr-icon>
    <clr-icon shape="fui-caret down"></clr-icon>
    <clr-icon shape="fui-caret left"></clr-icon>
    
    <!--B. SETTING THE ROTATION DIRECTION THROUGH CLR-ICON DIR ATTRIBUTE-->
    <clr-icon shape="fui-caret" dir="up"></clr-icon>
    <clr-icon shape="fui-caret" dir="right"></clr-icon>
    <clr-icon shape="fui-caret" dir="down"></clr-icon>
    <clr-icon shape="fui-caret" dir="left"></clr-icon>
    
    <!--C. SETTING THE ROTATION DIRECTION IN STYLE ATTRIBUTE-->
    <clr-icon shape="fui-caret" style="transform: rotate(0deg);"></clr-icon>
    <clr-icon shape="fui-caret" style="transform: rotate(90deg);"></clr-icon>
    <clr-icon shape="fui-caret" style="transform: rotate(180deg);"></clr-icon>
    <clr-icon shape="fui-caret" style="transform: rotate(270deg);"></clr-icon>`);

  iconFlipExample: string = jsBeautify.html(`
    <clr-icon shape="fui-step-forward"></clr-icon>
    <clr-icon shape="fui-step-forward" flip="horizontal"></clr-icon>
    <clr-icon shape="fui-step-forward" flip="vertical"></clr-icon>`);

  private defaultColor: string = '03A6FF';

  constructor(@Inject(WINDOW) private window: Window) {
    this.colorHex = this.defaultColor;
  }

  ngOnInit() {
    // We get all icons from Ferui icons, including Clarity core ones.
    const clrIcons: IconShapeSources = this.window.hasOwnProperty('ClarityIcons') ? this.window.ClarityIcons.get() : {};
    this.icons = this.formatIcons(clrIcons);
    // Display FerUI icons in first position
    [this.icons[0], this.icons[1]] = [this.icons[1], this.icons[0]];

    this.changeColor(this.defaultColor);
    this.changeIconsVariation(this.iconsVariation);
  }

  changeColor(value: string): void {
    if (this.isValidHexNumber(value)) {
      this.iconsColor = `#${value}`;
    } else {
      this.iconsColor = this.defaultColor;
    }
  }

  changeIconsType(type: boolean): void {
    if (type) {
      this.classes = this.classes + ' is-solid';
    } else {
      this.classes = this.classes.replace(' is-solid', '');
    }
  }

  changeIconsVariation(variation: string): void {
    if (variation === '') {
      this.classes = this.classes.replace(/ has-badge| has-alert/g, '');
    } else if (variation === 'badge') {
      this.classes = this.classes + ' has-badge';
      this.classes = this.classes.replace(/ has-alert/g, '');
    } else if (variation === 'alert') {
      this.classes = this.classes + ' has-alert';
      this.classes = this.classes.replace(/ has-badge/g, '');
    }
  }

  formatIcons(icons: IconShapeSources): Array<any> {
    const list: Array<any> = Object.keys(icons).map(i => {
      return {
        name: i,
        group: i.match(/fui/g) ? 'ferui' : 'clarity',
      };
    });
    const grouppedList = this.groupBy(list, icon => {
      return icon.group;
    });
    return grouppedList.map(value => {
      return {
        gName: value[0].group,
        rows: this.generateRows(value, 6),
      };
    });
  }

  generateRows(array: Array<any>, nElements: number = 4): Array<any> {
    const rows: Array<any> = [];
    let items: Array<any> = [];
    let idx = 0;
    let loopIdx = 0;
    for (const item of array) {
      items.push(item);
      idx++;
      loopIdx++;
      if (loopIdx === array.length && idx !== nElements) {
        rows.push(items);
      }
      if (idx === nElements) {
        rows.push(items);
        // Reset
        items = [];
        idx = 0;
      }
    }
    return rows;
  }

  groupBy(array: Array<any>, f: Function): Array<any> {
    const groups = {};
    for (const o of array) {
      const group = JSON.stringify(f(o));
      if (!groups.hasOwnProperty(group)) {
        groups[group] = [];
      }
      groups[group].push(o);
    }
    return Object.keys(groups).map(group => {
      return groups[group];
    });
  }

  isValidHexNumber(s: string): boolean {
    const re = /[0-9A-Fa-f]{6}/g;
    return re.test(s);
  }
}
