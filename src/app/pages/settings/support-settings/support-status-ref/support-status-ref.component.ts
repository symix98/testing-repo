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
import { SupportsModel } from 'src/app/core/models/support-fab-models/supports.model';
import { ButtonPlace, ButtonIcon } from 'src/app/core/models/table-model/table-button.model';
import { TableColumn, FieldType } from 'src/app/core/models/table-model/table-column.model';
import { TableParameter, selectionMode } from 'src/app/core/models/table-model/table-parameter.model';
import { ApiService } from 'src/app/core/services/api.service';
import { CustomTableService } from 'src/app/core/services/custom-table.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { FilterType } from 'src/app/pages/shared/table-template/modules/table-filter.module';
import { SupportStatusFormComponent } from './components/support-status-form/support-status-form.component';

@Component({
  selector: 'app-support-status-ref',
  templateUrl: './support-status-ref.component.html',
  styleUrls: ['./support-status-ref.component.scss']
})
export class SupportStatusRefComponent implements OnInit {

  subscriptions = new Subscription();
  tableParam: TableParameter;
  InspStatus: any[] = []
  items: MenuItem[];

  excelData: any[];
  user: AppUsers
  @Input() parentHeader: SupportsModel;
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
    
    let param: TableParameter = new TableParameter();
    param.api = ApiURL.status_refs 
    param.dataKey = 'id'
    param.advancedSearch = true;
    param.alwaysShowAdvanced = true;
    param.columns = this.initTableColumns();
    param.selectionMode = selectionMode.single
    // param.showToggler = true
    // param.scrollHeight = "65vh"
    // param.onRowSelected = this.onRowSelected
    this.tableParam = param;
    // param.buttons = this.initTableButtons();

  }

  



  initTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] =
        [
          { title: 'Status', field: 'status', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'status' }},       
          { title: 'Status Name', field: 'satatusName', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'satatusName' }},       
          { title: 'Is Subcontractor', field: 'isSubcontractor', fieldType: FieldType.boolean, filter: { filterType: FilterType.boolean, filterName: 'isSubcontractor' }},
          { title: 'Is CCC', field: 'isCCC', fieldType: FieldType.boolean, filter: { filterType: FilterType.boolean, filterName: 'isCCC' }},
          { title: 'Modified By', field: 'modifyBy', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'modifyBy' }},
          { title: 'Modified Date', field: 'modifyDate', fieldType: FieldType.date, filter: { filterType: FilterType.date_default, filterName: 'modifyDate' }},
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

  addNewStatus(){
    this.dialogService.open(SupportStatusFormComponent, {
      header :'Add New Status',
      width : '70%',
    }).onClose.subscribe(res =>{
      if(res){
        this.tableParam = null

      setTimeout(() => {
        this.initTableParam()
      }, 10);
      }
      
    })
    
  }

}
