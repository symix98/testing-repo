import { Component, OnInit } from '@angular/core';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ISecurityButton } from 'src/app/core/models/security-model/security-component.model';
import { FieldType, TableColumn } from 'src/app/core/models/table-model/table-column.model';
import { editMode, selectionMode, TableParameter } from 'src/app/core/models/table-model/table-parameter.model';
import { ApiService } from 'src/app/core/services/api.service';
import { CustomTableService } from 'src/app/core/services/custom-table.service';
import { FilterType } from '../shared/table-template/modules/table-filter.module';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  tableParam: TableParameter;
  constructor( private tableService: CustomTableService,private apiSevice:ApiService) {
    this.initTableParams();
   }

  ngOnInit(): void {
    this.apiSevice.get(ApiURL.documents).subscribe(data=>{
      console.log("Data :: ", data)
    })
  }

  initTableParams() {
    let param: TableParameter= new TableParameter();
  //  / param.buttons = this.initTableButtons();
    param.columns = this.initTableColumns();
    
     param.selectionMode = selectionMode.single;
    // param.selectionMode = selectionMode.mulitple;
    param.api = ApiURL.documents;
    param.editMode = editMode.redirect;
    param.dataKey = "caption"
    param.advancedSearch = true;
    param.alwaysShowAdvanced = true;
    // param.rowEdit = this.submit;
    param.onRowSelected = this.onRowSelected;
     param.sort ="documentId.documentId"
    this.tableParam = param;
  }
  initTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] =
      [
        // { title: 'ID/Name', field: 'documentId', filter: { filterType: FilterType.string, filterName: 'documentId' }, fieldType: FieldType.string, width: '20 %' },
        { title: 'Document Id',  field: 'documentId.documentId', filter: { filterType: FilterType.string, filterName: 'documentId' }, fieldType: FieldType.object, objectReference: row => row['documentId']['documentId'], width: '10%' },
        { title: 'Service Id', field: 'documentId.serviceId', filter: { filterType: FilterType.string, filterName: 'serviceId' }, fieldType: FieldType.object, objectReference: row => row['documentId']['serviceId'], width: '30%' },
       { title: 'Folder', fieldSearchReference: 'folder', field: 'documentId.folder', filter: { filterType: FilterType.string, filterName: 'folder' }, fieldType: FieldType.object, objectReference: row => row['documentId']['folder'], width: '10%' },
        // { title: 'Service URI', disableSort:false,filterable:true, field: 'serviceURI', filter: { filterType: FilterType.string, filterName: 'serviceURI' }, fieldType: FieldType.string, width: '3%' },
        { title: 'Title',disableSort:false,field: 'title',filter: { filterType: FilterType.string, filterName: 'title' },  fieldType: FieldType.string, width: '10%' },
        // { title: 'Description',disableSort:false,field: 'description', fieldType: FieldType.string, width: '5%' },
        // { title: 'Version',disableSort:false,field: 'version', fieldType: FieldType.string, width: '3%' },
        { title: 'Mime Type', field: 'mimeType', filter: { filterType: FilterType.string, filterName: 'mimeType' }, fieldType: FieldType.string, width: '10%' },
         { title: 'File Name',disableSort:false,field: 'fileName',filter: { filterType: FilterType.string, filterName: 'fileName' }, fieldType: FieldType.string, width: '5%' },
        // { title: 'Meta Data',disableSort:false,field: 'metaData', fieldType: FieldType.string, width: '5%'},
        // { title: 'Readers',disableSort:false,field: 'readers', fieldType: FieldType.string, width: '3%' },
        // { title: 'Editors',disableSort:false,field: 'editors', fieldType: FieldType.string, width: '4%' },
        // { title: 'Created By',disableSort:false,field: 'createdBy', fieldType: FieldType.string, width: '4%' },
        { title: 'Created Date',disableSort:false,field: 'createdDate',filter: { filterType: FilterType.string, filterName: 'createdDate' }, fieldType: FieldType.date, width: '10%' },
        // { title: 'LastModified By',disableSort:false,field: 'lastModifiedBy', fieldType: FieldType.string, width: '4%' },
        { title: 'LastModified Date',disableSort:false,field: 'lastModifiedDate',filter: { filterType: FilterType.string, filterName: 'lastModifiedDate' }, fieldType: FieldType.date, width: '10%'}
      ]
    return tableColumns;
  }

  initTableButtons(): ISecurityButton[] {
    let tableButtons: ISecurityButton[] = [
      // { title: 'Add New Service', place: ButtonPlace.header, icon: ButtonIcon.add, customFunction: this.tableService.addRow, disabled: false, entity:[SecurityEntity.settings], action: SecurityAction.create }
      // , { title: 'Delete', place: ButtonPlace.header, icon: ButtonIcon.delete, customFunction: this.tableService.delete, disabled: true, entity:[SecurityEntity.settings], action: SecurityAction.manage }

    ]
    return tableButtons;
  }

  onRowSelected = (event): Promise<void> => {
    return new Promise((resolve, reject) => {
          console.log("Evenent selected " , event.selected)
      // const param = this.storageService ? { serviceId: event?.selected?.serviceId } : { serviceId: event?.selected?.serviceId  };
      // this.router.navigate(['services/create', event.selected == null ? {} : param]);
      resolve();
    });
  }

  submit = (event?): Promise<void> => {
    return new Promise((resolve, reject) => {
     resolve();
    });
  }

}
