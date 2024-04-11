import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem, TreeNode } from 'primeng/api';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { FoldersModel } from 'src/app/core/models/document-management/folders.model';
import { ProjectsModel } from 'src/app/core/models/document-management/projects.model';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-doc-datasource',
  templateUrl: './doc-datasource.component.html',
  styleUrls: ['./doc-datasource.component.scss']
})

export class DocDatasourceComponent implements OnInit {

  constructor(private apiService: ApiService) { }

  files: TreeNode[];
  breadcrumb: MenuItem[];
  selectedFolder:TreeNode;

  @Output() oneNodeSelected = new EventEmitter<any>();
  @Output() oneNodeSelectedId = new EventEmitter<any>();

  ngOnInit(): void {
    this.getProjects()
  }

  getProjects() {
    this.files = []
    this.apiService.get(ApiURL.projects).subscribe((data: ProjectsModel[]) => {
      if (data.length) {
        null;
        data.forEach(project => {
          let menuItem: TreeNode = {
            label: project.projectName,
            leaf: false,
            icon: "pi pi-server",
            children: [],
            data: project
          }
          this.files.push(menuItem);
        })
        this.files = [...this.files];
        console.log(this.files)
      }
    });
  }

  getFolders(node: TreeNode) {
    let query: ApiQuery = new ApiQuery()
    node.children = []
    query.filter = new Map<any, any>([['location', node.data.type == 'Project' ? node.data.location : node.data.location + "/" + node.label]])
    this.apiService.get(ApiURL.folders, query).subscribe((data: FoldersModel[]) => {
      if (data.length) {
        data.forEach(folder => {
          let treenode: TreeNode = {
            label: folder.folderName,
            leaf: false,
            expandedIcon: 'pi pi-folder-open',
            collapsedIcon: 'pi pi-folder',
            children: [],
            data: folder
          }
          node.children.push(treenode)
        })
        node.children = [...node.children];
      }
    });
  }

  OnNodeSelection(e) {
    let isParent = true
    let node = e.node
    console.log(e)
    this.breadcrumb = [];
    while (isParent) {
      if (node.parent) {
        this.breadcrumb.push(
          { label: node.label }
        )
        node = node.parent;
      } else {
        isParent = false;
        this.breadcrumb.push(
          { label: node.label }
        )
        this.oneNodeSelected.emit(this.breadcrumb)
        console.log(this.breadcrumb);
      }
    }
    this.oneNodeSelectedId.emit(this.selectedFolder)
  }

  loadCarsLazy(e){
    console.log(e)
  }

  nodeExpand(e){
    if(e.node){
      this.getFolders(e.node);
    }
  }
}
