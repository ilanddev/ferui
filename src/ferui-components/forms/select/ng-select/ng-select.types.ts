export interface NgOption {
  index?: number;
  htmlId?: string;
  selected?: boolean;
  disabled?: boolean;
  marked?: boolean;
  label?: string;
  value?: string | Object;
  parent?: NgOption;
  children?: NgOption[];

  [name: string]: any;
}

export enum KeyCode {
  Tab = 9,
  Enter = 13,
  Esc = 27,
  Space = 32,
  ArrowUp = 38,
  ArrowDown = 40,
  Backspace = 8
}
