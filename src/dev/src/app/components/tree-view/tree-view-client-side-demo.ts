import { Component, ViewChild, TemplateRef } from '@angular/core';
import {
  PagingParams,
  TreeNodeDataRetriever,
  TreeNodeData,
  PagedTreeNodeDataRetriever,
  NonRootTreeNode,
  FuiTreeViewComponent,
} from '@ferui/components';

@Component({
  template: `
    <h1 class="mb-4">FerUI Tree View</h1>
    <h3>Overview</h3>
    <p>
      Just like any other FerUI component in <code>@ferui-components</code>, the Tree View will require adding the FerUI to
      your project's main module to use this component like a regular Angular component.
    </p>
    <p>Import the FeruiModule in your app.module file and in your imports array module</p>
    <p>In order to use the Tree View Component you will need:</p>
    <ul>
      <li>Data object which implements a <code>TreeNodeData</code> interface</li>
      <li>
        Data retriever object which implements a <code>TreeNodeDataRetriever</code> or
        <code>PagedTreeNodeDataRetriever</code> interface
      </li>
      <li>Configuration object which implements a <code>TreeViewConfiguration</code> interface</li>
    </ul>
    <p>
      Ferui Tree View Component allows developer to subscribe to an event observable that triggers when a Tree Node is
      expanded, collapsed, or selected. Expects to receive a TreeViewEvent.
    </p>
    <p>Three examples follow</p>

    <div class="demo-tree-view">
      <h1>Client Side Tree View</h1>
      <div class="demo-component">
        <fui-tree-view
          [treeNodeData]="treeNodeData"
          [dataRetriever]="treeDataRetriever"
          [config]="{ width: '250px', height: '300px' }"
        ></fui-tree-view>
      </div>
      <pre class="code-example">
        <code [languages]="['typescript']" [highlight]="dataExample1"></code>
        <code [languages]="['html']" [highlight]="htmlExample1"></code>
      </pre>
    </div>
    <div class="demo-tree-view">
      <h1>Server Side Tree View With Borders</h1>
      <div class="demo-component">
        <fui-tree-view
          [loading]="loading"
          [treeNodeData]="serverSideTreeNodeData"
          [dataRetriever]="serverDataRetriever"
          [config]="{ width: '250px', height: '300px', hasBorders: true }"
        ></fui-tree-view>
      </div>
      <pre class="code-example"><code [languages]="['typescript']" [highlight]="dataExample2"></code></pre>
    </div>
    <div class="demo-tree-view">
      <h1>Non Root Tree View With Custom Icons and Node Templates</h1>
      <div class="demo-component">
        <fui-tree-view
          [treeNodeData]="noRoot"
          [dataRetriever]="treeDataArrayRetriever"
          [config]="{ width: '250px', height: '300px' }"
        ></fui-tree-view>
      </div>
      <pre class="code-example">
        <code [languages]="['typescript']" [highlight]="dataExample3"></code>
        <code [languages]="['html']" [highlight]="htmlExample3"></code>
      </pre>
    </div>

    <div class="demo-tree-view">
      <h1>Tree View using public API to select, expand and collapse nodes</h1>
      <h4>Open Root Note at beginning</h4>
      <div class="demo-component">
        <fui-tree-view
          #publicApi
          [treeNodeData]="treeNodeData"
          [dataRetriever]="treeDataRetriever"
          [config]="{ width: '250px', height: '300px' }"
        ></fui-tree-view>
      </div>
      <div class="demo-component">
        <p><button (click)="expandVegetables()">Expand Vegetables Child</button></p>
        <p><button (click)="closeVegetables()">Collapse Vegetables child</button></p>
        <p><button (click)="selectFruits()">Select Fruits Child</button></p>
      </div>
      <pre class="code-example">
        <code [languages]="['typescript']" [highlight]="dataExample4"></code>
      </pre>
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
      }
      .fui-less-icon {
        height: 12px;
        width: 10px;
        margin-bottom: 2px;
        transform: rotate(180deg);
      }
      .fui-add-icon {
        height: 12px;
        width: 12px;
        margin-bottom: 2px;
        transform: rotate(90deg);
      }
    `,
  ],
})
export class TreeViewClientSideDemo {
  @ViewChild('iconTemplate') iconTemplate: TemplateRef<any>;
  @ViewChild('template') nodeTemplate: TemplateRef<any>;
  @ViewChild('publicApi') publicTreeView: FuiTreeViewComponent<any>;

