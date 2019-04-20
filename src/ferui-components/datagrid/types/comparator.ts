export interface FuiDatagridComparatorInterface<T> {
  compare(a: T, b: T): number;
}

export type FuiDatagridComparator = (a: any, b: any) => number;
