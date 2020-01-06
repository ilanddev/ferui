export interface PopoverOptions {
  offsetX?: number;
  offsetY?: number;
  useAnchorParent?: boolean;
  allowMultipleOpen?: boolean;
}

export enum Point {
  RIGHT_CENTER,
  RIGHT_TOP,
  RIGHT_BOTTOM,
  TOP_CENTER,
  TOP_RIGHT,
  TOP_LEFT,
  BOTTOM_CENTER,
  BOTTOM_RIGHT,
  BOTTOM_LEFT,
  LEFT_CENTER,
  LEFT_TOP,
  LEFT_BOTTOM,
}
