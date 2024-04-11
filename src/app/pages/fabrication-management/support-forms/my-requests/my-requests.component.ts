import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { AppUserRole } from 'src/app/core/models/app-user-role.model';
import { AppUsers } from 'src/app/core/models/app-users.model';
import { SecurityAction } from 'src/app/core/models/security-model/security-action.model';
import { ISecurityButton } from 'src/app/core/models/security-model/security-component.model';
import { SecurityEntity } from 'src/app/core/models/security-model/security-entity.model';
import { TableButton, ButtonPlace, ButtonIcon } from 'src/app/core/models/table-model/table-button.model';
import { TableColumn, FieldType } from 'src/app/core/models/table-model/table-column.model';
import { TableFunctionArgument } from 'src/app/core/models/table-model/table-function-argument';
import { TableParameter, selectionMode } from 'src/app/core/models/table-model/table-parameter.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { FilterType } from 'src/app/pages/shared/table-template/modules/table-filter.module';
import { TableTemplateComponent } from 'src/app/pages/shared/table-template/table-template.component';


@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.scss']
})

export class MyRequestsComponent implements OnInit {

  excelData: any
  Tabs: number = 0;
  role: AppUserRole;
  tableParam: TableParameter;
  subscriptions = new Subscription();
  @ViewChild('tbl') tblComponent: TableTemplateComponent;

  constructor(private router: Router, private apiService: ApiService, private utilities: UtilitiesService) {
    this.initTableParam()
  }

  ngOnInit(): void { }

  async initTableParam() {
    let appUser:AppUsers = await this.utilities.getCurrentAppUser();
    appUser.roles.forEach(role =>{
      this.role = role;
    })

    let param: TableParameter = new TableParameter();
    param.columns = this.initTableColumns();
    param.dataKey = 'id'
    param.api = ApiURL.form + "?createdBy.equals=" +  appUser.name
    param.advancedSearch = true;
    param.alwaysShowAdvanced = true;
    param.selectionMode = selectionMode.single
    param.onRowSelected = this.onRowSelected;
    param.buttons = this.initTableButtons()
    this.tableParam = param;
  }

  initTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] =
      [
        { title: 'Form Name', field: 'formName', fieldType: FieldType.string, width: '20%', filter: { filterType: FilterType.date_default, filterName: 'formName' }},
        { title: 'Form Description', field: 'formDescription', fieldType: FieldType.string, width: '20%',filter: { filterType: FilterType.string, filterName: 'formDescription' }},
        { title: 'Form Type', field: 'formType', fieldType: FieldType.string, width: '20%',filter: { filterType: FilterType.string, filterName: 'formType' }},
        { title: 'Status', field: 'status', fieldType: FieldType.string, width: '10%',filter: { filterType: FilterType.string, filterName: 'status' }},
        { title: 'Created By', field: 'createdBy', fieldType: FieldType.string, width: '10%',filter: { filterType: FilterType.string, filterName: 'createdBy' }},
        { title: 'Created Date', field: 'createdAt', fieldType: FieldType.date, width: '10%',filter: { filterType: FilterType.date_default, filterName: 'createdAt' }},
        { title: 'Modified Date', field: 'updatedAt', fieldType: FieldType.date, width: '10%',filter: { filterType: FilterType.date_default, filterName: 'updatedAt' }},
      ];
    return tableColumns;
  }

  initTableButtons(): ISecurityButton[] {
    let tableButtons: ISecurityButton[] =
      [
        // { title: 'Export', place: ButtonPlace.header, icon: ButtonIcon.export, customFunction: this.exportData, disabled: false, action:SecurityAction.read,entity:[SecurityEntity.settings]},
        { title: 'New RSF', place: ButtonPlace.header, icon: ButtonIcon.add, customFunction: this.newRequest, disabled: false, action:SecurityAction.manage,entity:[SecurityEntity.rsfFom]},
      ];
    return tableButtons;
  }

  onRowSelected = (event): Promise<void> => {
    return new Promise((resolve, reject) => {
      let parm = {
        id: event.selected.id,
        formType: event.selected.formType,
      }
      this.router.navigate(['forms/form-track', parm])
      resolve();
    });
  }

  updateReadStatus(inboxItem): Promise<void> {
    return new Promise((resolve, reject) => {
      inboxItem.unread = false;
      inboxItem.readTime = new Date();
      this.apiService.put(ApiURL.inboxes, inboxItem).subscribe((res) => {
        resolve();
      }, () => {
        resolve();
      });
    })
  }

  exportData = (args: TableFunctionArgument): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      console.log('Excel Clicked');
      resolve(args);
    })
  }

  newRequest = (args: TableFunctionArgument): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      this.router.navigate(['forms/rsf-form'])
      resolve(args);
    })
  }

}
