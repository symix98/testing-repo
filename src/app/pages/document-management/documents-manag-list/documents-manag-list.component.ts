import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { AppUsers } from 'src/app/core/models/app-users.model';
import { ISecurityButton } from 'src/app/core/models/security-model/security-component.model';
import {
  TableColumn,
  FieldType,
} from 'src/app/core/models/table-model/table-column.model';
import {
  TableParameter,
  selectionMode,
} from 'src/app/core/models/table-model/table-parameter.model';
import { ApiService } from 'src/app/core/services/api.service';
import { CustomTableService } from 'src/app/core/services/custom-table.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { PopupMtoDetailsComponent } from '../../shared/table-template/compnents/popup-mto-details/popup-mto-details.component';
import { FilterType } from '../../shared/table-template/modules/table-filter.module';
import { DocumentFormWizzardComponent } from '../../document-form-wizzard/document-form-wizzard.component';
import { TableIconComponent } from '../../shared/table-template/compnents/table-icon/table-icon.component';
import { TableRowMenuComponent } from '../../shared/table-template/compnents/table-row-menu/table-row-menu.component';
import { TreeDataSourceService } from 'src/app/core/services/tree-datasource.service';
import { CreateNewFolderComponent } from '../components/create-new-folder/create-new-folder.component';

@Component({
  selector: 'app-documents-manag-list',
  templateUrl: './documents-manag-list.component.html',
  styleUrls: ['./documents-manag-list.component.scss'],
})
export class DocumentsManagListComponent implements OnInit, OnChanges {

  subscriptions = new Subscription();
  tableParam: TableParameter;
  InspStatus: any[] = [];
  items: MenuItem[];
  steps: MenuItem[];
  visible: boolean = false;
  showUploadDialog: boolean = false;
  private treeDataSourceService: TreeDataSourceService
  excelData: any[];
  listOfDocs: any[]
  user: AppUsers;
  @Input() path: any;
  @Input() breadcrumbPath: MenuItem[];
  @Input() folderNum: number;
  docProp: any;

