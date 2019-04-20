import { FuiDatagridSortDirections } from '../types/sort-directions.enum';
import { Column } from '../components/entities/column';
import { FuiFieldTypes } from '../types/field-types.enum';

/**
 * Adapted from ngx-datatable
 * https://github.com/swimlane/ngx-datatable/blob/master/src/utils/sort.ts#L30
 */
export function orderByComparator(a: any, b: any): number {
  if (a === null || typeof a === 'undefined') {
    a = 0;
  }
  if (b === null || typeof b === 'undefined') {
    b = 0;
  }

  // The < and > operators call the Object.prototype.valueOf() function for each operand,
  // then compare the values. This means that a < or > comparison between two dates calls the Date.prototype.valueOf() function
  // for each date object before comparing the values, giving an accurate, absolute comparison.
  // https://www.ecma-international.org/ecma-262/5.1/#sec-11.8.5
  if (a instanceof Date && b instanceof Date) {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
  } else if (isNaN(parseFloat(a)) || !isFinite(a) || (isNaN(parseFloat(b)) || !isFinite(b))) {
    // Convert to string in case of a=0 or b=0
    a = String(a);
    b = String(b);
    // Isn't a number so lowercase the string to properly compare
    if (a.toLowerCase() < b.toLowerCase()) {
      return -1;
    }
    if (a.toLowerCase() > b.toLowerCase()) {
      return 1;
    }
  } else {
    // Parse strings as numbers to compare properly
    if (parseFloat(a) < parseFloat(b)) {
      return -1;
    }
    if (parseFloat(a) > parseFloat(b)) {
      return 1;
    }
  }

  // equal each other
  return 0;
}

/**
 * Sort all rows without touching the original array.
 * @param rows
 * @param columns
 */
export function sortRows(rows: any[], columns: Column[]): any[] {
  if (columns.length > 1) {
    // sort each columns by their sorting order (if multiple column sorting)
    columns.sort((a: Column, b: Column) => {
      const aOrder = a.sortOrder;
      const bOrder = b.sortOrder;
      let comparison = 0;
      if (aOrder > bOrder) {
        comparison = 1;
      } else if (aOrder < bOrder) {
        comparison = -1;
      }
      return comparison;
    });
  }
  /**
   * record the row ordering of results from prior sort operations (if applicable)
   * this is necessary to guarantee stable sorting behavior
   */
  const rowToIndexMap = new Map<any, number>();
  rows.forEach((row, index) => rowToIndexMap.set(row, index));

  const temp = [...rows];

  function manageFieldType(field, column) {
    if (column.sortType && column.sortType === FuiFieldTypes.DATE && !(field[column.getColId()] instanceof Date)) {
      return new Date(field[column.getColId()]);
    } else if (column.sortType && column.sortType === FuiFieldTypes.NUMBER) {
      return Number(field[column.getColId()]);
    } else {
      return field[column.getColId()];
    }
  }

  return temp.sort((a: any, b: any) => {
    for (const column of columns) {
      const propA = manageFieldType(a, column);
      const propB = manageFieldType(b, column);

      const comparison =
        column.getSort() !== FuiDatagridSortDirections.DESC
          ? column.sortComparator(propA, propB)
          : -column.sortComparator(propA, propB);

      // Don't return 0 yet in case of needing to sort by next property
      if (comparison !== 0) {
        return comparison;
      }
    }

    if (!(rowToIndexMap.has(a) && rowToIndexMap.has(b))) {
      return 0;
    }

    /**
     * all else being equal, preserve original order of the rows (stable sort)
     */
    return rowToIndexMap.get(a) < rowToIndexMap.get(b) ? -1 : 1;
  });
}
