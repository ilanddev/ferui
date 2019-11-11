import { TreeNodeData, TreeViewEventType } from './interfaces';

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
}

/**
 * Tree View Component Styles Interface
 */
export interface FuiTreeViewComponentStyles {
  width: string;
  height: string;
}

/**
 * Tree Node Event Interface
 */
export interface TreeNodeEvent<T> {
  getNode(): TreeNode<T>;
  getType(): TreeViewEventType;
}

/**
 * Wrapped Promise Interface to cancel Promise
 */
export interface WrappedPromise<T> extends Promise<T> {
  cancel: () => void;
}
