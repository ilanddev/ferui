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
  Self,
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
} from './interfaces';
import { TreeNode, FuiTreeViewComponentStyles, TreeNodeEvent, WrappedPromise } from './internal-interfaces';
import { FuiVirtualScrollerComponent } from '../virtual-scroller/virtual-scroller';
import { Subscription } from 'rxjs';
import { FuiTreeNodeComponent } from './tree-node-component';
import { FuiTreeViewUtilsService } from './tree-view-utils-service';

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
          (onNodeEvent)="nodeEvent($event)"
        ></fui-tree-node>
      </fui-virtual-scroller>
      <div
        class="fui-tree-view-infinite-loader"
        *ngIf="serverSideComponent && scrollPromise"
        [style.width]="'80%'"
        [style.bottom.px]="hasBorders ? 1 : -9"
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
    class: 'fui-tree-view-component',
  },
  providers: [FuiTreeViewUtilsService],
})
export class FuiTreeViewComponent<T> implements OnInit, OnDestroy {
  @Input() treeNodeData: TreeNodeData<T>;

  @Input() dataRetriever: TreeNodeDataRetriever<T> | PagedTreeNodeDataRetriever<T>;

  @Input() config: TreeViewConfiguration;

  @Input() loading: boolean = false;

  @Input() error: boolean = false;

  @HostBinding('class.show-border') border: boolean;

  @ViewChild(FuiVirtualScrollerComponent) vs: FuiVirtualScrollerComponent;

  @ViewChildren(FuiTreeNodeComponent) children: QueryList<FuiTreeNodeComponent<T>>;

  @Output() onNodeEvent: EventEmitter<TreeViewEvent<T>> = new EventEmitter<TreeViewEvent<T>>();

  treeViewStyles: FuiTreeViewComponentStyles;
  colorTheme: TreeViewColorTheme;
  scrollViewArray: TreeNode<T>[];
  hasBorders: boolean;
  domBufferAmount: number = 10;
  scrollPromise: boolean = false;
  private rootNode: TreeNode<T>;
  private nonRootArray: TreeNode<T>[];
  private scrollSubscription: Subscription;
  private scrollWidthChangeSub: Subscription;
  private originalWidth: number;
  private bufferAmount: number = 50;
  private serverSideComponent: boolean = false;
  private defaultWidth: string = 'auto';
  private defaultHeight: string = '100%';
  private defaultColorScheme: TreeViewColorTheme = TreeViewColorTheme.WHITE;
  private nodeTreeHeight: number = 34;
  private cancelablePromises: WrappedPromise<T>[] = [];

  constructor(
    @Self() private el: ElementRef,
    private cd: ChangeDetectorRef,
    private treeViewUtils: FuiTreeViewUtilsService
  ) {}

  /**
   * Initializes the Tree View component and all properties needed depending on inputs configuration
   */
  ngOnInit(): void {
    this.serverSideComponent = this.dataRetriever.hasOwnProperty('getPagedChildNodeData');
    this.treeViewStyles = {
      width: this.config.width ? this.config.width : this.defaultWidth,
      height: this.config.height ? this.config.height : this.defaultHeight,
    };
    this.scrollWidthChangeSub = this.treeViewUtils.treeViewScrollWidthChange.subscribe(() => this.updateScrollerWidth());
    this.colorTheme = this.config.colorVariation ? this.config.colorVariation : this.defaultColorScheme;
    this.border = this.hasBorders = this.config.hasBorders ? this.config.hasBorders : false;
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
    if (this.treeNodeData instanceof NonRootTreeNode) {
      const emptyRootNode = this.createTreeNode(this.treeNodeData, null);
      this.dataRetriever.getChildNodeData(emptyRootNode.data).then(children => {
        this.nonRootArray = children.map(child => {
          return this.createTreeNode(child, null);
        });
        this.scrollViewArray = this.nonRootArray;
        this.cd.markForCheck();
      });
    } else {
      this.rootNode = this.createTreeNode(this.treeNodeData, null);
      this.scrollViewArray = [this.rootNode];
      this.cd.markForCheck();
    }
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
  }

  /**
   * Sets the original width of virtual scroller
   */
  ngAfterViewInit(): void {
    if (!this.originalWidth) {
      this.originalWidth = this.el.nativeElement.firstElementChild.clientWidth;
      this.treeViewUtils.defaultScrollerWidth = this.originalWidth;
    }
  }

  /**
   * Public method to select a Tree Node
   *
   * @param {TreeNodeData<T>} nodeData
   */
  public selectNode(nodeData: TreeNodeData<T>): void {
    this.scrollViewArray.forEach(it => (it.selected = JSON.stringify(it.data) === JSON.stringify(nodeData)));
    this.cd.markForCheck();
  }

  /**
   * Public method to expand a Tree Node
   *
   * @param {TreeNodeData<T>} nodeData
   */
  public expandNode(nodeData: TreeNodeData<T>): void {
    const treeNode = this.scrollViewArray.find(it => JSON.stringify(it.data) === JSON.stringify(nodeData));
    if (treeNode) {
      this.selectOneNode(treeNode);
      this.handleExpandNode(treeNode, this.vs.viewPortInfo.startIndex, this.vs.viewPortInfo.endIndex);
    }
  }

