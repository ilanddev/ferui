import { Component, ViewChild, TemplateRef } from '@angular/core';
import { TreeNodeDataRetriever, TreeNodeData, NonRootTreeNode, TreeViewAutoNodeSelector } from '@ferui/components';
import * as jsBeautify from 'js-beautify';

@Component({
  template: `
    <div class="demo-tree-view">
      <h2>Client Side Tree View</h2>
      <div class="demo-component">
        <fui-tree-view
          [treeNodeData]="treeNodeData"
          [dataRetriever]="treeDataRetriever"
          [config]="{ width: '250px', height: '300px' }"
        ></fui-tree-view>
      </div>
      <div class="code-example">
        <fui-tabs>
          <fui-tab [title]="'HTML'" [active]="true">
            <pre><code [languages]="['html']" [highlight]="htmlExample1"></code></pre>
          </fui-tab>
          <fui-tab [title]="'TypeScript'">
            <pre><code [languages]="['typescript']" [highlight]="dataExample1"></code></pre>
          </fui-tab>
        </fui-tabs>
      </div>
    </div>

    <div class="demo-tree-view">
      <h2>Non Root Tree View with percentage width 20%</h2>
      <div class="demo-component expandable-width">
        <fui-tree-view
          [treeNodeData]="noRoot"
          [dataRetriever]="treeDataRetrieverNonRoot"
          [config]="{ height: '300px' }"
        ></fui-tree-view>
      </div>
      <div class="code-example">
        <fui-tabs>
          <fui-tab [title]="'HTML'" [active]="true">
            <pre><code [languages]="['html']" [highlight]="htmlExample2"></code></pre>
          </fui-tab>
          <fui-tab [title]="'TypeScript'">
            <pre><code [languages]="['typescript']" [highlight]="dataExample2"></code></pre>
          </fui-tab>
        </fui-tabs>
      </div>
    </div>

    <div class="demo-tree-view">
      <h2>Non Root Tree View With Custom Icons and Node Templates</h2>
      <div class="demo-component">
        <fui-tree-view
          [autoNodeSelector]="treeViewAutoNodeSelector"
          [treeNodeData]="noRoot"
          [dataRetriever]="treeDataArrayRetriever"
          [config]="{ width: '250px', height: '300px' }"
        ></fui-tree-view>
      </div>
      <div class="code-example">
        <fui-tabs>
          <fui-tab [title]="'HTML'" [active]="true">
            <pre><code [languages]="['html']" [highlight]="htmlExample3"></code></pre>
          </fui-tab>
          <fui-tab [title]="'TypeScript'">
            <pre><code [languages]="['typescript']" [highlight]="dataExample3"></code></pre>
          </fui-tab>
        </fui-tabs>
      </div>
    </div>

    <ng-template #iconTemplate let-node="node">
      <clr-icon *ngIf="node.expanded" class="fui-less-icon" shape="fui-solid-arrow"></clr-icon>
      <clr-icon *ngIf="!node.expanded" class="fui-add-icon" shape="fui-solid-arrow"></clr-icon>
    </ng-template>

    <ng-template #template let-node="node">
      <span>
        {{ node.data.nodeLabel }}
        <clr-icon class="fui-add-icon" shape="fui-screenshot"></clr-icon>
      </span>
    </ng-template>
  `,
  styles: [
    `
      .expandable-width {
        width: 20%;
        border: 1px solid;
      }
      .demo-tree-view {
        background-color: #f5f8f9;
        padding-top: 20px;
        padding-left: 10px;
      }
      .demo-component {
        display: inline-block;
        vertical-align: top;
      }
      .code-example {
        display: inline-block;
        height: 300px;
        margin-left: 20px;
        max-width: 550px;
      }
      .fui-less-icon {
        height: 12px;
        width: 12px;
        margin-bottom: 2px;
        transform: rotate(180deg);
      }
      .fui-add-icon {
        height: 12px;
        width: 12px;
        margin-bottom: 2px;
        transform: rotate(90deg);
      }
    `
  ]
})
export class TreeViewClientSideDemo {
  @ViewChild('iconTemplate') iconTemplate: TemplateRef<any>;
  @ViewChild('template') nodeTemplate: TemplateRef<any>;

