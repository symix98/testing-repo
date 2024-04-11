import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-library-view',
  templateUrl: './library-view.component.html',
  styleUrls: ['./library-view.component.scss']
})

export class LibraryViewComponent implements OnInit {

  constructor() { }

  items: MenuItem[];
  path: MenuItem[];
  filePath: string;
  folderId: any;

  ngOnInit(): void {
    this.items = [
      {
        label: 'Create', icon: 'pi pi-fw pi-file',
        items: [
          { label: 'New File', icon: 'pi pi-fw pi-file' },
          { label: 'Upload File', icon: 'pi pi-fw pi-upload' }
        ]
      },
      // {
      //   label: 'Create', icon: 'pi pi-fw pi-plus',
      //   // disabled: this.securityService.getPermissions()[SecurityEntity.wbs] == SecurityAction.manage ? false:true, 
      //   items: [
      //     {
      //       label: 'New Record', icon: 'pi pi-fw pi-book',
      //       command: (event) => {
      //       },
      //     },
      //     // {
      //     //   label: 'New Child', icon: 'pi pi-fw pi-book', 
      //     //   command: (event) => {},
      //     // },
      //     {
      //       label: 'Clone Record', icon: 'pi pi-fw pi-clone',
      //       command: (event) => {
      //       },
      //     }
      //   ]
      // },
      {
        label: 'Filters', icon: 'pi pi-fw pi-filter',
        // items: this.filterItems
      },
      // {
      //   label: 'Expand', icon: 'pi pi-fw pi-slack',
      //   items: [
      //     {
      //       label: 'Expand', icon: 'pi pi-plus-circle', command: (event) => {
      //       }
      //     },
      //     {
      //       label: 'Collapse', icon: 'pi pi-minus-circle', command: (event) => {
      //       }
      //     }
      //   ]
      // },
      // {
      //   label: 'Edit', icon: 'pi pi-fw pi-pencil',
      //   // disabled:this.securityService.getPermissions()[SecurityEntity.] == SecurityAction.manage ? false:true,
      //   items: [
      //     {
      //       label: 'Save Changes', icon: 'pi pi-save', command: (event) => {
      //       }
      //     },
      //     // {label: 'L3L4', icon: 'pi pi-pi-file', command: (event) => {}}
      //   ]
      // },
      // {
      //   label: 'Refresh', icon: 'pi pi-refresh', command: (event) => {
      //     // this.wbsservice.refreshTree.next(true)
      //   }
      // },
    ]
  }

  oneNodeSelected(e) {
    this.path = e
    this.path = this.path.reverse()
    this.path[0].icon = 'pi pi-home pi-fw'
    this.path.forEach((p, i) => { p.id = i + '' })
    let pathString = ""
    this.path.forEach(e => {
      if (pathString == "") {
        pathString = e.label
      } else {
        pathString = pathString + '/' + e.label
      }
    })
    this.filePath = null
    setTimeout(() => {
      this.filePath = pathString
      console.log(pathString)
      localStorage.setItem("filePath", pathString);
    }, 10);
  }

  oneNodeSelectedId(e) {
    this.folderId = e.data.id;
    localStorage.setItem("folderId", this.folderId);
  }

}
