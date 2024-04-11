import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { AppUsers } from 'src/app/core/models/app-users.model';
import { SecurityAction } from 'src/app/core/models/security-model/security-action.model';
import { ISecurityButton } from 'src/app/core/models/security-model/security-component.model';
import { SecurityEntity } from 'src/app/core/models/security-model/security-entity.model';
import { SupportFormFields } from 'src/app/core/models/support-forms-models/support-form-fields.model';
import { ButtonPlace, ButtonIcon, TableButton } from 'src/app/core/models/table-model/table-button.model';
import { TableColumn, FieldType } from 'src/app/core/models/table-model/table-column.model';
import { TableFunctionArgument } from 'src/app/core/models/table-model/table-function-argument';
import { TableParameter, selectionMode } from 'src/app/core/models/table-model/table-parameter.model';
import { ApiService } from 'src/app/core/services/api.service';
import { CustomTableService } from 'src/app/core/services/custom-table.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { GroupedSupportListComponent } from 'src/app/pages/fabrication-management/Support-fabrication-module/supports/component/grouped-support-list/grouped-support-list.component';
import { FilterType } from 'src/app/pages/shared/table-template/modules/table-filter.module';

@Component({
  selector: 'app-rsf-supports-table',
  templateUrl: './rsf-supports-table.component.html',
  styleUrls: ['./rsf-supports-table.component.scss']
})
export class RsfSupportsTableComponent implements OnInit {

  subscriptions = new Subscription();
  tableParam: TableParameter;
  InspStatus: any[] = []
  items: MenuItem[];
  isGrouped:boolean = false
  excelData: any[];
  user: AppUsers
  groupButtons : any[] = []
  selectedGroup:any
  hideGroup:boolean = false
  @Input() rsfHeader: SupportFormFields[];
  constructor(private router: Router,
    private tableService: CustomTableService,
    private utilities: UtilitiesService,
    private dialogService: DialogService,
    private apiService: ApiService,
    private dynamicDialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef) {
    // this.initTableParam()
  }
  ngOnInit(): void {
    this.initTableParam()
  }

  async initTableParam() {
    // this.initTableButtons()
    let rsfNo = this.rsfHeader.filter(rsf =>rsf.fieldName == 'order_no')[0]
    let param: TableParameter = new TableParameter();
    param.dataKey = 'support'
    param.advancedSearch = true;
    param.alwaysShowAdvanced = true;
    param.columns = this.initTableColumns();
    param.selectionMode = selectionMode.single
    param.api = ApiURL.support_headers
    param.defaultFilter = new Map<any,any>([['rsfNo',rsfNo.fieldOptions]])
    // param.onRowSelected = this.onRowSelected
    this.tableParam = param;

  }



  initTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] = []
        
          //Support
          // { title: 'Is Detailed', field: 'isDetailed', fieldType: FieldType.boolean,  filter: { filterType: FilterType.boolean, filterName: 'isDetailed' }},
          if(this.isGrouped){
            tableColumns.push(
              { title: this.selectedGroup.label, field: this.selectedGroup.id.includes(".") ? this.selectedGroup.id.split(".")[1] : this.selectedGroup.id, fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'support' }}
            )
          }
          
        
        if(!this.isGrouped){
          tableColumns.push(
            { title: 'Support Tag', field: 'supTAG', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'supTAG' }},
            { title: 'Support Description', field: 'supStDes', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'supStDes' }},
            { title: 'Parent Isono', field: 'supportParents.parentIso', fieldType: FieldType.object,  filter: { filterType: FilterType.string, filterName: 'parentIso' }
            , objectReference: row => row['supportParents']['parentIso']},

            { title: 'Parent Spool', field: 'supportParents.parentSpl', fieldType: FieldType.object, filter: { filterType: FilterType.string, filterName: 'parentSpl' }
            , objectReference: row => row['supportParents']['parentSpl']},
            { title: 'Parent class', field: 'supportParents.parentCls', fieldType: FieldType.object, filter: { filterType: FilterType.string, filterName: 'parentCls' }
            , objectReference: row => row['supportParents']['parentCls']},

          { title: 'Support Type', field: 'support', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'support' }},

          { title: 'Support Serial', field: 'suppItem', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'suppItem' }},

          { title: 'Support Paint', field: 'suppPnt', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'suppPnt' }},
          { title: 'Iso Paint', field: 'supportParents.parentPnt', fieldType: FieldType.object, filter: { filterType: FilterType.number, filterName: 'parentPnt' }
          , objectReference: row => row['supportParents']['parentPnt']},        
          { title: 'Weight (KG)', field: 'supWT', fieldType: FieldType.number, filter: { filterType: FilterType.number, filterName: 'supWT' }},
          )
        }
          

      return tableColumns;
  }

 
  onQuickFilterClick(e){
    // console.log(e)
    if(this.selectedGroup?.id == e.id){
      this.isGrouped = !this.isGrouped
      this.selectedGroup = null
    }else{
      this.isGrouped = true
      this.selectedGroup = e
    }
    
    this.tableParam = null
    setTimeout(() => {
      this.initTableParam()
  }, 10);
       
  }

  onRowSelected = (event): Promise<void> => {
    return new Promise((resolve, reject) => {
      let parm = {
        id: event.selected.id,
      }
      this.router.navigate(['support-fabrication/supports-detail', parm])
      this.dialogRef.close(event)
      resolve();
    });
  }

  exportData = (event): Promise<void> =>{
    return new Promise((resolve,reject) =>{

      
      this.utilities.exportAsExcelFile(event.data,'Support - ' + new Date().toISOString())
      resolve();
    })
  }
  initTableButtons(): ISecurityButton[] {
    let tableButtons: ISecurityButton[] = [

      { title: 'Export', place: ButtonPlace.header, icon: ButtonIcon.export, disabled: false, 
      entity: [SecurityEntity.settings], action: SecurityAction.read ,
    items: [
      { label: 'Export Current Page',  icon: ButtonIcon.export, command: this.exportData, },
      { label: 'Export All',  icon: ButtonIcon.export, command: this.exportData},

    ]},


    
  ]
    return tableButtons;
  }

  initDialogTableButtons(): TableButton[] {
    let tableButtons: TableButton[] = [
      { title: 'Add', place: ButtonPlace.footer, customFunction: this.closeDialog, disabled: true },
    ]
    return tableButtons;
  }
  closeDialog = (args: TableFunctionArgument): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (args.selected) {
        this.dialogRef.close(args.selected);
      }
      if (args.selectedObjects && args.selectedObjects.length > 0) {
        this.dialogRef.close(args.selectedObjects);
      }
      else {
        this.dialogRef.close(null);
      }
      resolve();
    });
  }
  closeSelectedDialog = (args: TableFunctionArgument): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (args.selected) {
        this.dialogRef.close(args.selected);
      }
      if (args.selectedObjects && args.selectedObjects.length > 0) {
        this.dialogRef.close(args.selectedObjects);
      }
    });
  }

}
