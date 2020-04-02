import { Component } from '@angular/core';
import * as jsBeautify from 'js-beautify';

@Component({
  template: `
    <h1>Overview and Tutorial</h1>
    <p>
      Just like any other FerUI component in <code>@ferui-components</code>, the Tree View will require adding the FerUI to your
      project's main module to use this component like a regular Angular component.
    </p>
    <div>
      <p>Import the FeruiModule in your app.module file and in your imports array module</p>
      <pre><code [languages]="['typescript']" [highlight]="importModule"></code></pre>
    </div>
    <p>In order to use the Tree View Component you will need to review its API with required and optional params:</p>
    <p>Ferui Tree View API</p>
    <ul>
      <li>
        <b>Required: </b><code>TreeNodeData</code> interface consists of the initial tree node parent that will be the foundation
        of starting the tree view hierarchy. A developer may pass in an instance of the <code>NonRootTreeNode</code> class to
        start the tree view with no default parent and may load a set of parent nodes
        <pre><code [languages]="['typescript']" [highlight]="treeNodeData"></code></pre>
      </li>
      <li>
        <b>Required: </b>Data retriever object which implements a <code>TreeNodeDataRetriever</code> or
        <code>PagedTreeNodeDataRetriever</code> interface
        <pre><code [languages]="['typescript']" [highlight]="dataRetrievers"></code></pre>
      </li>
      <li>
        <b>Required: </b>Configuration object which implements a <code>TreeViewConfiguration</code> interface
        <pre><code [languages]="['typescript']" [highlight]="treeViewConfiguration"></code></pre>
      </li>
      <li>
        <b>Optional: </b><code>TreeViewAutoNodeSelector</code> object with an autoSelectNode callback to be invoked on
        initialization of Tree View if developer wishes to select a node at first load.
        <pre><code [languages]="['typescript']" [highlight]="autoNodeSelector"></code></pre>
      </li>
      <li>
        <p>
          Ferui Tree View Component allows developer to subscribe to an event observable that triggers when a Tree Node is
          expanded, collapsed, or selected. Expects to receive a TreeViewEvent.
        </p>
        <b>Optional: </b><code>onNodeEvent</code> binding allows developer to subscribe to an event observable that triggers when
        a Tree Node is expanded, collapsed, or selected. The observable will emit a <code>TreeViewEvent</code> interface that will
        show the <code>TreeNodeData</code> and the <code>TreeViewEventType</code>.
        <pre><code [languages]="['html']" [highlight]="onNodeEvent"></code></pre>
        <pre><code [languages]="['typescript']" [highlight]="onNodeEventHandler"></code></pre>
      </li>
      <li>
        The Tree View Public API also allows a developer to select/expand/collapse nodes from outside sources as they wish
        <ul>
          <li>
            A developer must first get the Tree View component binding to access the public methods. Each method takes in the
            desired <code>TreeNodeData</code> object developer wishes to interact with
            <pre><code [languages]="['typescript']" [highlight]="getTreeView"></code></pre>
          </li>
          <li>
            <pre><code [languages]="['typescript']" [highlight]="selectNode"></code></pre>
          </li>
          <li>
            <pre><code [languages]="['typescript']" [highlight]="expandNode"></code></pre>
          </li>
          <li>
            <pre><code [languages]="['typescript']" [highlight]="collapseNode"></code></pre>
          </li>
        </ul>
      </li>
    </ul>

    <p>Full list of <code>fui-tree-view</code> attributes and what they do.</p>
    <table class="fui-table">
      <thead>
        <tr>
          <th width="200">Property</th>
          <th width="295">Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>[treeNodeData]</code></td>
          <td>TreeNodeData</td>
          <td>Tree node data to being tree view with, also NonRootTreeNode available. Example above</td>
        </tr>
        <tr>
          <td><code>[dataRetriever]</code></td>
          <td>TreeNodeDataRetriever | PagedTreeNodeDataRetriever</td>
          <td>Data retriever for Client-Side or Server-Side to retrieve the hierarchy of tree nodes. Example above</td>
        </tr>
        <tr>
          <td><code>[config]</code></td>
          <td>TreeViewConfiguration</td>
          <td>Configuration to meet developer needs. Example above</td>
        </tr>
        <tr>
          <td><code>[loading]</code></td>
          <td>boolean</td>
          <td>Tree view loading initial state handled by developer</td>
        </tr>
        <tr>
          <td><code>[error]</code></td>
          <td>boolean</td>
          <td>Initial error state handled by developer</td>
        </tr>
        <tr>
          <td><code>[autoNodeSelector]</code></td>
          <td>TreeViewAutoNodeSelector</td>
          <td>Holds callback method to select tree node on initialization of Tree View</td>
        </tr>
        <tr>
          <td><code>(onNodeEvent)</code></td>
          <td>EventEmitter: TreeViewEvent</td>
          <td>Event emitter developer can subscribe to. Example above</td>
        </tr>
      </tbody>
    </table>
  `
})
export class TreeViewDashboardDemo {
  importModule = jsBeautify.js(`
  import { AppComponent } from './app.component';
  import { NgModule } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { FeruiModule } from '@ferui/components';

  @NgModule({
    imports: [
      CommonModule,
      FormsModule,
      FeruiModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
  })
  export class AppModule {}`);