  htmlExample1 = jsBeautify.html(`
    <fui-tree-view
          [treeNodeData]="treeNodeData"
          [dataRetriever]="treeDataRetriever"
          [config]="treeViewConfiguration"
          (onNodeEvent)="handleNodeEvent($event)"
        ></fui-tree-view>
  `);
  dataExample1 = jsBeautify.js(`
    interface FoodNode = {
      name: string;
      children?: FoodNode[];
    }
    const FOOD_TREE_DATA: FoodNode = {
      name: 'Foods',
      children: [
      {
        name: 'Fruit',
        children: [
          { name: 'Apple' },
          { name: 'Banana' },
          { name: 'Strawberry' }
        ],
      },
      {
        name: 'Vegetables',
        children: [
          {
            name: 'Green',
            children: [{ name: 'Broccoli' }, { name: 'Brussel sprouts' }],
          },
          {
            name: 'Orange',
            children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
          },
        ],
      }],
    };

    // nodeLabel property will be used to display the tree node text label
    treeNodeData: TreeNodeData<FoodNode> = {
      data: FOOD_TREE_DATA,
      nodeLabel: FOOD_TREE_DATA.name
    }

    treeNodeDataRetriever: TreeNodeDataRetriever<FoodNode> = {
      hasChildrenNodes: (node: TreeNodeData<FoodNode>) => {
        return Promise.resolve(!!node.data.children && node.data.children.length > 0);
      },
      getChildNodeData: (node: TreeNodeData<FoodNode>) => {
        return Promise.resolve(node.data.children.map(it => {
          return { data: it, nodeLabel: it.name };
        });
      );
      }
    }

    treeViewConfiguration: TreeViewConfiguration = {
      width: '250px',
      height: '300px'
    }

    // A developer may also bind to the onNodeEvent observable to listen to any node event happening in the Tree View
    // The event emitted will deliver a TreeViewEvent<T> type
    handleNodeEvent(event) {
      const treeNodeDataFromEvent = event.getNode();
      const eventType = event.getType();
      /**
        do something with type and node data
      **/
    }
   `);

  dataExample3 = jsBeautify.js(`
    // When using non root tree view, pass in an empty instance of the NonRootTreeNode class
    const noRootTreeView = NonRootTreeNode.instance;

    // auto selector to select a node on initialization of tree view from the first level layer of the Node Trees
    treeViewAutoSelector: TreeViewAutoNodeSelector<FoodNode> = {
        autoSelectNode(nodesArray: Array<TreeNodeData<FoodNode>>): TreeNodeData<FoodNode> {
            // select the second node that has already been initialized
            return nodesArray[1];
        }
    }

    // Developer can add the getIconTemplate & getNodeTemplate methods to TreeNodeDataRetriever
    // to customize node how they wish
    treeDataArrayRetriever: TreeNodeDataRetriever<PersonInterface> = {

      hasChildNodes: (node: TreeNodeData<PersonInterface>) => {
        return Promise.resolve(!!node.data.children && node.data.children.length > 0);
      },

      getChildNodeData: (node: TreeNodeData<PersonInterface>) => {
        const isEmptyRoot = node instanceof NonRootTreeNode;
        if (isEmptyRoot) {
          return Promise.resolve(
            this.jsonData.map(it => {
              return { data: it, nodeLabel: it.name };
            });
          );
        }
        return Promise.resolve(
          node.data.children.map(it => {
            return { data: it, nodeLabel: it.name };
          });
        );
      },

      // Icon templates will be used as the clickable icons to expand or collapse node
      getIconTemplate: (): TemplateRef<any> => {
        return this.iconTemplate;
      },

      // Node template must take in a node property to adjust label according to developer wants
      getNodeTemplate: (): TemplateRef<any> => {
        return this.nodeTemplate;
      },
    };

    // Developer may use their own icon and node templates and expect the node property to be passed in to each
    // template given to customize based on needs: A developer can expect a TreeNode<T> interface
    interface TreeNode<T> {
      data: TreeNodeData<T>;
      selected: boolean;
      expanded: boolean;
      children: Array<TreeNode<T>>;
      allChildrenLoaded: boolean;
      parent: TreeNode<T> | null;
      showLoader: boolean;
      loadError: boolean;
    }
  `);
  htmlExample3 = jsBeautify.html(`
    <ng-template #folderTemplate let-node="node">
      <clr-icon *ngIf="node.expanded" class="fui-less-icon" shape="fui-solid-arrow"></clr-icon>
      <clr-icon *ngIf="!node.expanded" class="fui-add-icon" shape="fui-solid-arrow"></clr-icon>
    </ng-template>

    <ng-template #template let-node="node">
      <span>
        {{ node.data.nodeLabel }}
        <span class="node-children-shown">{{ node.childre.length}}</span>
        <clr-icon class="fui-screenshot-icon" shape="fui-screenshot"></clr-icon>
      </span>
    </ng-template>
  `);

  htmlExample2 = jsBeautify.html(`
        <fui-tree-view
          [treeNodeData]="noRoot"
          [dataRetriever]="treeDataRetrieverNonRoot"
          [config]="{ height: '300px' }"></fui-tree-view>
    `);
  dataExample2 = jsBeautify.js(`
      noRoot = NonRootTreeNode.instance;

      treeDataRetrieverNonRoot = {
        hasChildNodes: (node: TreeNodeData<FoodNode>) => {
          return Promise.resolve(!!node.data.children && node.data.children.length > 0);
        },
        getChildNodeData: (node: TreeNodeData<FoodNode>) => {
          const isEmptyRoot = node instanceof NonRootTreeNode;
          if (isEmptyRoot) {
            return Promise.resolve(
              dataArrayExpandWidth.map(it => {
                return { data: it, nodeLabel: it.name };
              })
            );
          }
          return Promise.resolve(
            node.data.children.map(it => {
              return { data: it, nodeLabel: it.name };
            })
          );
        },
        getIconTemplate: () => {
          return this.iconTemplate;
        }
  };
  `);

