import { Component, Inject, OnInit } from '@angular/core';
import { WINDOW } from '../../services/window.service';

interface Window {
  ClarityIcons: any;
}

@Component({
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss']
})
export class IconsComponent implements OnInit {

  private defaultColor: string = '03A6FF';

  icons: {} = {};
  colorHex: string = this.defaultColor;
  iconsColor: string = '';
  iconsType: boolean = false;
  classes: string = 'icon-shape';
  iconsVariation: string = '';

  constructor(@Inject(WINDOW) private window: Window) {
  }

  ngOnInit() {
    // We get all icons from Ferui icons, including Clarity core ones.
    const clrIcons: Array<any> = this.window.hasOwnProperty('ClarityIcons') ? this.window.ClarityIcons.get() : [];
    this.icons = this.formatIcons(clrIcons);
    this.changeColor(this.defaultColor);
    this.changeIconsVariation(this.iconsVariation);
  }

  changeColor(value: string): void {
    if (this.isValidHexNumber(value)) {
      this.iconsColor = `#${ value }`;
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

  formatIcons(icons: Array<any>) {
    const completeList: Array<any> = [];
    const list: Array<any> = [];
    for (const iconName in icons) {
      if (icons.hasOwnProperty(iconName)) {
        list.push({
          name: iconName,
          group: iconName.match(/fui/g) ? 'ferui' : 'clarity'
        });
      }
    }
    const grouppedList = this.groupBy(list, (icon) => {
      return icon.group;
    });
    for (const gIdx in grouppedList) {
      if (grouppedList.hasOwnProperty(gIdx)) {
        const groupName = grouppedList[gIdx][0].group;
        completeList.push({
          gName: groupName,
          rows: this.generateRows(grouppedList[gIdx], 6)
        });
      }
    }
    return completeList;
  }

  generateRows(array: Array<any>, nElements: number = 4): Array<any> {
    const rows: Array<any> = [];
    let items: Array<any> = [];
    let idx = 0;
    for (const item of array) {
      items.push(item);
      idx += 1;
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
    array.forEach((o) => {
      const group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map((group) => {
      return groups[group];
    });
  }

  isValidHexNumber(s: string): boolean {
    const re = /[0-9A-Fa-f]{6}/g;
    return re.test(s);
  }
}