  /**
   * Public method to collapse a Tree Node
   *
   * @param {TreeNodeData<T>} nodeData
   */
  public collapseNode(nodeData: TreeNodeData<T>): void {
    const treeNode = this.scrollViewArray.find(it => JSON.stringify(it.data) === JSON.stringify(nodeData));
    if (treeNode) {
      this.handleCollapseNode(treeNode);
    }
  }

  /**
   * Updates virtual scroller width based on the view's children Tree Nodes widths to expand according to largest child
   */
  private updateScrollerWidth(): void {
    let max = this.treeViewUtils.virtualScrollerWidth;
    // takes into consideration padding
    max =
      max > this.originalWidth ? (this.border ? max : max + 20) : this.border ? this.originalWidth : this.originalWidth - 20;
    this.vs.contentElementRef.nativeElement.style.width = max + 'px';
    this.cd.markForCheck();
  }

  /**
   * Emits the Node Event for outside Tree View Component usage as well as ensures tree nodes properties are updated
   * @param {TreeViewEvent<any>} event
   */
  private nodeEvent(event: TreeNodeEvent<T>): void {
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
   * Selects a TreeNode and deselects all other on the entire Tree View
   * @param {TreeNode<any>} node
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
        this.addNodeAndChildrenToVirtualScrollerArray(child, aggregator);
      }
    }
    this.scrollViewArray = aggregator;
    this.cd.markForCheck();
  }

  /**
   * Returns whether the child node branch is complete and all its children loaded
   * @param {TreeNode<T>} node
   * @param {Array<TreeNode<T>>} aggregator
   * @returns {boolean}
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
   * @param {TreeNode<T>} node
   * @returns {TreeNode<T>}
   */
  private getFirstNodeWithMoreChildrenToLoad(node: TreeNode<T>): TreeNode<T> | null {
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
   * @param {TreeNode<T>} node
   * @param {number} firstIdxInView
   * @param {number} lastIdxInView
   * @returns {Promise<void>}
   */
  private async handleExpandNode(node: TreeNode<T>, firstIdxInView: number, lastIdxInView: number): Promise<void> {
    node.showLoader = node.expanded = true;
    await this.loadMoreNodes(node, this.bufferAmount + lastIdxInView - firstIdxInView, false);
    node.showLoader = false;
    this.rebuildVirtualScrollerArray();
  }

  /**
   * Handles the collapse event of a Tree Node Component
   * @param {TreeNode<T>} node
   * @returns {void}
   */
  private handleCollapseNode(node: TreeNode<T>): void {
    node.children = [];
    node.expanded = node.showLoader = node.loadError = false;
    node.allChildrenLoaded = false;
    this.rebuildVirtualScrollerArray();
    this.treeViewUtils.defaultScrollerWidth = this.originalWidth;
    this.updateScrollerWidth();
  }

  /**
   * Handles the scroll event of the Tree View
   * @param {number} lastIdxInView
   * @returns {Promise<void>}
   */
  private async handleScroll(lastIdxInView: number): Promise<void> {
    const numberNeeded = this.bufferAmount - (this.scrollViewArray.length - lastIdxInView);
    if (numberNeeded > 0 && !this.scrollPromise) {
      if (this.getFirstNodeWithMoreChildrenToLoad(this.scrollViewArray[lastIdxInView].parent) != null) {
        this.scrollPromise = true;
        await this.loadMoreNodes(this.scrollViewArray[lastIdxInView].parent, numberNeeded, true);
        this.rebuildVirtualScrollerArray();
      }
    }
  }

  /**
   * Load more Tree Nodes
   *
   * @param {TreeNode<T>} node
   * @param {number} numberToLoad the number of new nodes wanted
   * @param {boolean} recurse when true, continues to load up to the number of nodes needed from the next
   * expanded node that has more children or the full set of tree nodes is loaded from current node. When false, only
   * attempts to load up to 'numberToLoad' from the selected node with an incomplete set of children.
   * @returns {Promise<void>}
   */
  private async loadMoreNodes(node: TreeNode<T>, numberToLoad: number, recurse: boolean) {
    const firstNodeWithMoreChildrenToLoad = this.getFirstNodeWithMoreChildrenToLoad(node);
    if (firstNodeWithMoreChildrenToLoad === null) {
      return;
    }
    let newChildren;
    if (this.serverSideComponent) {
      try {
        const cancelablePromise = this.makeCancelablePromise(
          (this.dataRetriever as PagedTreeNodeDataRetriever<T>).getPagedChildNodeData(firstNodeWithMoreChildrenToLoad.data, {
            offset: firstNodeWithMoreChildrenToLoad.children.length,
            limit: numberToLoad,
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
   * Wrap promise to add cancel method
   * @param promise
   * @returns {WrappedPromise<any>}
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
   * @param {TreeNodeData<T>} treeNodeData
   * @param {TreeNode<T>} parentTreeNode
   * @returns {TreeNode<T>}
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
      loadError: false,
    };
  }

  /**
   * Emits the Tree View Event
   *
   * @param {TreeNodeEvent<T>} event
   */
  private emitTreeViewEvent(event: TreeNodeEvent<T>): void {
    this.onNodeEvent.emit({
      getNode: () => {
        return event.getNode().data;
      },
      getType: () => {
        return event.getType();
      },
    });
  }
}
