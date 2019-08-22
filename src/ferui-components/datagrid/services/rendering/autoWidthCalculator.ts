import { Injectable } from '@angular/core';
import { RowRendererService } from './row-renderer.service';
import { FuiDatagridOptionsWrapperService } from '../datagrid-options-wrapper.service';
import { Column } from '../../components/entities/column';
import { HeaderRendererService } from './header-renderer.service';
import { FuiHeaderCell } from '../../components/header/header-cell';
import { FuiDatagridSortDirections } from '../../types/sort-directions.enum';

@Injectable()
export class AutoWidthCalculator {
  constructor(
    private headerRowRendererService: HeaderRendererService,
    private rowRendererService: RowRendererService,
    private optionsWrapperService: FuiDatagridOptionsWrapperService
  ) {}

  // this is the trick: we create a dummy container and clone all the cells
  // into the dummy, then check the dummy's width. then destroy the dummy
  // as we don't need it any more.
  // drawback: only the cells visible on the screen are considered
  getPreferredWidthForColumn(column: Column, eBodyContainer: HTMLElement): number {
    const eHeaderCell = this.getHeaderCellForColumn(column);
    // cell isn't visible
    if (!eHeaderCell) {
      return -1;
    }

    const eDummyContainer = document.createElement('span');
    // position fixed, so it isn't restricted to the boundaries of the parent
    eDummyContainer.style.position = 'fixed';

    // we put the dummy into the body container, so it will inherit all the
    // css styles that the real cells are inheriting
    eBodyContainer.appendChild(eDummyContainer);

    // get all the cells that are currently displayed (this only brings back
    // rendered cells, rows not rendered due to row visualisation will not be here)
    this.putRowCellsIntoDummyContainer(column, eDummyContainer);

    // also put header cell in
    // we only consider the lowest level cell, not the group cell. in 99% of the time, this
    // will be enough. if we consider groups, then it gets to complicated for what it's worth,
    // as the groups can span columns and this class only considers one column at a time.
    this.cloneItemIntoDummy(eHeaderCell, eDummyContainer);

    // at this point, all the clones are lined up vertically with natural widths. the dummy
    // container will have a width wide enough just to fit the largest.
    const dummyContainerWidth = eDummyContainer.offsetWidth;

    // we are finished with the dummy container, so get rid of it
    eBodyContainer.removeChild(eDummyContainer);

    // we add padding as I found sometimes the gui still put '...' after some of the texts. so the
    // user can configure the grid to add a few more pixels after the calculated width
    const autoSizePadding = this.optionsWrapperService.getAutoSizePadding();

    // If the header has sorting, the badges add more size.
    const sortPadding: number = column.getExtraSortPaddingSize();

    return dummyContainerWidth + autoSizePadding + sortPadding;
  }

  private getHeaderCellForColumn(column: Column): HTMLElement {
    const cell: FuiHeaderCell = this.headerRowRendererService.getCellForColumn(column);
    return cell ? cell.element : null;
  }

  private putRowCellsIntoDummyContainer(column: Column, eDummyContainer: HTMLElement): void {
    const eCells = this.rowRendererService.getAllCellsForColumn(column);
    eCells.forEach(eCell => this.cloneItemIntoDummy(eCell.elementRef.nativeElement, eDummyContainer));
  }

  private cloneItemIntoDummy(eCell: HTMLElement, eDummyContainer: HTMLElement): void {
    // make a deep clone of the cell
    const eCellClone: HTMLElement = eCell.cloneNode(true) as HTMLElement;
    // the original has a fixed width, we remove this to allow the natural width based on content
    eCellClone.style.width = '';
    // the original has position = absolute, we need to remove this so it's positioned normally
    eCellClone.style.position = 'static';
    eCellClone.style.left = '';
    // we put the cell into a containing div, as otherwise the cells would just line up
    // on the same line, standard flow layout, by putting them into divs, they are laid
    // out one per line
    const eCloneParent = document.createElement('div');
    // table-row, so that each cell is on a row. i also tried display='block', but this
    // didn't work in IE
    eCloneParent.style.display = 'table-row';

    // the twig on the branch, the branch on the tree, the tree in the hole,
    // the hole in the bog, the bog in the clone, the clone in the parent,
    // the parent in the dummy, and the dummy down in the vall-e-ooo, OOOOOOOOO! Oh row the rattling bog....
    eCloneParent.appendChild(eCellClone);
    eDummyContainer.appendChild(eCloneParent);
  }
}
