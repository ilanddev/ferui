import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  TemplateRef,
  HostBinding,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Self,
  OnDestroy,
  DoCheck
} from '@angular/core';
import {
  TreeViewEventType,
  TreeNodeDataRetriever,
  PagedTreeNodeDataRetriever,
  TreeViewColorTheme,
  TreeViewConfiguration
} from './interfaces';
import { TreeNode, TreeNodeEvent } from './internal-interfaces';
import { FuiTreeViewUtilsService } from './tree-view-utils-service';
import { DomObserver, ObserverInstance } from '../utils/dom-observer/dom-observer';
import { ScrollbarHelper } from '../utils/scrollbar-helper/scrollbar-helper.service';

@Component({
  selector: 'fui-tree-node',
  template: `
    <div class="fui-node-tree" (click)="onSelected()" [ngClass]="{ 'node-tree-selected': node.selected }">
      <div [style.padding-left.px]="padding" class="node-tree" #nodetree>
        <span *ngIf="hasChildren" class="icon-template" (click)="onExpand()">
          <ng-container
            [ngTemplateOutlet]="getIconTemplate() ? getIconTemplate() : defaultIconTemplate"
            [ngTemplateOutletContext]="{ node: node }"
          ></ng-container>
          <ng-template #defaultIconTemplate let-node="node">
            <clr-icon class="expand-icon" *ngIf="node.expanded" shape="fui-less"></clr-icon>
            <clr-icon class="expand-icon" *ngIf="!node.expanded" shape="fui-add"></clr-icon>
          </ng-template>
        </span>
        <span class="label">
          <ng-container
            [ngTemplateOutlet]="getNodeTemplate() ? getNodeTemplate() : defaultNodeRenderer"
            [ngTemplateOutletContext]="{ node: node }"
          ></ng-container>
          <ng-template #defaultNodeRenderer let-node="node">
            <span>{{ node.data.nodeLabel }}</span>
          </ng-template>
        </span>
      </div>
    </div>
    <div [style.margin-left.px]="calculatePadding() + 20">
      <clr-icon *ngIf="node.showLoader" class="fui-loader-animation" shape="fui-spinner"></clr-icon>
      <clr-icon *ngIf="node.loadError" class="fui-error-icon" shape="fui-error" aria-hidden="true"></clr-icon>
      <span *ngIf="node.loadError" class="error-msg">Couldn't load content</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuiTreeNodeComponent<T> implements OnInit, OnDestroy, DoCheck {
  @Output() onNodeEvent: EventEmitter<TreeNodeEvent<T>> = new EventEmitter<TreeNodeEvent<T>>();

  @Input() node: TreeNode<T>;
  @Input() theme: TreeViewColorTheme;
  @Input() dataRetriever: TreeNodeDataRetriever<T> | PagedTreeNodeDataRetriever<T>;
  @Input() treeviewConfig: TreeViewConfiguration;

  @HostBinding('class') themeClass;
  @HostBinding('class.fui-tree-node-component') nodeComponent: boolean = true;
  @HostBinding('class.borders') @Input() borders: boolean = false;

  @ViewChild('nodetree', { read: ElementRef }) nodeTreeElement: ElementRef;

  // Hierarchical level to show parent-child relationship
  level: number = 0;
  // Indicates node can be expanded
  hasChildren: boolean = false;
  // left padding dependent of node tree hierarchical level
  padding: number;

  private domObservers: ObserverInstance[] = [];

  constructor(
    @Self() private element: ElementRef,
    private scrollbarHelper: ScrollbarHelper,
    private cd: ChangeDetectorRef,
    private treeViewUtils: FuiTreeViewUtilsService
  ) {}

  /**
   * Initiates Tree Node component by setting its hierarchical level
   * based on the number of parents it has and if any node has any children
   */
  ngOnInit() {
    this.themeClass = this.theme;
    let parent = this.node.parent;
    while (parent != null) {
      parent = parent.parent;
      this.level++;
    }
    this.dataRetriever.hasChildNodes(this.node.data).then((hasChildren: boolean) => {
      this.hasChildren = hasChildren;
      this.setVirtualScrollerWidth();
    });

    // Once the node is visible on screen we need to re-calculate the virtual scroller width.
    const headerViewport: Element = this.element.nativeElement;
    this.domObservers.push(
      DomObserver.observe(headerViewport, entities => {
        entities.forEach(entity => {
          if (entity.isIntersecting) {
            this.setVirtualScrollerWidth();
          }
        });
      })
    );
  }

  /**
   * Checks to ensure node is updated.
   * DoCheck needed since parent component constantly changes input {showLoader, loadError and selected} properties
   */
  ngDoCheck(): void {
    this.cd.markForCheck();
  }

  ngOnDestroy() {
    this.domObservers.forEach(observerInstance => DomObserver.unObserve(observerInstance));
    this.domObservers = undefined;
  }

  /**
   * Invokes the node event based on the host Tree Node and its expanded or collapsed state
   */
  onExpand(): void {
    this.onNodeEvent.emit({
      getNode: () => {
        return this.node;
      },
      getType: () => {
        return !this.node.expanded ? TreeViewEventType.NODE_EXPANDED : TreeViewEventType.NODE_COLLAPSED;
      }
    });
  }

  /**
   * Invokes the node event based on the host Tree Node click event
   */
  onSelected(): void {
    this.onNodeEvent.emit({
      getNode: () => {
        return this.node;
      },
      getType: () => {
        return TreeViewEventType.NODE_CLICKED;
      }
    });
  }

  /**
   * Gets the icon template reference the developer can use on a Tree Node with its current state
   */
  getIconTemplate(): TemplateRef<any> | null {
    return this.dataRetriever.hasOwnProperty('getIconTemplate') ? this.dataRetriever.getIconTemplate() : null;
  }

  /**
   * Gets the node template reference the developer can use on the Tree Node with its current state
   */
  getNodeTemplate(): TemplateRef<any> | null {
    return this.dataRetriever.hasOwnProperty('getNodeTemplate') ? this.dataRetriever.getNodeTemplate() : null;
  }

  /**
   * Calculates the needed padding based on nodes level and if it has children
   */
  calculatePadding(): number {
    return this.hasChildren ? this.level * 20 + 10 : this.level * 20 + 30;
  }

  /**
   * Set virtual scroller width depending on node width or config width.
   */
  private setVirtualScrollerWidth() {
    this.padding = this.calculatePadding();
    // At this particular time the view isn't updated fast enough so we calculate the node width to include:
    // Node text width, padding and if icons exists take a value of 16 into consideration
    const iconPadding = this.hasChildren ? 16 : 0;
    const currentNodeWidth: number = this.getNodeWidth() + iconPadding + this.padding;
    const configWidth: number = this.treeviewConfig ? parseInt(this.treeviewConfig.width, 10) : 0;
    // For users with scrollbars visible, we need to take the scrollbar width into account.
    const scrollbarWidth: number = this.scrollbarHelper.getWidth();
    this.treeViewUtils.virtualScrollerWidth =
      configWidth > currentNodeWidth ? (this.borders ? configWidth : configWidth - (40 + scrollbarWidth)) : currentNodeWidth;
    // 40 = 2 times padding of 20px.
    this.cd.markForCheck();
  }

  /**
   * Gets the Node Tree width including padding
   */
  private getNodeWidth(): number {
    return this.nodeTreeElement.nativeElement.offsetWidth;
  }
}