  treeNodeData = jsBeautify.js(`
    // Developer must pass in a TreeNodeData object reflecting the upper most parent
    const treeNodeData: TreeNodeData<any> = {
        data: treeData, // data wrapper for any data object developer will be using
        nodeLabel: treeData.name // label provided by dev to represent the text used in view from the data object
    };
    // Or if wanting no parent, developer must pass in the non root instance
    const noRoot = NonRootTreeNode.instance;
  `);

  dataRetrievers = jsBeautify.js(`
    // Using a Client-side tree view, developer pass in TreeNodeDataRetriever
    interface TreeNodeDataRetriever<T> {
      // Get promise that returns TreeNodeData children array from Tree Node
      getChildNodeData(parent: TreeNodeData<T>): Promise<Array<TreeNodeData<T>>>;
      // Get promise that returns whether TreeNode has children nodes
      hasChildNodes(parent: TreeNodeData<T>): Promise<boolean>;
      // If the developer wants to give us an icon template for the expansion/collapse of node
      getIconTemplate?(): TemplateRef<any>;
      // If developer wishes to give us a template ref we shall render this template in the view
      getNodeTemplate?(): TemplateRef<any>;
    }
    // If using Server-Side tree view, developer must use the PagedTreeNodeDataRetriever with a getPagedChildNodeData
    // callback that will take in paging params from the tree view
    interface PagedTreeNodeDataRetriever<T> extends TreeNodeDataRetriever<T> {
        getPagedChildNodeData(parent: TreeNodeData<T>, pagingParams: PagingParams): Promise<Array<TreeNodeData<T>>>;
    }
  `);

  treeViewConfiguration = jsBeautify.js(`
  // Multiple configuration options to meet the needs of the developer
  interface TreeViewConfiguration {
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
  }`);

  autoNodeSelector = jsBeautify.js(`
  interface TreeViewAutoNodeSelector<T> {
    autoSelectNode(nodesArray: Array<TreeNodeData<T>>): TreeNodeData<T>;
  }`);

  onNodeEvent = jsBeautify.html(`
    <fui-tree-view
          [treeNodeData]="serverSideTreeNodeData"
          [dataRetriever]="serverDataRetriever"
          [config]="configObject"
          (onNodeEvent)="nodeEventHandlerByDeveloper($event)"></fui-tree-view>
  `);

  onNodeEventHandler = jsBeautify.js(`
    // TreeViewEvent will hold all necessary information of the selected/expanded/collapsed tree node
    nodeEventHandlerByDeveloper(event: TreeViewEvent<any>) {
        const node: TreeNodeData<any> = event.getNode();
        const eventType: TreeViewEventType = event.getType();
    }
  `);

  getTreeView = jsBeautify.js(`
    // Get the Tree View Component child to access its public methods
    @ViewChild('treeViewComponent') treeViewComponent: FuiTreeViewComponent;
  `);

  selectNode = jsBeautify.js(`
    // When Developer has the TreeViewComponent binding, use its public method to select a desired node
    const nodeToSelect: TreeNodeData<any> = { data: data, nodeLabel: 'Node Label' };
    this.treeViewComponent.selectNode(nodeToSelect);
  `);

  expandNode = jsBeautify.js(`
    // When Developer has the TreeViewComponent binding, use its public method to expand a desired node
    const nodeToExpand: TreeNodeData<any> = { data: data, nodeLabel: 'Node Label' };
    this.treeViewComponent.expandNode(nodeToExpand);
  `);

  collapseNode = jsBeautify.js(`
    // When Developer has the TreeViewComponent binding, use its public method to collapse a desired node
    const nodeToCollapse: TreeNodeData<any> = { data: data, nodeLabel: 'Node Label' };
    this.treeViewComponent.collapseNode(nodeToCollapse);
  `);
}
