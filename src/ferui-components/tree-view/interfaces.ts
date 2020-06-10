import { TemplateRef } from '@angular/core';

/**
 * Tree Node Data Interface
 */
export interface TreeNodeData<T> {
  // data wrapper for any data object developer will be using
  data: T;
  // label provided by dev to represent the text used in view from the data object
  nodeLabel: string;
}

/**
 * Paging Params Interface
 */
export interface PagingParams {
  offset: number;
  limit: number;
}

/**
 * Tree Node Data Retriever Interface for client-side tree view
 */
export interface TreeNodeDataRetriever<T> {
  // Get promise that returns TreeNodeData children array from Tree Node
  getChildNodeData(parent: TreeNodeData<T>): Promise<Array<TreeNodeData<T>>>;
  // Get promise that returns whether TreeNode has children nodes
  hasChildNodes(parent: TreeNodeData<T>): Promise<boolean>;
  // If the developer wants to give us an icon template for the expansion/collapse of node
  getIconTemplate?(): TemplateRef<any>;
  // If developer wishes to give us a template ref we shall render this template in the view
  getNodeTemplate?(): TemplateRef<any>;
}

/**
 * Paged Tree Node Data Retriever for server-side tree view
 */
export interface PagedTreeNodeDataRetriever<T> extends TreeNodeDataRetriever<T> {
  getPagedChildNodeData(parent: TreeNodeData<T>, pagingParams: PagingParams): Promise<Array<TreeNodeData<T>>>;
}

/**
 * Non root tree node empty singleton instance
 */
export class NonRootTreeNode implements TreeNodeData<any> {
  public static instance: NonRootTreeNode = new NonRootTreeNode();
  readonly data;
  readonly nodeLabel;
  private constructor() {}
}

/**
 * Tree View Event Interface
 */
export interface TreeViewEvent<T> {
  getNode(): TreeNodeData<T>;
  getType(): TreeViewEventType;
}

/**
 * Tree View Event Type enum
 */
export enum TreeViewEventType {
  NODE_CLICKED = 'node_clicked',
  NODE_EXPANDED = 'node_expanded',
  NODE_COLLAPSED = 'node_collapsed'
}

/**
 * Tree View Configuration Interface
 */
export interface TreeViewConfiguration {
  width?: string;
  height?: string;
  // Optional config to show borders around Tree Node components
  hasBorders?: boolean;
  // Optional color config set by developer to choose color theme for Tree View component, default WHITE
  colorVariation?: TreeViewColorTheme;
  // Optional buffer amount set by developer, use iland default of 50 if not given
  bufferAmount?: number;
  // Optional limit config for server side paging params, use iland virtual scroller as default
  limit?: number;
}

/**
 * Tree View Color Theme enum of possible options
 */
export enum TreeViewColorTheme {
  DARK_BLUE = 'dark-blue',
  LIGHT_BLUE = 'light-blue',
  GRAY = 'gray',
  WHITE = 'white'
}

/**
 * Tree View auto select a node interface
 */
export interface TreeViewAutoNodeSelector<T> {
  autoSelectNode(nodesArray: Array<TreeNodeData<T>>): TreeNodeData<T>;
}

/**
 * Tree Node Interface
 */
export interface TreeNode<T> {
  data: TreeNodeData<T>;
  selected: boolean;
  expanded: boolean;
  children: Array<TreeNode<T>>;
  allChildrenLoaded: boolean;
  parent: TreeNode<T> | null;
  showLoader: boolean;
  loadError: boolean;
  width?: number;
}

/**
 * Tree Node Event Interface
 */
export interface TreeNodeEvent<T> {
  getNode(): TreeNode<T>;
  getType(): TreeViewEventType;
}