  htmlExample1 = `
    <fui-tree-view
          [treeNodeData]="treeNodeData"
          [dataRetriever]="treeDataRetriever"
          [config]="treeViewConfiguration"
          (onNodeEvent)="handleNodeEvent($event)"
        ></fui-tree-view>
  `;
  dataExample1 = `
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
   `;

  dataExample2 = `
    // Developer can pass optional parameters for TreeView configuration
    // Otherwise default ones are issued
    treeViewConfiguration: TreeViewConfiguration = {
      width: '250px',
      height: '300px',
      hasBorders: true,
      bufferAmount: 30
    }
    
    serverDataRetriever: PagedTreeNodeDataRetriever<FoodNode> = {
      hasChildNodes: (node: TreeNodeData<FoodNode>) => {
        return Promise.resolve(node.hasChildren());
      },
      // not used on Server Side rendering
      getChildNodeData: (node: TreeNodeData<FoodNode>) => {
        return Promise.resolve();
      },
      getPagedChildNodeData: (node: TreeNodeData<FoodNode>, pagingParams: PagingParams) => {
        const url = 'https://back-end-server/' + node.data.id + '?start=' +
                    pagingParams.offset + '&limit=' + pagingParams.limit;
        return this.http.get(url).subscribe((results: TreeNodeData[]) => {
          return results;
        });
      },
    };
  `;
  dataExample3 = `
    // When using non root tree view, pass in an empty instance of the NonRootTreeNode class
    const noRootTreeView = NonRootTreeNode.instance;
    
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
  `;
  htmlExample3 = `   
   
   // Developer may use their own icon and node templates and expect the node property to be passed in to each
   // template given to customize based on needs. 
   // A developer can expect a TreeNode<T> interface 
   // interface TreeNode<T> {
   //   data: TreeNodeData<T>;
   //   selected: boolean;
   //   expanded: boolean;
   //   children: Array<TreeNode<T>>;
   //   allChildrenLoaded: boolean;
   //   parent: TreeNode<T> | null;
   //   showLoader: boolean;
   //   loadError: boolean;
   // }
   
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
  `;

  dataExample4 = `
    // Using Angular's ViewChild (or similar) you can gain access to your Tree View's public api
    @ViewChild('myTreeView') treeView: FuiTreeViewComponent<FoodNode>;
    
    // The FuiTreeViewComponent will give you access to 3 public API methods that all take in a TreeNodeData<T>
    // selectNode
    // expandNode
    // collapseNode
    
    closeVegetables(): void {
      const treeNodeData: TreeNodeData<FoodNode> = {
        data: this.treeNodeData.data.children[1],
        nodeLabel: this.treeNodeData.data.children[1].name,
      };
      this.treeView.collapseNode(treeNodeData);
    }

    expandVegetables(): void {
      const treeNodeData: TreeNodeData<FoodNode> = {
        data: this.treeNodeData.data.children[1],
        nodeLabel: this.treeNodeData.data.children[1].name,
      };
      this.treeView.expandNode(treeNodeData);
    }

    selectFruits(): void {
      const treeNodeData: TreeNodeData<FoodNode> = {
        data: this.treeNodeData.data.children[0],
        nodeLabel: this.treeNodeData.data.children[0].name
      };
      this.treeView.selectNode(treeNodeData);
    }
  `;

