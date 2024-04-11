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
import { GroupedSupportListComponent } from '../supports/component/grouped-support-list/grouped-support-list.component';
import { DateService } from 'src/app/core/services/date.service';
import { TableIconComponent } from 'src/app/pages/shared/table-template/compnents/table-icon/table-icon.component';

@Component({
  selector: 'app-support-forcast',
  templateUrl: './support-forcast.component.html',
  styleUrls: ['./support-forcast.component.scss']
})
export class SupportForcastComponent implements OnInit {

  subscriptions = new Subscription();
  tableParam: TableParameter;
  InspStatus: any[] = []
  items: MenuItem[];
  isGrouped:boolean = false
  excelData: any[];
  user: AppUsers
  groupButtons : any[] = []
  selectedGroup:any
  startDate:Date
  finishDate:Date
  withDrs:boolean = true
  @Input() parentHeader: any;
  constructor(private router: Router,
    private tableService: CustomTableService,
    private utilities: UtilitiesService,
    private dialogService: DialogService,
    private apiService: ApiService,
    private dynamicDialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private dateService : DateService) {
    // this.initTableParam()
  }
  ngOnInit(): void {
    
    this.groupButtons =  [
      {label: 'Support Id',id: 'support'},
      { label: 'Support Item', id: 'suppItem'},
      { label: 'Support Tag', id: 'supTAG'},
      {label: 'Support Statuses',id: 'supStatus'},
      {label: 'RSFs',id: 'rsfNo'},
    ];
    this.startDate = new Date()
    this.finishDate = new Date(new Date(new Date()).setMonth(new Date().getMonth() + 6))

    this.initTableParam()
  }
  onSearch(){
    this.tableParam = null
    setTimeout(() => {
      this.initTableParam()
    }, 10);
    
  }
  async initTableParam() {
    // this.initTableButtons()
    
    let param: TableParameter = new TableParameter();
    param.dataKey = this.selectedGroup ? this.selectedGroup.id : 'support' 
    param.advancedSearch = true;
    param.alwaysShowAdvanced = true;
    // param.rowPerPageDefault = 15
    param.columns = this.initTableColumns();
    param.selectionMode = selectionMode.single
    param.showToggler = true
    param.scrollHeight = "60vh"
    // param.filterName = "Group By: "
    if(this.withDrs){
      param.api = ApiURL.support_headers + "?planStartDate.greaterThanOrEqual=" + this.dateService.systemDateFormat(this.startDate)
      + "&planStartDate.lessThanOrEqual=" + this.dateService.systemDateFormat( this.finishDate) +  "&scScope.contains=CTJV";
    }else{
      param.api = ApiURL.support_headers + "?planStartDate.greaterThanOrEqual=" + this.dateService.systemDateFormat(this.startDate)
       + "&planStartDate.lessThanOrEqual=" + this.dateService.systemDateFormat( this.finishDate);
    }
      
      param.onRowSelected = this.onRowSelected
      param.buttons = this.initTableButtons();
    this.tableParam = param;

  }



  initTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] = []
        
          //Support
          // { title: 'Is Detailed', field: 'isDetailed', fieldType: FieldType.boolean,  filter: { filterType: FilterType.boolean, filterName: 'isDetailed' }},
          if(this.isGrouped){
            tableColumns.push(
              { title: this.selectedGroup.label, field: this.selectedGroup.id, fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'support' }}
            )
          }
          
        
        if(!this.isGrouped){
          tableColumns.push(
            {title: '',field:'',width:'5%' ,fieldType: FieldType.component, specialColumn : TableIconComponent, disableSort:true,isOption:true},

          { title: 'Support Id', field: 'support', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'support' }},
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

          { title: 'splStatus', field: 'supportParents.splStatus', fieldType: FieldType.object, filter: { filterType: FilterType.string, filterName: 'splStatus' }
          , objectReference: row => row['supportParents']['splStatus']},

          { title: 'splWeight', field: 'supportParents.splWeight', fieldType: FieldType.object, filter: { filterType: FilterType.number, filterName: 'splWeight' }
          , objectReference: row => row['supportParents']['splWeight']},
          
          { title: 'parentCls', field: 'supportParents.parentCls', fieldType: FieldType.object, filter: { filterType: FilterType.string, filterName: 'parentCls' }
          , objectReference: row => row['supportParents']['parentCls']},

          { title: 'parentMat', field: 'supportParents.parentMat', fieldType: FieldType.object, filter: { filterType: FilterType.string, filterName: 'parentMat' }
          , objectReference: row => row['supportParents']['parentMat']},

          { title: 'parentIns', field: 'supportParents.parentIns', fieldType: FieldType.object, filter: { filterType: FilterType.string, filterName: 'parentIns' }
          , objectReference: row => row['supportParents']['parentIns']},
          { title: 'parentPnt', field: 'supportParents.parentPnt', fieldType: FieldType.object, filter: { filterType: FilterType.number, filterName: 'parentPnt' }
          , objectReference: row => row['supportParents']['parentPnt']},

          { title: 'splRff', field: 'supportParents.splRff', fieldType: FieldType.object, filter: { filterType: FilterType.string, filterName: 'splRff' }
          , objectReference: row => row['supportParents']['splRff']},

          { title: 'parentPnt', field: 'supportParents.parentPnt', fieldType: FieldType.object, filter: { filterType: FilterType.number, filterName: 'parentPnt' }
          , objectReference: row => row['supportParents']['parentPnt']},


          { title: 'iwpId', field: 'supportParents.iwpId', fieldType: FieldType.object, filter: { filterType: FilterType.string, filterName: 'iwpId' }
          , objectReference: row => row['supportParents']['iwpId']},
          { title: 'planFinishDate', field: 'supportParents.planFinishDate', fieldType: FieldType.object, filter: { filterType: FilterType.date_default, filterName: 'planFinishDate' }
          , objectReference: row => row['supportParents']['planFinishDate']},
          { title: 'planStartDate', field: 'supportParents.planStartDate', fieldType: FieldType.object, filter: { filterType: FilterType.date_default, filterName: 'planStartDate' }
          , objectReference: row => row['supportParents']['planStartDate']},

          //location
          { title: 'parentCwa', field: 'supportLocation.parentCwa', fieldType: FieldType.object, 
           filter: { filterType: FilterType.string, filterName: 'parentCwa' }, objectReference: row => row['supportLocation']['parentCwa']},

          { title: 'lev01', field: 'supportLocation.lev01', fieldType: FieldType.object, 
          filter: { filterType: FilterType.string, filterName: 'lev01' }, objectReference: row => row['supportLocation']['lev01']},

          { title: 'lev01Desc', field: 'supportLocation.lev01Desc', fieldType: FieldType.object, 
          filter: { filterType: FilterType.string, filterName: 'lev01Desc' }, objectReference: row => row['supportLocation']['lev01Desc']},

          { title: 'lev02', field: 'supportLocation.lev02', fieldType: FieldType.object, 
          filter: { filterType: FilterType.string, filterName: 'lev02' }, objectReference: row => row['supportLocation']['lev02']},

          { title: 'lev02Desc', field: 'supportLocation.lev02Desc', fieldType: FieldType.object, 
          filter: { filterType: FilterType.string, filterName: 'lev02Desc' }, objectReference: row => row['supportLocation']['lev02Desc']},

          { title: 'layer', field: 'supportLocation.layer', fieldType: FieldType.object, 
          filter: { filterType: FilterType.string, filterName: 'layer' }, objectReference: row => row['supportLocation']['layer']},
          { title: 'suppLocat', field: 'supportLocation.suppLocat', fieldType: FieldType.object, 
          filter: { filterType: FilterType.string, filterName: 'suppLocat' }, objectReference: row => row['supportLocation']['suppLocat']},

          //supportDetails
          { title: 'sRange', field: 'supportDetails.sRange', fieldType: FieldType.object, 
           filter: { filterType: FilterType.string, filterName: 'sRange' }, objectReference: row => row['supportDetails']['sRange']},

          { title: 'supCode', field: 'supportDetails.supCode', fieldType: FieldType.object, 
           filter: { filterType: FilterType.string, filterName: 'supCode' }, objectReference: row => row['supportDetails']['supCode']},

          { title: 'suppType', field: 'supportDetails.suppType', fieldType: FieldType.object, 
          filter: { filterType: FilterType.string, filterName: 'suppType' }, objectReference: row => row['supportDetails']['suppType']},

          { title: 'train', field: 'supportDetails.train', fieldType: FieldType.object, 
          filter: { filterType: FilterType.string, filterName: 'train' }, objectReference: row => row['supportDetails']['train']},

          { title: 'location', field: 'supportDetails.location', fieldType: FieldType.object, 
          filter: { filterType: FilterType.string, filterName: 'location' }, objectReference: row => row['supportDetails']['location']},

          { title: 'suppCat', field: 'supportDetails.suppCat', fieldType: FieldType.object, 
          filter: { filterType: FilterType.string, filterName: 'suppCat' }, objectReference: row => row['supportDetails']['suppCat']},

          { title: 'splCntr', field: 'supportDetails.splCntr', fieldType: FieldType.object, 
          filter: { filterType: FilterType.string, filterName: 'splCntr' }, objectReference: row => row['supportDetails']['splCntr']},

          { title: 'ccc', field: 'supportDetails.ccc', fieldType: FieldType.object, 
          filter: { filterType: FilterType.string, filterName: 'ccc' }, objectReference: row => row['supportDetails']['ccc']},

          { title: 'sC', field: 'supportDetails.sC', fieldType: FieldType.object, 
          filter: { filterType: FilterType.string, filterName: 'sC' }, objectReference: row => row['supportDetails']['sC']},

          { title: 'pipe', field: 'supportDetails.pipe', fieldType: FieldType.object, 
          filter: { filterType: FilterType.string, filterName: 'pipe' }, objectReference: row => row['supportDetails']['pipe']},

          { title: 'pipeType', field: 'supportDetails.pipeType', fieldType: FieldType.object, 
          filter: { filterType: FilterType.string, filterName: 'pipeType' }, objectReference: row => row['supportDetails']['pipeType']},

          { title: 'fab', field: 'supportDetails.fab', fieldType: FieldType.object, 
          filter: { filterType: FilterType.string, filterName: 'fab' }, objectReference: row => row['supportDetails']['fab']},


          { title: 'scScope', field: 'supportDetails.scScope', fieldType: FieldType.object, 
          filter: { filterType: FilterType.string, filterName: 'scScope' }, objectReference: row => row['supportDetails']['scScope']},

          { title: 'supcount', field: 'supportDetails.supcount', fieldType: FieldType.object, 
          filter: { filterType: FilterType.string, filterName: 'supcount' }, objectReference: row => row['supportDetails']['supcount']},

          
          // { title: 'status', field: 'supportDetails.status', fieldType: FieldType.object, 
          // filter: { filterType: FilterType.string, filterName: 'status' }, objectReference: row => row['supportDetails']['status']},

          { title: 'rse', field: 'supportDetails.rse', fieldType: FieldType.object, 
          filter: { filterType: FilterType.string, filterName: 'rse' }, objectReference: row => row['supportDetails']['rse']},

          { title: 'rseDate', field: 'supportDetails.rseDate', fieldType: FieldType.object, 
          filter: { filterType: FilterType.date_default, filterName: 'rseDate' }, objectReference: row => row['supportDetails']['rseDate']},)
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

      {place: ButtonPlace.header, icon: ButtonIcon.excel, disabled: false, 
      entity: [SecurityEntity.settings], action: SecurityAction.read ,customFunction: this.exportData},

    


    
  ]
    return tableButtons;
  }


}
