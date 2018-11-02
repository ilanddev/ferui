/**
 * We declare the module variable provided by the CommonJS module format,
 * so that the Typescript knows about it.
 */
declare var window: Window;

interface Window {
  FeruiIcons: any;
}

interface FeruiIconElement extends HTMLElement {
  feruiIconUniqId: string;
}
