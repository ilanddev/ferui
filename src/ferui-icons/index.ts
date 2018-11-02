import { FeruiIconsApi } from './ferui-icons-api';
import { FeruiIconElement } from './ferui-icons-element';
import { CoreShapes } from './shapes/core-shapes';

const feruiIcons: FeruiIconsApi = FeruiIconsApi.instance;

feruiIcons.add(CoreShapes);

interface Window {
  FeruiIcons: any;
}

declare var window: Window;

// check if there is a global object called "FeruiIcons"
if (typeof window !== 'undefined') {
  if (!window.hasOwnProperty('FeruiIcons')) {
    // Setting a global object called "FeruiIcons" to expose the FeruiIconsApi.
    window.FeruiIcons = feruiIcons;
  }

  // Defining ferui-icon custom element
  customElements.define('ferui-icon', FeruiIconElement);
}

export { feruiIcons as FeruiIcons };
