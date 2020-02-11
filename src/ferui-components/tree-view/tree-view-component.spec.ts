import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { TreeViewModule } from './tree-view.module';
import { Component, ViewChild } from '@angular/core';
import { FuiTreeViewComponent } from './tree-view-component';
import {
  PagedTreeNodeDataRetriever,
  TreeNodeData,
  TreeNodeDataRetriever,
  TreeViewColorTheme,
  TreeViewConfiguration
} from './interfaces';

export default function() {
  describe('Client Side Tree View', () => {
    let testComponent: ComponentFixture<ClientSideTestComponent>;
    let compiled: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TreeViewModule],
        declarations: [ClientSideTestComponent]
      });
      testComponent = TestBed.createComponent(ClientSideTestComponent);
      testComponent.detectChanges();
      compiled = testComponent.nativeElement;
    });

    afterEach(() => {
      testComponent.destroy();
    });

    it('starts component', () => {
      expect(testComponent).not.toBeNull();
    });

    it('ensures .fui-tree-view-component class has been added', () => {
      expect(compiled.querySelector('.fui-tree-view-component')).not.toBeNull();
    });

    it('expects all properties of Tree View to be set properly', () => {
      const treeViewCom = testComponent.componentInstance.treeView;
      expect(treeViewCom.treeViewStyles).toEqual({
        width: '250px',
        height: '300px'
      });
      expect(treeViewCom.colorTheme).toEqual('white');
      expect(treeViewCom.scrollViewArray).toEqual([
        {
          data: {
            data: { name: 'Parent', children: [{ name: 'Child 1' }, { name: 'Child 2' }] },
            nodeLabel: 'Parent'
          },
          selected: false,
          expanded: false,
          children: [],
          allChildrenLoaded: false,
          parent: null,
          showLoader: false,
          loadError: false
        }
      ]);
      expect(treeViewCom.hasBorders).toEqual(false);
    });
  });

  describe('Server Side Tree View', () => {
    let testComponent: ComponentFixture<ServerSideTestComponent>;
    let compiled: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TreeViewModule],
        declarations: [ServerSideTestComponent]
      });
      testComponent = TestBed.createComponent(ServerSideTestComponent);
      testComponent.detectChanges();
      compiled = testComponent.nativeElement;
    });

    afterEach(() => {
      testComponent.destroy();
    });

    it('expects all server side properties of Tree View to be set properly', () => {
      const treeViewCom = testComponent.componentInstance.treeView;
      expect(treeViewCom.colorTheme).toEqual('gray');
      expect(treeViewCom.scrollViewArray).toEqual([
        {
          data: {
            data: { name: 'Parent', children: [{ name: 'Child 1' }, { name: 'Child 2' }] },
            nodeLabel: 'Parent'
          },
          selected: false,
          expanded: false,
          children: [],
          allChildrenLoaded: false,
          parent: null,
          showLoader: false,
          loadError: false
        }
      ]);
      expect(treeViewCom.hasBorders).toEqual(true);
    });

    it('use public api to expand root node', fakeAsync(() => {
      const treeViewCom = testComponent.componentInstance.treeView;
      treeViewCom.expandNode({
        data: { name: 'Parent', children: [{ name: 'Child 1' }, { name: 'Child 2' }] },
        nodeLabel: 'Parent'
      });
      tick(1000);
      expect(treeViewCom.scrollViewArray.length).toEqual(3);
    }));

    it('use public api to collapse root node', fakeAsync(() => {
      const treeViewCom = testComponent.componentInstance.treeView;
      treeViewCom.expandNode({
        data: { name: 'Parent', children: [{ name: 'Child 1' }, { name: 'Child 2' }] },
        nodeLabel: 'Parent'
      });
      tick(1000);
      expect(treeViewCom.scrollViewArray.length).toEqual(3);

      treeViewCom.collapseNode({
        data: { name: 'Parent', children: [{ name: 'Child 1' }, { name: 'Child 2' }] },
        nodeLabel: 'Parent'
      });
      tick(1000);
      expect(treeViewCom.scrollViewArray.length).toEqual(1);
    }));

    it('use public api to select node', fakeAsync(() => {
      const treeViewCom = testComponent.componentInstance.treeView;
      treeViewCom.expandNode({
        data: { name: 'Parent', children: [{ name: 'Child 1' }, { name: 'Child 2' }] },
        nodeLabel: 'Parent'
      });
      tick(1000);
      expect(treeViewCom.scrollViewArray.length).toEqual(3);
      treeViewCom.selectNode({
        data: { name: 'Child 2' },
        nodeLabel: 'Child 2'
      });
      tick(1000);
      expect(treeViewCom.scrollViewArray[2].selected).toEqual(true);
    }));
  });
}

@Component({
  template: `
    <fui-tree-view
      #treeView
      [treeNodeData]="data"
      [dataRetriever]="treeNodeDataRetriever"
      [config]="treeViewConfiguration"
    ></fui-tree-view>
  `
})
class ClientSideTestComponent {
  @ViewChild('treeView') treeView: FuiTreeViewComponent<any>;
  data: TreeNodeData<any> = {
    data: { name: 'Parent', children: [{ name: 'Child 1' }, { name: 'Child 2' }] },
    nodeLabel: 'Parent'
  };
  treeViewConfiguration: TreeViewConfiguration = {
    width: '250px',
    height: '300px'
  };
  treeNodeDataRetriever: TreeNodeDataRetriever<any> = {
    hasChildNodes: (node: TreeNodeData<any>) => {
      return Promise.resolve(!!node.data.children && node.data.children.length > 0);
    },
    getChildNodeData: (node: TreeNodeData<any>) => {
      return Promise.resolve(
        node.data.children.map(it => {
          return { data: it, nodeLabel: it.name };
        })
      );
    }
  };
}

@Component({
  template: `
    <fui-tree-view
      #treeView
      [treeNodeData]="data"
      [dataRetriever]="treeNodeDataRetriever"
      [config]="treeViewConfiguration"
    ></fui-tree-view>
  `
})
class ServerSideTestComponent {
  @ViewChild('treeView') treeView: FuiTreeViewComponent<any>;
  data: TreeNodeData<any> = {
    data: { name: 'Parent', children: [{ name: 'Child 1' }, { name: 'Child 2' }] },
    nodeLabel: 'Parent'
  };
  treeViewConfiguration: TreeViewConfiguration = {
    width: '250px',
    height: '300px',
    hasBorders: true,
    colorVariation: TreeViewColorTheme.GRAY
  };
  treeNodeDataRetriever: PagedTreeNodeDataRetriever<any> = {
    hasChildNodes: (node: TreeNodeData<any>) => {
      return Promise.resolve(!!node.data.children && node.data.children.length > 0);
    },
    getChildNodeData: (node: TreeNodeData<any>) => {
      return Promise.resolve(
        node.data.children.map(it => {
          return { data: it, nodeLabel: it.name };
        })
      );
    },
    getPagedChildNodeData: (node: TreeNodeData<any>, pagingParams) => {
      return Promise.resolve(
        node.data.children.map(it => {
          return { data: it, nodeLabel: it.name };
        })
      );
    }
  };
}