  treeNodeData: TreeNodeData<FoodNode> = {
    data: treeData,
    nodeLabel: treeData.name,
  };
  serverSideTreeNodeData: TreeNodeData<FoodNode> = {
    data: serverData,
    nodeLabel: serverData.name,
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
    },
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
    },
  };

  // Server side node
  loading = true;
  serverDataRetriever: PagedTreeNodeDataRetriever<FoodNode> = {
    hasChildNodes: (node: TreeNodeData<FoodNode>) => {
      return Promise.resolve(!!node.data.children && node.data.children.length > 0);
    },
    getChildNodeData: (node: TreeNodeData<FoodNode>) => {
      return Promise.resolve(
        node.data.children.map(i => {
          return { data: it, nodeLabel: it.name };
        })
      );
    },
    getPagedChildNodeData: (node: TreeNodeData<FoodNode>, pagingParams: PagingParams) => {
      return new Promise((resolve, reject) => {
        // Will mock an error if data is Orange
        if (node.data.name === 'Orange') {
          setTimeout(() => reject({ message: 'Error: Could not retrieve child node data' }), 1000);
        } else {
          setTimeout(() => {
            const children = node.data.children.slice(pagingParams.offset, pagingParams.offset + pagingParams.limit);
            resolve(
              children.map(it => {
                return { data: it, nodeLabel: it.name };
              })
            );
          }, 500);
        }
      });
    },
  };

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;
    }, 2500);
    for (let i = 0; i <= 500; i++) {
      serverData.children[0].children.push({ name: 'Fruit Child ' + i });
    }
    for (let x = 0; x <= 1000; x++) {
      serverData.children[1].children.push({ name: 'Vegetable Child ' + x });
    }
    for (let y = 0; y <= 250; y++) {
      serverData.children[0].children[2].children.push({ name: 'Strawberry child ' + y });
    }
    setTimeout(() => {
      this.publicTreeView.expandNode(this.treeNodeData);
    }, 500);
  }

  closeVegetables(): void {
    const treeNodeData: TreeNodeData<FoodNode> = {
      data: this.treeNodeData.data.children[1],
      nodeLabel: this.treeNodeData.data.children[1].name,
    };
    this.publicTreeView.collapseNode(treeNodeData);
  }

  expandVegetables(): void {
    const treeNodeData: TreeNodeData<FoodNode> = {
      data: this.treeNodeData.data.children[1],
      nodeLabel: this.treeNodeData.data.children[1].name,
    };
    this.publicTreeView.expandNode(treeNodeData);
  }

  selectFruits(): void {
    const treeNodeData: TreeNodeData<FoodNode> = {
      data: this.treeNodeData.data.children[0],
      nodeLabel: this.treeNodeData.data.children[0].name,
    };
    this.publicTreeView.selectNode(treeNodeData);
  }
}

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const serverData: FoodNode = {
  name: 'Foods',
  children: [
    {
      name: 'Fruit',
      children: [
        { name: 'Apple' },
        {
          name: 'Banana',
          children: [
            {
              name: 'banana child',
              children: [{ name: 'banana with long name for grandchild', children: [{ name: 'banana great grandchild' }] }],
            },
          ],
        },
        {
          name: 'Strawberry',
          children: [],
        },
        { name: 'Blackberry' },
        { name: 'Blueberries' },
        { name: 'Kiwi' },
        { name: 'Coconut' },
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
    },
  ],
};

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
          { name: 'Grandchild 8' },
        ],
      },
      {
        name: 'Child 4',
        children: [{ name: 'Grandchild 1' }, { name: 'Grandchild 2' }, { name: 'Grandchild 3' }],
      },
      { name: 'Child 5' },
      { name: 'Child 6' },
      { name: 'Child 7' },
    ],
  },
  {
    name: 'Parent 2',
    children: [
      {
        name: 'Child 1',
        children: [{ name: 'Grandchild 1' }, { name: 'Grandchild 2' }],
      },
      {
        name: 'Child 2',
        children: [{ name: 'Grandchild 1' }, { name: 'Grandchild 2' }],
      },
    ],
  },
  {
    name: 'Parent 3',
  },
];

const treeData: FoodNode = {
  name: 'Foods',
  children: [
    {
      name: 'Fruit',
      children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Strawberry' }],
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
    },
  ],
};