  constructor(
    private router: Router,
    private tableService: CustomTableService,
    private utilities: UtilitiesService,
    private dialogService: DialogService,
    private apiService: ApiService,
    private dynamicDialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private treeDatasourceService: TreeDataSourceService) {
    // this.initTableParam()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.path) {
      this.tableParam = null
      setTimeout(() => {
        this.initTableParam()
      }, 10);
    }
  }

  ngOnInit(): void {
    this.treeDatasourceService.isClosedNewFileDialog.subscribe((value) => {
      this.visible = false
      this.showUploadDialog = true
      this.docProp = value
      // this.onDialogHide()
    })

    this.treeDatasourceService.refreshTable.subscribe((value) => {
      this.tableParam = null
      setTimeout(() => {
        this.initTableParam();
      }, 10);
    })

    this.treeDatasourceService.filesToUpload.subscribe((value) => {
      this.listOfDocs = value
      console.log(this.listOfDocs)
    })

    this.initTableParam();

    this.utilities.dialogVisibility$.subscribe((visibility) => {
      this.visible = visibility;
    });

    this.items = [
      {
        label: 'New Folder', icon: 'pi pi-folder', command: () => { this.createNewFolder(); }
      },
      {
        label: 'New Files', icon: 'pi pi-file', command: () => { this.showDialog(); }
      },
      {
        label: 'Create Document Set', icon: 'pi pi-file', command: () => {
          // this.showDialog()
        }
      },
    ];

    this.steps = [{
      label: 'Document Upload',
      routerLink: 'document-upload'
    },
    {
      label: 'Document Numbering',
      routerLink: 'document-numbering'
    },
    {
      label: 'Document Properties',
      routerLink: 'document-multiple'
    }];
  }

  createNewFolder() {
    this.dialogService.open(CreateNewFolderComponent, {
      header: 'Create New Folder',
      width: '60%',
      data: {
        location: this.path
      }
    }).onClose.subscribe((res) => {
      this.tableParam = null
      setTimeout(() => {
        this.initTableParam()
      }, 10);
    });
  }

  async initTableParam() {
    let param: TableParameter = new TableParameter();
    param.api = ApiURL.documentss + "?projectField1.notEquals=history"
    param.defaultFilter = new Map<any, any>([['path', this.path]])
    param.dataKey = 'id'
    param.advancedSearch = true;
    param.alwaysShowAdvanced = true;
    param.columns = this.initTableColumns();
    param.selectionMode = selectionMode.mulitple
    param.showToggler = true
    param.scrollHeight = "65vh"
    param.onRowSelected = this.onRowSelected
    this.tableParam = param;
    param.buttons = this.initTableButtons();
  }

  initTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] =
      [
        { title: 'document', field: 'documentsNumber', fieldType: FieldType.component, width: '20%', specialColumn: TableIconComponent, filter: { filterType: FilterType.string, filterName: 'documentsNumber' } },
        { title: '', field: '', fieldType: FieldType.component1, width: 'auto', specialColumn: TableRowMenuComponent, disableSort: true },
        { title: 'Title', field: 'title', fieldType: FieldType.string, width: '15%', filter: { filterType: FilterType.string, filterName: 'title' } },
        { title: 'Document Type', field: 'documentsType', fieldType: FieldType.object,objectReference:row =>row["documentsType"]?.name, width: '15%', filter: { filterType: FilterType.string, filterName: 'documentsType' } },
        { title: 'Status', field: 'sstatus', fieldType: FieldType.string, width: '15%', filter: { filterType: FilterType.string, filterName: 'sstatus' } },
        // { title: 'Version', field: 'version', fieldType: FieldType.string, width: '15%', filter: { filterType: FilterType.string, filterName: 'version' } },
        { title: 'Revision', field: 'revision', fieldType: FieldType.string, width: '15%', filter: { filterType: FilterType.string, filterName: 'revision' } },
        { title: 'Revision Date', field: 'revisionDate', fieldType: FieldType.date, width: '10%', filter: { filterType: FilterType.date_default, filterName: 'revisionDate' } },
        { title: 'File Type', field: 'fileType', fieldType: FieldType.string, width: '15%', filter: { filterType: FilterType.string, filterName: 'fileType' } },
        { title: 'Created By', field: 'createdBy', fieldType: FieldType.string, width: '15%', filter: { filterType: FilterType.string, filterName: 'createdBy' } },
        { title: 'Modified Date', field: 'dateModified', fieldType: FieldType.date, width: '15%', filter: { filterType: FilterType.date_default, filterName: 'dateModified' } },
        { title: 'File Size', field: 'ssize', fieldType: FieldType.string, width: '15%', filter: { filterType: FilterType.string, filterName: 'ssize' } },
        { title: 'Discipline', field: 'disciplines', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'disciplines' }, isHide: true },
        { title: 'Phase', field: 'phase', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'phase' }, isHide: true },
        { title: 'Class', field: 'classes', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'classes' }, isHide: true },
        { title: 'Documents For', field: 'documentsFor', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'documentsFor' }, isHide: true },
        { title: 'Initiated By', field: 'initiatedBy', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'initiatedBy' }, isHide: true },
        { title: 'Receive Date', field: 'receiveDate', fieldType: FieldType.date, filter: { filterType: FilterType.date_default, filterName: 'receiveDate' }, isHide: true },
        { title: 'Reply Required', field: 'replyRequired', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'replyRequired' }, isHide: true },
        { title: 'Reply Required By', field: 'replyRequiredBy', fieldType: FieldType.date, filter: { filterType: FilterType.date_default, filterName: 'replyRequiredBy' }, isHide: true },
        { title: 'Replied Date', field: 'repliedDate', fieldType: FieldType.date, filter: { filterType: FilterType.date_default, filterName: 'repliedDate' }, isHide: true },
        { title: 'TQ Status', field: 'tqStatus', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'tqStatus' }, isHide: true },
        { title: 'Path', field: 'path', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'path' }, isHide: true },
        { title: 'Work Flow', field: 'workflow', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'workflow' }, isHide: true },
        { title: 'Current Step', field: 'currentStep', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'currentStep' }, isHide: true },
        { title: 'Transmitted', field: 'isTransmitted', fieldType: FieldType.boolean, filter: { filterType: FilterType.boolean, filterName: 'isTransmitted' }, isHide: true },
        { title: 'Confidential', field: 'confidential', fieldType: FieldType.boolean, filter: { filterType: FilterType.boolean, filterName: 'confidential' }, isHide: true },
        { title: 'Additional Reference', field: 'additionalReference', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'additionalReference' }, isHide: true },
        { title: 'Review Status', field: 'reviewStatus', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'reviewStatus' }, isHide: true },
        { title: 'Model Reference', field: 'modelReference', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'modelReference' }, isHide: true },
        { title: 'Related Items', field: 'relatedItems', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'relatedItems' }, isHide: true },
        { title: 'Access Level', field: 'accessLevel', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'accessLevel' }, isHide: true },
        { title: 'Csi Spec Code', field: 'csiSpecCode', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'csiSpecCode' }, isHide: true },
        { title: 'Current', field: 'current', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'current' }, isHide: true },
        { title: 'Facility Code', field: 'facilityCode', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'facilityCode' }, isHide: true },
        { title: 'File Name', field: 'fileName', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'fileName' }, isHide: true },
        { title: 'Forecast Subm To Client', field: 'forecastSubmToClient', fieldType: FieldType.date, filter: { filterType: FilterType.date_default, filterName: 'forecastSubmToClient' }, isHide: true },
        { title: 'Job Number', field: 'jobNumber', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'jobNumber' }, isHide: true },
        { title: 'Lock', field: 'lock', fieldType: FieldType.boolean, filter: { filterType: FilterType.boolean, filterName: 'lock' }, isHide: true },
        { title: 'Last Modified Date', field: 'lastModifiedDate', fieldType: FieldType.date, filter: { filterType: FilterType.date_default, filterName: 'lastModifiedDate' }, isHide: true },
        { title: 'Milestone', field: 'milestone', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'milestone' }, isHide: true },
        { title: 'No Of Markups', field: 'numberOfMarkups', fieldType: FieldType.number, filter: { filterType: FilterType.number, filterName: 'numberOfMarkups' }, isHide: true },
        { title: 'Activity Id', field: 'activityId', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'activityId' }, isHide: true },
        { title: 'Planned Submit Date', field: 'plannedSubmissionDate', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'plannedSubmissionDate' }, isHide: true },
        { title: 'Print Size', field: 'printSize', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'printSize' }, isHide: true },
        { title: 'Purchase Order', field: 'purchaseOrder', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'purchaseOrder' }, isHide: true },
        { title: 'Remarks', field: 'remarks', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'remarks' }, isHide: true },
        { title: 'Review Source', field: 'reviewSource', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'reviewSource' }, isHide: true },
      ];
    return tableColumns;
  }

  onRowSelected = (event): Promise<void> => {
    return new Promise((resolve, reject) => {
      // let parm = {
      //   id: event.selected.id,
      // }
      // this.router.navigate(['support-fabrication/mto/mto-form', parm])
      // this.dialogRef.close(event)
      if (event.selected.fileType == 'FOLDER') {
        this.path = this.path + '/' + event.selected.documentsNumber;
        this.navigate()
      }
      resolve();
    });
  }

  initTableButtons(): ISecurityButton[] {
    let tableButtons: ISecurityButton[] = [
      //  { title: 'Export', place: ButtonPlace.footer, icon: ButtonIcon.export, customFunction: this.exportData, disabled: false, entity: [SecurityEntity.settings], action: SecurityAction.read },
    ]
    return tableButtons;
  }

  onBcItemClick(e) {
    console.log(this.breadcrumbPath.slice(0, parseInt(e.item.id) + 1))
    this.breadcrumbPath = this.breadcrumbPath.slice(0, parseInt(e.item.id) + 1)
    this.path = this.breadcrumbPath.map(obj => obj.label).join('/');
    this.tableParam = null
    setTimeout(() => {
      this.initTableParam()
    }, 10);
  }

  navigate() {
    this.tableParam = null
    this.breadcrumbPath = []
    this.path.split('/').forEach((f, i) => {
      this.breadcrumbPath.push({ label: f, id: i + '' })
    })
    this.breadcrumbPath[0].icon = 'pi pi-home pi-fw'
    setTimeout(() => {
      this.initTableParam()
    }, 10);
  }
  // openDocumentWizzard() {
  //     this.dialogService
  //       .open(DocumentFormWizzardComponent, {
  //         width: '70vw',
  //         contentStyle: {
  //           'max-height': '500px',
  //           'over-flow:': 'auto',
  //         },
  //       })
  // }

  showDialog() {
    sessionStorage.removeItem('docList')
    sessionStorage.removeItem('docNumber')
    this.visible = true;
    this.router.navigate(['documents/libraries/document-upload'])
  }

  onDialogHide() {
    // sessionStorage.removeItem('docList')
    // sessionStorage.removeItem('docNumber')
    // this.router.navigate(['documents/libraries'])
  }

  onFileUpload(event) {
    this.tableParam = null
    setTimeout(() => {
      this.initTableParam()
    }, 10);
  }

  onUploadDialogHide() {
    this.listOfDocs = []
  }

}
