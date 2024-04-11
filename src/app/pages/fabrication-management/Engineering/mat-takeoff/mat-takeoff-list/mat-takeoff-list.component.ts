import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { AppUsers } from 'src/app/core/models/app-users.model';
import { ISecurityButton } from 'src/app/core/models/security-model/security-component.model';
import { MtoLookupModel } from 'src/app/core/models/support-fab-models/mto-lookup.model';
import { TableColumn, FieldType } from 'src/app/core/models/table-model/table-column.model';
import { TableParameter, selectionMode } from 'src/app/core/models/table-model/table-parameter.model';
import { ApiService } from 'src/app/core/services/api.service';
import { CustomTableService } from 'src/app/core/services/custom-table.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { FilterType } from 'src/app/pages/shared/table-template/modules/table-filter.module';
import { SupportPictorialComponent } from '../../support-pictorial/support-pictorial.component';
import { PopupMtoDetailsComponent } from 'src/app/pages/shared/table-template/compnents/popup-mto-details/popup-mto-details.component';

@Component({
  selector: 'app-mat-takeoff-list',
  templateUrl: './mat-takeoff-list.component.html',
  styleUrls: ['./mat-takeoff-list.component.scss']
})
export class MatTakeoffListComponent implements OnInit {

  subscriptions = new Subscription();
  tableParam: TableParameter;
  InspStatus: any[] = []
  items: MenuItem[];

