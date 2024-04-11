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
import { ButtonPlace, ButtonIcon } from 'src/app/core/models/table-model/table-button.model';
import { TableColumn, FieldType } from 'src/app/core/models/table-model/table-column.model';
import { TableParameter, selectionMode } from 'src/app/core/models/table-model/table-parameter.model';
import { ApiService } from 'src/app/core/services/api.service';
import { CustomTableService } from 'src/app/core/services/custom-table.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { FilterType } from 'src/app/pages/shared/table-template/modules/table-filter.module';

@Component({
  selector: 'app-grouped-support-list',
  templateUrl: './grouped-support-list.component.html',
  styleUrls: ['./grouped-support-list.component.scss']
})
export class GroupedSupportListComponent implements OnInit {

  subscriptions = new Subscription();
  tableParam: TableParameter;
  InspStatus: any[] = []
  items: MenuItem[];

  excelData: any[];
  user: AppUsers
  @Input() parentHeader: any;
  @Input() data:any
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
    if(this.data){
      this.initTableParam()
    }
    
    console.log(this.data)
  }

  async initTableParam() {
    // this.initTableButtons()

    let param: TableParameter = new TableParameter();
    param.api = ApiURL.support_headers
    param.defaultFilter = new Map<any,any>([[this.data.customData,this.data.row[this.data.customData]]])
    // param.defaultFilter = new Map<any,any>([['rsfNo',this.data.row.rsfNo]])
    param.dataKey = 'id'
    param.advancedSearch = true;
    param.alwaysShowAdvanced = true;
    param.columns = this.initTableColumns();
    param.selectionMode = selectionMode.single
    // param.showToggler = true
    // param.withCache = true
    param.scrollHeight = '30vh'
    param.rowPerPageDefault = 10 
    param.onRowSelected = this.onRowSelected
    this.tableParam = param;
    // param.buttons = this.initTableButtons();

  }



  initTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] =
        [
          //Support
          // { title: 'Is Detailed', field: 'isDetailed', fieldType: FieldType.boolean,  filter: { filterType: FilterType.boolean, filterName: 'isDetailed' }},
          // { title: 'Support Id', field: 'support', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'support' }},
          { title: 'Support Item', field: 'suppItem', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'suppItem' }},
          
          { title: 'Support Description', field: 'supStDes', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'supStDes' }},
          { title: 'Support Tag', field: 'supTAG', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'supTAG' }},
          { title: 'Support WT', field: 'supWT', fieldType: FieldType.number, filter: { filterType: FilterType.number, filterName: 'supWT' }},
          { title: 'Is Detailed', field: 'isDetailed', fieldType: FieldType.boolean,  filter: { filterType: FilterType.boolean, filterName: 'isDetailed' }},
          { title: 'RSF No.', field: 'rsfNo', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'rsfNo' }},
          { title: 'rsfStatus', field: 'supportDetails.rsfStatus', fieldType: FieldType.object, 
          filter: { filterType: FilterType.string, filterName: 'rsfStatus' }, objectReference: row => row['supportDetails']['rsfStatus']},
          { title: 'Support Status', field: 'supStatus', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'supStatus' }},
          { title: 'Support Paint Status', field: 'suppPnt', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'suppPnt' }},


          // Support Parent

          { title: 'parentIso', field: 'supportParents.parentIso', fieldType: FieldType.object,  filter: { filterType: FilterType.string, filterName: 'parentIso' }
          , objectReference: row => row['supportParents']['parentIso']},
          { title: 'parentSpl', field: 'supportParents.parentSpl', fieldType: FieldType.object, filter: { filterType: FilterType.string, filterName: 'parentSpl' }
          , objectReference: row => row['supportParents']['parentSpl']},
          { title: 'parentCls', field: 'supportParents.parentCls', fieldType: FieldType.object, filter: { filterType: FilterType.string, filterName: 'parentCls' }
          , objectReference: row => row['supportParents']['parentCls']},
          { title: 'parentIns', field: 'supportParents.parentIns', fieldType: FieldType.object, filter: { filterType: FilterType.string, filterName: 'parentIns' }
          , objectReference: row => row['supportParents']['parentIns']},
          { title: 'parentPnt', field: 'supportParents.parentPnt', fieldType: FieldType.object, filter: { filterType: FilterType.number, filterName: 'parentPnt' }
          , objectReference: row => row['supportParents']['parentPnt']},

          // { title: 'iwpId', field: 'supportParents.iwpId', fieldType: FieldType.object, filter: { filterType: FilterType.string, filterName: 'iwpId' }
          // , objectReference: row => row['supportParents']['iwpId']},
          // { title: 'planFinishDate', field: 'supportParents.planFinishDate', fieldType: FieldType.object, filter: { filterType: FilterType.date_default, filterName: 'planFinishDate' }
          // , objectReference: row => row['supportParents']['planFinishDate']},
          // { title: 'planStartDate', field: 'supportParents.planStartDate', fieldType: FieldType.object, filter: { filterType: FilterType.date_default, filterName: 'planStartDate' }
          // , objectReference: row => row['supportParents']['planStartDate']},

          // //location
          // { title: 'parentCwa', field: 'supportLocation.parentCwa', fieldType: FieldType.object, 
          //  filter: { filterType: FilterType.string, filterName: 'parentCwa' }, objectReference: row => row['supportLocation']['parentCwa']},

          // { title: 'lev01', field: 'supportLocation.lev01', fieldType: FieldType.object, 
          // filter: { filterType: FilterType.string, filterName: 'lev01' }, objectReference: row => row['supportLocation']['lev01']},

          // { title: 'lev01Desc', field: 'supportLocation.lev01Desc', fieldType: FieldType.object, 
          // filter: { filterType: FilterType.string, filterName: 'lev01Desc' }, objectReference: row => row['supportLocation']['lev01Desc']},

          // { title: 'lev02', field: 'supportLocation.lev02', fieldType: FieldType.object, 
          // filter: { filterType: FilterType.string, filterName: 'lev02' }, objectReference: row => row['supportLocation']['lev02']},

          // { title: 'lev02Desc', field: 'supportLocation.lev02Desc', fieldType: FieldType.object, 
          // filter: { filterType: FilterType.string, filterName: 'lev02Desc' }, objectReference: row => row['supportLocation']['lev02Desc']},

          // { title: 'layer', field: 'supportLocation.layer', fieldType: FieldType.object, 
          // filter: { filterType: FilterType.string, filterName: 'layer' }, objectReference: row => row['supportLocation']['layer']},
          // { title: 'suppLocat', field: 'supportLocation.suppLocat', fieldType: FieldType.object, 
          // filter: { filterType: FilterType.string, filterName: 'suppLocat' }, objectReference: row => row['supportLocation']['suppLocat']},

          // //supportDetails
          // { title: 'sRange', field: 'supportDetails.sRange', fieldType: FieldType.object, 
          //  filter: { filterType: FilterType.string, filterName: 'sRange' }, objectReference: row => row['supportDetails']['sRange']},

          // { title: 'supCode', field: 'supportDetails.supCode', fieldType: FieldType.object, 
          //  filter: { filterType: FilterType.string, filterName: 'supCode' }, objectReference: row => row['supportDetails']['supCode']},

          // { title: 'suppType', field: 'supportDetails.suppType', fieldType: FieldType.object, 
          // filter: { filterType: FilterType.string, filterName: 'suppType' }, objectReference: row => row['supportDetails']['suppType']},

          // { title: 'train', field: 'supportDetails.train', fieldType: FieldType.object, 
          // filter: { filterType: FilterType.string, filterName: 'train' }, objectReference: row => row['supportDetails']['train']},

          // { title: 'location', field: 'supportDetails.location', fieldType: FieldType.object, 
          // filter: { filterType: FilterType.string, filterName: 'location' }, objectReference: row => row['supportDetails']['location']},

          // { title: 'suppCat', field: 'supportDetails.suppCat', fieldType: FieldType.object, 
          // filter: { filterType: FilterType.string, filterName: 'suppCat' }, objectReference: row => row['supportDetails']['suppCat']},

          // { title: 'splCntr', field: 'supportDetails.splCntr', fieldType: FieldType.object, 
          // filter: { filterType: FilterType.string, filterName: 'splCntr' }, objectReference: row => row['supportDetails']['splCntr']},

          // { title: 'ccc', field: 'supportDetails.ccc', fieldType: FieldType.object, 
          // filter: { filterType: FilterType.string, filterName: 'ccc' }, objectReference: row => row['supportDetails']['ccc']},

          // { title: 'sC', field: 'supportDetails.sC', fieldType: FieldType.object, 
          // filter: { filterType: FilterType.string, filterName: 'sC' }, objectReference: row => row['supportDetails']['sC']},

          // { title: 'pipe', field: 'supportDetails.pipe', fieldType: FieldType.object, 
          // filter: { filterType: FilterType.string, filterName: 'pipe' }, objectReference: row => row['supportDetails']['pipe']},

          // { title: 'pipeType', field: 'supportDetails.pipeType', fieldType: FieldType.object, 
          // filter: { filterType: FilterType.string, filterName: 'pipeType' }, objectReference: row => row['supportDetails']['pipeType']},

          // { title: 'fab', field: 'supportDetails.fab', fieldType: FieldType.object, 
          // filter: { filterType: FilterType.string, filterName: 'fab' }, objectReference: row => row['supportDetails']['fab']},


          // { title: 'scScope', field: 'supportDetails.scScope', fieldType: FieldType.object, 
          // filter: { filterType: FilterType.string, filterName: 'scScope' }, objectReference: row => row['supportDetails']['scScope']},

          // { title: 'supcount', field: 'supportDetails.supcount', fieldType: FieldType.object, 
          // filter: { filterType: FilterType.string, filterName: 'supcount' }, objectReference: row => row['supportDetails']['supcount']},

          
          // // { title: 'status', field: 'supportDetails.status', fieldType: FieldType.object, 
          // // filter: { filterType: FilterType.string, filterName: 'status' }, objectReference: row => row['supportDetails']['status']},

          // { title: 'rse', field: 'supportDetails.rse', fieldType: FieldType.object, 
          // filter: { filterType: FilterType.string, filterName: 'rse' }, objectReference: row => row['supportDetails']['rse']},

          // { title: 'rseDate', field: 'supportDetails.rseDate', fieldType: FieldType.object, 
          // filter: { filterType: FilterType.date_default, filterName: 'rseDate' }, objectReference: row => row['supportDetails']['rseDate']},
         
          
        ];
      return tableColumns;
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


}
