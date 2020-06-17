import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Self
} from '@angular/core';
import {
  TreeViewColorTheme,
  TreeViewConfiguration,
  TreeViewEvent,
  TreeViewEventType,
  TreeNodeData,
  TreeNodeDataRetriever,
  PagedTreeNodeDataRetriever,
  NonRootTreeNode,
  PagingParams,
  TreeViewAutoNodeSelector,
  TreeNode,
  TreeNodeEvent
} from './interfaces';
import { FuiTreeViewComponentStyles, WrappedPromise } from './internal-interfaces';
import { FuiVirtualScrollerComponent } from '../virtual-scroller/virtual-scroller';
import { Subscription } from 'rxjs';
import { FuiTreeNodeComponent } from './tree-node-component';
import { FuiTreeViewUtilsService } from './tree-view-utils-service';
import { ScrollbarHelper } from '../utils/scrollbar-helper/scrollbar-helper.service';
import { DomObserver, ObserverInstance } from '../utils/dom-observer/dom-observer';

@Component({
  selector: 'fui-tree-view',
  template: `
    <div [ngStyle]="treeViewStyles" [ngClass]="colorTheme" class="fui-tree-view">
      <fui-virtual-scroller
        [hidden]="loading || error"
        #scroll
        class="fui-virtual-scroller"
        [items]="scrollViewArray"
        [bufferAmount]="domBufferAmount"
      >
        <fui-tree-node
          *ngFor="let node of scroll.viewPortItems"
          [node]="node"
          [theme]="colorTheme"
          [borders]="hasBorders"
          [dataRetriever]="dataRetriever"
          [treeviewConfig]="config"
          [siblingHasChildren]="firstLevelNodeHasChildren"
          (onNodeEvent)="nodeEvent($event)"
          (onFirstLevelNodeHasChildren)="onFirstLevelNode($event)"
        ></fui-tree-node>
      </fui-virtual-scroller>
      <div
        class="fui-tree-view-infinite-loader"
        *ngIf="serverSideComponent && scrollPromise"
        [style.width]="'80%'"
        [style.bottom.px]="1"
      ></div>
      <clr-icon *ngIf="loading" class="fui-loader fui-loader-animation" shape="fui-spinner"></clr-icon>
      <div *ngIf="error" class="error">
        <clr-icon class="fui-error-icon" shape="fui-error" aria-hidden="true"></clr-icon>
        <p>Couldn't load content</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'fui-tree-view-component'
  },
  providers: [FuiTreeViewUtilsService, ScrollbarHelper]
})
export class FuiTreeViewComponent<T> implements OnInit, OnDestroy {
  @Output() onNodeEvent: EventEmitter<TreeViewEvent<T>> = new EventEmitter<TreeViewEvent<T>>();

  @Input() treeNodeData: TreeNodeData<T>;
  @Input() dataRetriever: TreeNodeDataRetriever<T> | PagedTreeNodeDataRetriever<T>;
  @Input() config: TreeViewConfiguration;
  @Input() loading: boolean = false;
  @Input() error: boolean = false;
  @Input() autoNodeSelector?: TreeViewAutoNodeSelector<T>;

  @HostBinding('class.show-border') border: boolean;

  @ViewChild(FuiVirtualScrollerComponent) vs: FuiVirtualScrollerComponent;
  @ViewChildren(FuiTreeNodeComponent) children: QueryList<FuiTreeNodeComponent<T>>;

  treeViewStyles: FuiTreeViewComponentStyles;
  colorTheme: TreeViewColorTheme;
  scrollViewArray: TreeNode<T>[] = [];
  hasBorders: boolean = false;
  domBufferAmount: number = 10;
  scrollPromise: boolean = false;
  serverSideComponent: boolean = false;
  firstLevelNodeHasChildren: boolean = false; // only used for first top level of Tree Nodes

  private rootNode: TreeNode<T>;
  private nonRootArray: TreeNode<T>[];
  private nonRootArrayComplete: boolean = false;
  private scrollSubscription: Subscription;
  private scrollWidthChangeSub: Subscription;
  private originalWidth: number;
  private bufferAmount: number = 50;
  private defaultWidth: string = 'auto';
  private defaultHeight: string = '100%';
  private defaultColorScheme: TreeViewColorTheme = TreeViewColorTheme.WHITE;
  private nodeTreeHeight: number = 34;
  private cancelablePromises: WrappedPromise<T>[] = [];
  private domObserver: ObserverInstance;

  constructor(
    @Self() private el: ElementRef,
    private cd: ChangeDetectorRef,
    private treeViewUtils: FuiTreeViewUtilsService,
    private scrollbarHelper: ScrollbarHelper
  ) {}

  /**
   * Initializes the Tree View component and all properties needed depending on inputs configuration
   */
  ngOnInit(): void {
    this.serverSideComponent = this.dataRetriever.hasOwnProperty('getPagedChildNodeData');
    this.treeViewStyles = {
      width: this.config.width ? this.config.width : this.defaultWidth,
      height: this.config.height ? this.config.height : this.defaultHeight
    };
    this.scrollWidthChangeSub = this.treeViewUtils.treeViewScrollWidthChange.subscribe(() => this.updateScrollerWidth());
    this.colorTheme = this.config.colorVariation ? this.config.colorVariation : this.defaultColorScheme;
    this.border = this.hasBorders = this.config.hasBorders ? this.config.hasBorders : false;

    if (this.treeNodeData instanceof NonRootTreeNode) {
      const emptyRootNode = this.createTreeNode(this.treeNodeData, null);
      const params: PagingParams | null = this.serverSideComponent
        ? { offset: 0, limit: this.config.limit || this.bufferAmount }
        : null;
      this.getNodeData()(emptyRootNode.data, params).then(children => {
        this.nonRootArray = children.map(child => {
          return this.createTreeNode(child, null);
        });
        this.scrollViewArray = this.nonRootArray;
        if (this.autoNodeSelector && this.scrollViewArray.length > 0) {
          this.selectNode(this.autoNodeSelector.autoSelectNode(this.scrollViewArray.map(it => it.data)));
        }
        this.scrollSubHandler();
      });
    } else {
      this.rootNode = this.createTreeNode(this.treeNodeData, null);
      this.scrollViewArray = [this.rootNode];
      if (this.autoNodeSelector && this.scrollViewArray.length > 0) {
        this.selectNode(this.autoNodeSelector.autoSelectNode(this.scrollViewArray.map(it => it.data)));
      }
      this.scrollSubHandler();
    }
    this.domObserverHandler();
    this.cd.markForCheck();
  }

  /**
   * Destroys subscriptions if any
   */
  ngOnDestroy(): void {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
    if (this.scrollWidthChangeSub) {
      this.scrollWidthChangeSub.unsubscribe();
    }
    if (this.cancelablePromises.length > 0) {
      this.cancelablePromises.forEach(i => i.cancel());
    }
    if (this.domObserver) {
      DomObserver.unObserve(this.domObserver);
      this.domObserver = undefined;
    }
  }

  /**
   * Sets the original width of virtual scroller
   */
  ngAfterViewInit(): void {
    if (!this.originalWidth) {
      this.originalWidth = this.el.nativeElement.firstElementChild.clientWidth || parseInt(this.config.width, 10);
      this.config.width = this.originalWidth.toString();
      this.treeViewUtils.defaultScrollerWidth = this.originalWidth;
    }
  }

  /**
   * Public method to select a Tree Node
   *
   * @param nodeData
   */
  selectNode(nodeData: TreeNodeData<T>): void {
    this.scrollViewArray.forEach(it => (it.selected = JSON.stringify(it.data) === JSON.stringify(nodeData)));
    this.cd.markForCheck();
  }

  /**
   * Public method to expand a Tree Node
   *
   * @param nodeData
   */
  expandNode(nodeData: TreeNodeData<T>): void {
    const treeNode = this.scrollViewArray.find(it => JSON.stringify(it.data) === JSON.stringify(nodeData));
    if (treeNode) {
      this.selectOneNode(treeNode);
      this.handleExpandNode(treeNode, this.vs.viewPortInfo.startIndex, this.vs.viewPortInfo.endIndex);
    }
  }

  /**
   * Public method to collapse a Tree Node
   *
   * @param nodeData
   */
  collapseNode(nodeData: TreeNodeData<T>): void {
    const treeNode = this.scrollViewArray.find(it => JSON.stringify(it.data) === JSON.stringify(nodeData));
    if (treeNode) {
      this.handleCollapseNode(treeNode);
    }
  }

  /**
   * Emits the Node Event for outside Tree View Component usage as well as ensures tree nodes properties are updated
   * @param event
   */
  nodeEvent(event: TreeNodeEvent<T>): void {
    this.emitTreeViewEvent(event);
    switch (event.getType()) {
      case TreeViewEventType.NODE_EXPANDED:
        this.handleExpandNode(event.getNode(), this.vs.viewPortInfo.startIndex, this.vs.viewPortInfo.endIndex);
        break;
      case TreeViewEventType.NODE_COLLAPSED:
        this.handleCollapseNode(event.getNode());
        break;
      case TreeViewEventType.NODE_CLICKED:
        this.selectOneNode(event.getNode());
        break;
      default:
        break;
    }
  }

  /**
   * Event listener handler to check if any first level top tree nodes have children to adjust padding as needed for icons
   * @param event
   */
  onFirstLevelNode(event: boolean): void {
    if (event) {
      this.firstLevelNodeHasChildren = true;
    }
  }

  /**
   * Get either getChildNodeData or getPagedChildNodeData from data retriever depending its type.
   */
  private getNodeData(): (parent: TreeNodeData<T>, pagingParams?: PagingParams) => Promise<Array<TreeNodeData<T>>> {
    if (this.serverSideComponent) {
      return (this.dataRetriever as PagedTreeNodeDataRetriever<T>).getPagedChildNodeData;
    } else {
      return this.dataRetriever.getChildNodeData;
    }
  }

  /**
   * Updates virtual scroller width based on the view's children Tree Nodes widths to expand according to largest child
   */
  private updateScrollerWidth(): void {
    this.vs.setInternalWidth(this.treeViewUtils.virtualScrollerWidth + 'px');
    this.cd.markForCheck();
  }

  /**
   * Selects a TreeNode and deselects all other on the entire Tree View
   * @param node
   */
  private selectOneNode(node: TreeNode<T>): void {
    this.scrollViewArray.forEach(scrollItem => (scrollItem.selected = scrollItem === node));
  }

  /**
   * On any change of the scroll view array we rebuild to ensure view is updated correctly
   */
  private rebuildVirtualScrollerArray(): void {
    const aggregator = [];
    if (this.rootNode) {
      this.addNodeAndChildrenToVirtualScrollerArray(this.rootNode, aggregator);
    } else {
      for (const child of this.nonRootArray) {
        const shouldContinue = this.addNodeAndChildrenToVirtualScrollerArray(child, aggregator);
        if (!shouldContinue) {
          break;
        }
      }
    }
    this.scrollViewArray = aggregator;
    this.cd.markForCheck();
  }

  /**
   * Returns whether the child node branch is complete and all its children loaded
   * @param node
   * @param aggregator
   */
  private addNodeAndChildrenToVirtualScrollerArray(node: TreeNode<T>, aggregator: Array<TreeNode<T>>): boolean {
    aggregator.push(node);
    for (const child of node.children) {
      if (!this.addNodeAndChildrenToVirtualScrollerArray(child, aggregator)) {
        return false;
      }
    }
    return node.expanded === false || node.allChildrenLoaded;
  }

  /**
   * Gets the first child node with more children to load
   * @param node
   */
  private getFirstNodeWithMoreChildrenToLoad(node: TreeNode<T> | null): TreeNode<T> | null {
    if (node === null) {
      return null;
    }
    if (node.expanded === true && !node.allChildrenLoaded) {
      return node;
    }
    for (const child of node.children) {
      const childResult = this.getFirstNodeWithMoreChildrenToLoad(child);
      if (childResult !== null) {
        return childResult;
      }
    }
    return null;
  }

  /**
   * Handles the expansion of a Tree Node component
   * @param node
   * @param firstIdxInView
   * @param lastIdxInView
   */
  private async handleExpandNode(node: TreeNode<T>, firstIdxInView: number, lastIdxInView: number): Promise<void> {
    node.showLoader = node.expanded = true;
    await this.loadMoreNodes(node, this.bufferAmount + lastIdxInView - firstIdxInView, false);
    node.showLoader = false;
    this.rebuildVirtualScrollerArray();
    // On Expand: if original width is greater than nodes and scrollbar exists calculate to subtract scrollbar
    const nodesExpectedInView = this.el.nativeElement.firstElementChild.clientHeight / this.nodeTreeHeight;
    if (this.scrollbarHelper.getWidth() && nodesExpectedInView - this.scrollViewArray.length <= 0) {
      const biggestNodeWidth = this.scrollViewArray.reduce((acc, current) => {
        return current.width ? Math.max(acc, current.width) : acc;
      }, 0);
      let padding = 0;
      if (this.originalWidth > biggestNodeWidth) {
        // if container width is bigger than nodes width we will subtract to adjust scroller
        const diff = Math.abs(this.originalWidth - biggestNodeWidth);
        padding = diff > this.scrollbarHelper.getWidth() ? this.scrollbarHelper.getWidth() : diff;
        this.treeViewUtils.defaultScrollerWidth = this.originalWidth;
        this.vs.setInternalWidth(this.treeViewUtils.virtualScrollerWidth - padding + 'px');
        this.cd.markForCheck();
      }
    }
  }

  /**
   * Handles the collapse event of a Tree Node Component
   * @param node
   */
  private handleCollapseNode(node: TreeNode<T>): void {
    node.children = [];
    node.expanded = node.showLoader = node.loadError = false;
    node.allChildrenLoaded = false;
    this.rebuildVirtualScrollerArray();
    // Set the scroller width based on the largest TreeNode available, original width is only based on first load width
    const biggestNode = this.scrollViewArray.reduce((acc, current) => {
      return current.width ? Math.max(acc, current.width) : acc;
    }, 0);
    this.treeViewUtils.defaultScrollerWidth = Math.max(biggestNode, this.originalWidth);
    // On Collapse: If original width is greater than any node width and tree view is scrollable and scroll bar exists we
    // subtract the scroll bar width
    let spacing = 0;
    if (this.originalWidth > biggestNode && this.scrollbarHelper.getWidth()) {
      const nodesExpectedInView = this.el.nativeElement.firstElementChild.clientHeight / this.nodeTreeHeight;
      if (nodesExpectedInView - this.scrollViewArray.length <= 0) {
        spacing = this.scrollbarHelper.getWidth();
      }
    }
    this.vs.setInternalWidth(this.treeViewUtils.virtualScrollerWidth - spacing + 'px');
    this.cd.markForCheck();
  }

  /**
   * Handles the scroll event of the Tree View
   * @param lastIdxInView
   */
  private async handleScroll(lastIdxInView: number): Promise<void> {
    const numberNeeded = this.bufferAmount - (this.scrollViewArray.length - lastIdxInView);
    if (numberNeeded > 0 && !this.scrollPromise) {
      const parentNode: TreeNode<T> | null = this.scrollViewArray[lastIdxInView].parent;
      if ((parentNode === null && !this.nonRootArrayComplete) || this.getFirstNodeWithMoreChildrenToLoad(parentNode) != null) {
        this.scrollPromise = true;
        await this.loadMoreNodes(parentNode, numberNeeded, true);
        this.rebuildVirtualScrollerArray();
      }
    }
  }

  /**
   * Load more Tree Nodes
   *
   * @param node
   * @param numberToLoad the number of new nodes wanted
   * @param recurse when true, continues to load up to the number of nodes needed from the next
   * expanded node that has more children or the full set of tree nodes is loaded from current node. When false, only
   * attempts to load up to 'numberToLoad' from the selected node with an incomplete set of children.
   */
  private async loadMoreNodes(node: TreeNode<T>, numberToLoad: number, recurse: boolean) {
    const firstNodeWithMoreChildrenToLoad = this.getFirstNodeWithMoreChildrenToLoad(node);
    if (firstNodeWithMoreChildrenToLoad === null && this.treeNodeData instanceof NonRootTreeNode) {
      return this.getNonRootChildren(numberToLoad); // Scrolling through the top first level on a non root array
    }
    if (firstNodeWithMoreChildrenToLoad === null) {
      return;
    }
    let newChildren;
    if (this.serverSideComponent) {
      try {
        const cancelablePromise = this.makeCancelablePromise(
          (this.dataRetriever as PagedTreeNodeDataRetriever<T>).getPagedChildNodeData(firstNodeWithMoreChildrenToLoad.data, {
            offset: firstNodeWithMoreChildrenToLoad.children.length,
            limit: numberToLoad
          })
        );
        this.cancelablePromises.push(cancelablePromise);
        newChildren = await cancelablePromise.then(children => {
          return children.map(it => this.createTreeNode(it, firstNodeWithMoreChildrenToLoad));
        });
        this.cancelablePromises.pop();
      } catch (e) {
        this.cancelablePromises.pop();
        firstNodeWithMoreChildrenToLoad.showLoader = false;
        firstNodeWithMoreChildrenToLoad.loadError = firstNodeWithMoreChildrenToLoad.allChildrenLoaded = true;
        this.cd.markForCheck();
        throw e.message;
      }
    } else {
      newChildren = (await this.dataRetriever.getChildNodeData(firstNodeWithMoreChildrenToLoad.data)).map(it =>
        this.createTreeNode(it, firstNodeWithMoreChildrenToLoad)
      );
      firstNodeWithMoreChildrenToLoad.allChildrenLoaded = true;
    }
    firstNodeWithMoreChildrenToLoad.children = firstNodeWithMoreChildrenToLoad.children.concat(newChildren);
    this.scrollPromise = false;
    this.cd.markForCheck();
    if (newChildren.length < numberToLoad) {
      firstNodeWithMoreChildrenToLoad.allChildrenLoaded = true;
      if (recurse) {
        await this.loadMoreNodes(
          this.rootNode ? this.rootNode : this.nonRootArray[0],
          numberToLoad - newChildren.length,
          recurse
        );
      }
    }
  }

  /**
   * Handle scrolling on Non Root Server Side node and use the defined nonRoot array specifically
   * @param numberToLoad
   */
  private async getNonRootChildren(numberToLoad: number) {
    if (!this.nonRootArrayComplete) {
      const emptyRootNode = this.createTreeNode(this.treeNodeData, null);
      const children = await this.getNodeData()(emptyRootNode.data, { offset: this.scrollViewArray.length, limit: numberToLoad });
      this.nonRootArray = this.nonRootArray.concat(children.map(child => this.createTreeNode(child, null)));
      this.nonRootArrayComplete = children.length < numberToLoad;
    }
    this.scrollPromise = false;
  }

  /**
   * Wrap promise to add cancel method
   * @param promise
   */
  private makeCancelablePromise(promise: any): WrappedPromise<any> {
    let rejectFn;
    const wrappedPromise: WrappedPromise<any> = new Promise<any>((resolve, reject) => {
      rejectFn = reject;
      Promise.resolve(promise)
        .then(resolve)
        .catch(reject);
    }) as WrappedPromise<any>;
    wrappedPromise.cancel = () => {
      rejectFn({ canceled: true });
    };
    return wrappedPromise;
  }

  /**
   * Creates a TreeNode object
   *
   * @param treeNodeData
   * @param parentTreeNode
   */
  private createTreeNode(treeNodeData: TreeNodeData<T>, parentTreeNode: TreeNode<T> | null): TreeNode<T> {
    return {
      data: treeNodeData,
      selected: false,
      expanded: false,
      children: [],
      allChildrenLoaded: false,
      parent: parentTreeNode,
      showLoader: false,
      loadError: false
    };
  }

  /**
   * Emits the Tree View Event
   *
   * @param event
   */
  private emitTreeViewEvent(event: TreeNodeEvent<T>): void {
    this.onNodeEvent.emit({
      getNode: () => {
        return event.getNode().data;
      },
      getType: () => {
        return event.getType();
      }
    });
  }

  /**
   * Server side only.
   * Just subscribe to vsChange observable to track if we need to load more data.
   */
  private scrollSubHandler() {
    if (this.serverSideComponent) {
      this.bufferAmount = this.config.bufferAmount || this.bufferAmount;
      this.scrollSubscription = this.vs.vsChange.subscribe(pageInfo => {
        if (this.el.nativeElement.children.length > 0) {
          // check if view is full to ensure that the user is scrolling
          const nodesInView = pageInfo.endIndex - pageInfo.startIndex;
          const nodesExpectedInView = this.el.nativeElement.firstElementChild.clientHeight / this.nodeTreeHeight;
          if (nodesExpectedInView - nodesInView <= 0) {
            this.handleScroll(pageInfo.endIndex);
          }
        }
      });
    }
  }

  /**
   * Check if configuration width is a fixed pixel length, if not set a Dom Observer to adjust Tree View virtual scroller
   * width based on its container when any container size happens (including window resize)
   */
  private domObserverHandler(): void {
    if (!this.treeViewStyles.width.includes('px')) {
      this.domObserver = DomObserver.observe(this.el.nativeElement.firstChild, undefined, () => {
        this.originalWidth = this.el.nativeElement.firstElementChild.clientWidth;
        this.config.width = this.originalWidth.toString();
        const biggestNode = this.scrollViewArray.reduce((acc, current) => {
          return current.width ? Math.max(acc, current.width) : acc;
        }, 0);
        this.treeViewUtils.defaultScrollerWidth = Math.max(biggestNode, this.originalWidth);
        let padding = 0;
        if (this.originalWidth > biggestNode) {
          // if container width is bigger than nodes width we will subtract to adjust scroller
          const diff = Math.abs(this.originalWidth - biggestNode);
          padding = diff > this.scrollbarHelper.getWidth() ? this.scrollbarHelper.getWidth() : diff;
        }
        this.vs.setInternalWidth(this.treeViewUtils.virtualScrollerWidth - padding + 'px');
        this.cd.markForCheck();
      });
    }
  }
}