  excelData: any[];
  user: AppUsers
  @Input() input: any;
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
    if(this.input){
      this.initTableCustomParam()
    }else{
      this.initTableParam()
    }
    
  }
  initTableCustomParam(){
    let param: TableParameter = new TableParameter();
    console.log(this.input)
    if(this.input?.isono){
      param.api = ApiURL.mto_lookups + "?isono.equals=" + this.input.isono
    }
    else{
      if(this.input?.supportDetails?.supCode){
        param.api = ApiURL.mto_lookups + "?isono.equals=" + this.input.support
  
      }
    }
    
    
    param.dataKey = 'id'
    param.sort ='itemno,asc'
    param.advancedSearch = true;
    param.alwaysShowAdvanced = true;
    param.columns = this.initTableColumns1();
    param.selectionMode = selectionMode.single
    param.showToggler = true
    // param.scrollHeight = "65vh"
    // param.onRowSelected = this.onRowSelected
    this.tableParam = param;
    param.buttons = this.initTableButtons();
  }
  async initTableParam() {
    // this.initTableButtons()

    let param: TableParameter = new TableParameter();
    param.api = ApiURL.mto_lookups
    param.dataKey = 'id'
    param.advancedSearch = true;
    param.alwaysShowAdvanced = true;
    param.columns = this.initTableColumns();
    param.selectionMode = selectionMode.single
    param.showToggler = true
    param.scrollHeight = "65vh"
    param.onRowSelected = this.onRowSelected
    this.tableParam = param;
    param.buttons = this.initTableButtons();

  }



  initTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] =
        [
          //MTOs 
            { title: 'isono', field: 'isono', fieldType: FieldType.string, width:'20%', filter: { filterType: FilterType.string, filterName: 'isono' }},
            { title: 'material', field: 'material', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'material' }},
            { title: 'source', field: 'source', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'source' }},
            { title: 'matcode', field: 'matcode', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'matcode' }},
            { title: 'matsubcode', field: 'matsubcode', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'matsubcode' }},
            { title: 'part', field: 'part', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'part' }},
            { title: 'scope', field: 'scope', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'scope' }},
            { title: 'qty', field: 'qty', fieldType: FieldType.number,  filter: { filterType: FilterType.number, filterName: 'qty' }},
            { title: 'length', field: 'length', fieldType: FieldType.number,  filter: { filterType: FilterType.number, filterName: 'length' }},
            { title: 'width', field: 'width', fieldType: FieldType.number,  filter: { filterType: FilterType.number, filterName: 'width' }},
            { title: 'remarks1', field: 'remarks1', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'remarks1' }},
            { title: 'remarks2', field: 'remarks2', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'remarks2' }},
            { title: 'supcode', field: 'supcode', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'supcode' }},
            { title: 'bscode', field: 'bscode', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'bscode' }},
            { title: 'tag', field: 'tag', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'tag' }},
            { title: 'remark', field: 'remark', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'remark' }},
            { title: 'itemno', field: 'itemno', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'itemno' }},
            { title: 'mark', field: 'mark', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'mark' }},
            { title: 'matflag', field: 'matflag', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'matflag' }},
            { title: 'oldmatcode', field: 'oldmatcode', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'oldmatcode' }},
            { title: 'oldmtpart1', field: 'oldmtpart1', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'oldmtpart1' }},
            { title: 'oldmtpart2', field: 'oldmtpart2', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'oldmtpart2' }},
            { title: 'oldmtpart3', field: 'oldmtpart3', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'oldmtpart3' }},
            { title: 'newcode', field: 'newcode', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'newcode' }},
            { title: 'oldcode', field: 'oldcode', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'oldcode' }},
            { title: 'ccc', field: 'ccc', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'ccc' }},
            { title: 'sc', field: 'sc', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'sc' }},
            { title: 'pipe', field: 'pipe', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'pipe' }},
            { title: 'piptype', field: 'piptype', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'piptype' }},
            { title: 'fab', field: 'fab', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'fab' }},
            { title: 'category', field: 'category', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'category' }},
            { title: 'scScope', field: 'scScope', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'scScope' }},
            { title: 'weldedSup', field: 'weldedSup', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'weldedSup' }},
            { title: 'shopWeld', field: 'shopWeld', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'shopWeld' }},
            { title: 'padClamp', field: 'padClamp', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'padClamp' }},
            { title: 'runPsize', field: 'runPsize', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'runPsize' }},
            { title: 'padclmpthk', field: 'padclmpthk', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'padclmpthk' }},
            { title: 'ribPltflg', field: 'ribPltflg', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'ribPltflg' }},
            { title: 'paintflag', field: 'paintflag', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'paintflag' }},
            { title: 'type', field: 'type', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'type' }},
            // { title: 'createdBy', field: 'createdBy', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'createdBy' }},
            // { title: 'creationDate', field: 'creationDate', fieldType: FieldType.date,  filter: { filterType: FilterType.date_default, filterName: 'creationDate' }},
            // { title: 'modifiedDate', field: 'modifiedDate', fieldType: FieldType.date,  filter: { filterType: FilterType.date_equals, filterName: 'modifiedDate' }},
          
        ];
      return tableColumns;
  }
  initTableColumns1(): TableColumn[] {
    let tableColumns: TableColumn[] =
        [
          //MTOs 
            {title: '',field:'',fieldType: FieldType.component, specialColumn : PopupMtoDetailsComponent, disableSort:true,isOption:true},
            { title: 'isono', field: 'isono', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'isono' }},
            { title: 'itemno', field: 'itemno', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'itemno' }},
            { title: 'material', field: 'material', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'material' }},
            { title: 'source', field: 'source', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'source' }},
            { title: 'matcode', field: 'matcode', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'matcode' }},
            
            { title: 'matsubcode', field: 'matsubcode', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'matsubcode' }},
            { title: 'part', field: 'part', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'part' }},
            { title: 'scope', field: 'scope', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'scope' }},
            { title: 'qty', field: 'qty', fieldType: FieldType.number,  filter: { filterType: FilterType.number, filterName: 'qty' }},
            { title: 'length', field: 'length', fieldType: FieldType.number,  filter: { filterType: FilterType.number, filterName: 'length' }},
            { title: 'width', field: 'width', fieldType: FieldType.number,  filter: { filterType: FilterType.number, filterName: 'width' }},
            { title: 'remarks1', field: 'remarks1', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'remarks1' },isHide:true},
            { title: 'remarks2', field: 'remarks2', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'remarks2' },isHide:true},
            { title: 'supcode', field: 'supcode', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'supcode' },isHide:true},
            { title: 'bscode', field: 'bscode', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'bscode' }},
            { title: 'tag', field: 'tag', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'tag' },isHide:true},
            { title: 'remark', field: 'remark', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'remark' },isHide:true},
            
            { title: 'mark', field: 'mark', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'mark' },isHide:true},
            { title: 'matflag', field: 'matflag', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'matflag' },isHide:true},
            { title: 'oldmatcode', field: 'oldmatcode', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'oldmatcode' },isHide:true},
            { title: 'oldmtpart1', field: 'oldmtpart1', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'oldmtpart1' },isHide:true},
            { title: 'oldmtpart2', field: 'oldmtpart2', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'oldmtpart2' },isHide:true},
            { title: 'oldmtpart3', field: 'oldmtpart3', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'oldmtpart3' },isHide:true},
            { title: 'newcode', field: 'newcode', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'newcode' },isHide:true},
            { title: 'oldcode', field: 'oldcode', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'oldcode' },isHide:true},
            { title: 'ccc', field: 'ccc', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'ccc' },isHide:true},
            { title: 'sc', field: 'sc', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'sc' },isHide:true},
            { title: 'pipe', field: 'pipe', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'pipe' },isHide:true},
            { title: 'piptype', field: 'piptype', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'piptype' },isHide:true},
            { title: 'fab', field: 'fab', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'fab' },isHide:true},
            { title: 'category', field: 'category', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'category' },isHide:true},
            { title: 'scScope', field: 'scScope', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'scScope' },isHide:true},
            { title: 'weldedSup', field: 'weldedSup', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'weldedSup' },isHide:true},
            { title: 'shopWeld', field: 'shopWeld', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'shopWeld' },isHide:true},
            { title: 'padClamp', field: 'padClamp', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'padClamp' },isHide:true},
            { title: 'runPsize', field: 'runPsize', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'runPsize' },isHide:true},
            { title: 'padclmpthk', field: 'padclmpthk', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'padclmpthk' },isHide:true},
            { title: 'ribPltflg', field: 'ribPltflg', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'ribPltflg' },isHide:true},
            { title: 'paintflag', field: 'paintflag', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'paintflag' },isHide:true},
            { title: 'type', field: 'type', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'type' },isHide:true},
            // { title: 'createdBy', field: 'createdBy', fieldType: FieldType.string,  filter: { filterType: FilterType.string, filterName: 'createdBy' }},
            // { title: 'creationDate', field: 'creationDate', fieldType: FieldType.date,  filter: { filterType: FilterType.date_default, filterName: 'creationDate' }},
            // { title: 'modifiedDate', field: 'modifiedDate', fieldType: FieldType.date,  filter: { filterType: FilterType.date_equals, filterName: 'modifiedDate' }},
          
        ];
      return tableColumns;
  }

  onRowSelected = (event): Promise<void> => {
    return new Promise((resolve, reject) => {
      let parm = {
        id: event.selected.id,
      }
      this.router.navigate(['support-fabrication/mto/mto-form', parm])
      this.dialogRef.close(event)
      resolve();
    });
  }
  initTableButtons(): ISecurityButton[] {
    let tableButtons: ISecurityButton[] = [
  //  { title: 'Export', place: ButtonPlace.footer, icon: ButtonIcon.export, customFunction: this.exportData, disabled: false, entity: [SecurityEntity.settings], action: SecurityAction.read },
    ]
    return tableButtons;
  }

}