  treeNodeData: TreeNodeData<FoodNode> = {
    data: treeData,
    nodeLabel: treeData.name
  };
  noRoot = NonRootTreeNode.instance;
  treeDataArrayRetriever = {
    hasChildNodes: (node: TreeNodeData<FoodNode>) => {
      return Promise.resolve(!!node.data.children && node.data.children.length > 0);
    },
    getChildNodeData: (node: TreeNodeData<FoodNode>) => {
      const isEmptyRoot = node instanceof NonRootTreeNode;
      if (isEmptyRoot) {
        return Promise.resolve(
          dataArray.map(it => {
            return { data: it, nodeLabel: it.name };
          })
        );
      }
      return Promise.resolve(
        node.data.children.map(it => {
          return { data: it, nodeLabel: it.name };
        })
      );
    },
    getIconTemplate: () => {
      return this.iconTemplate;
    },
    getNodeTemplate: () => {
      return this.nodeTemplate;
    }
  };
  treeDataRetriever: TreeNodeDataRetriever<FoodNode> = {
    hasChildNodes: (node: TreeNodeData<FoodNode>) => {
      return Promise.resolve(!!node.data.children && node.data.children.length > 0);
    },
    getChildNodeData: (node: TreeNodeData<FoodNode>) => {
      return Promise.resolve(
        node.data.children.map(it => {
          return { data: it, nodeLabel: it.name };
        })
      );
    }
  };
  treeViewAutoNodeSelector: TreeViewAutoNodeSelector<FoodNode> = {
    autoSelectNode(nodesArray: Array<TreeNodeData<FoodNode>>): TreeNodeData<FoodNode> {
      return nodesArray.length > 1 ? nodesArray[1] : nodesArray[0];
    }
  };
  treeDataRetrieverNonRoot = {
    hasChildNodes: (node: TreeNodeData<FoodNode>) => {
      return Promise.resolve(!!node.data.children && node.data.children.length > 0);
    },
    getChildNodeData: (node: TreeNodeData<FoodNode>) => {
      const isEmptyRoot = node instanceof NonRootTreeNode;
      if (isEmptyRoot) {
        return Promise.resolve(
          dataArrayExpandWidth.map(it => {
            return { data: it, nodeLabel: it.name };
          })
        );
      }
      return Promise.resolve(
        node.data.children.map(it => {
          return { data: it, nodeLabel: it.name };
        })
      );
    },
    getIconTemplate: () => {
      return this.iconTemplate;
    }
  };

  ngOnInit(): void {
    for (let i = 0; i <= 15; i++) {
      const folder: FoodNode = {
        name: `Folder ${Math.random()}`
      };
      if (i % 3 === 0) {
        folder.children = [];
        for (let x = 0; x <= i; x++) {
          const subFolder: FoodNode = {
            name: `Folder child - ${Math.random()}`
          };
          if (i % 5 === 0) {
            subFolder.children = [
              {
                name: `Folder grand child - ${Math.random()}`
              },
              {
                name: `Folder grand child - ${Math.random()}`
              }
            ];
          }
          folder.children.push(subFolder);
        }
      }
      dataArrayExpandWidth.push(folder);
    }
  }
}

const dataArrayExpandWidth = [];

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const dataArray = [
  {
    name: 'Parent',
    children: [
      { name: 'Child 1' },
      { name: 'Child 2' },
      {
        name: 'Child  3',
        children: [
          { name: 'Grandchild 1' },
          { name: 'Grandchild 2' },
          { name: 'Grandchild 3' },
          { name: 'Grandchild 4' },
          { name: 'Grandchild 5' },
          { name: 'Grandchild 6' },
          { name: 'Grandchild 7' },
          { name: 'Grandchild 8' }
        ]
      },
      {
        name: 'Child 4',
        children: [{ name: 'Grandchild 1' }, { name: 'Grandchild 2' }, { name: 'Grandchild 3' }]
      },
      { name: 'Child 5' },
      { name: 'Child 6' },
      { name: 'Child 7' }
    ]
  },
  {
    name: 'Parent 2',
    children: [
      {
        name: 'Child 1',
        children: [{ name: 'Grandchild 1' }, { name: 'Grandchild 2' }]
      },
      {
        name: 'Child 2',
        children: [{ name: 'Grandchild 1' }, { name: 'Grandchild 2' }]
      }
    ]
  },
  {
    name: 'Parent 3'
  }
];

const treeData: FoodNode = {
  name: 'Foods',
  children: [
    {
      name: 'Fruit',
      children: [{ name: 'Apple' }, { name: 'Banana', children: [{ name: 'Banana peal' }] }, { name: 'Strawberry' }]
    },
    {
      name: 'Dairy'
    },
    {
      name: 'Vegetables',
      children: [
        {
          name: 'Green',
          children: [{ name: 'Broccoli' }, { name: 'Brussel sprouts' }]
        },
        {
          name: 'Orange',
          children: [{ name: 'Pumpkins' }, { name: 'Carrots' }]
        }
      ]
    }
  ]
};
