import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { AppUsers } from 'src/app/core/models/app-users.model';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { AppUserRole } from 'src/app/core/models/app-user-role.model';
import { AppUserRoles } from 'src/app/core/services/app-user.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { FieldType, TableColumn } from 'src/app/core/models/table-model/table-column.model';
import { FilterType } from 'src/app/pages/shared/table-template/modules/table-filter.module';
import { TableFunctionArgument } from 'src/app/core/models/table-model/table-function-argument';
import { TableTemplateComponent } from 'src/app/pages/shared/table-template/table-template.component';
import { TableParameter, selectionMode } from 'src/app/core/models/table-model/table-parameter.model';
import { ButtonIcon, ButtonPlace, TableButton } from 'src/app/core/models/table-model/table-button.model';
import { FormType } from 'src/app/core/miscellaneous/global-props.template';


@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss']
})

export class FormListComponent implements OnInit {

  excelData: any
  Tabs: number = 0;
  role: AppUserRole;
  tableParam: TableParameter;
  subscriptions = new Subscription();

  @ViewChild('tbl') tblComponent: TableTemplateComponent;

  constructor( private router : Router, private apiService: ApiService, private utilities: UtilitiesService ) { this.initTableParam() }

  ngOnInit(): void { }

  async initTableParam() {
    let appUser:AppUsers = await this.utilities.getCurrentAppUser();
    appUser.roles.forEach(role =>{
      this.role = role;
    })

    let param: TableParameter = new TableParameter();
    param.columns = this.initTableColumns();
    param.sort = 'dateTime,desc'
    param.api = ApiURL.inboxes + "?assignedToId.equals=" +  appUser.userId + "&readTime.specified=false";
    param.withCache = true
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
        { title: 'Form No', field: 'message', fieldType: FieldType.string, width: '20%', filter: { filterType: FilterType.date_default, filterName: 'message' }},
        { title: 'Title', field: 'title', fieldType: FieldType.string, width: '10%',filter: { filterType: FilterType.string, filterName: 'title' }},
        { title: 'Comments', field: 'description', fieldType: FieldType.string, width: '40%',filter: { filterType: FilterType.string, filterName: 'description' }},
        { title: 'Assigned By', field: 'assignedByName', fieldType: FieldType.string, width: '20%',filter: { filterType: FilterType.string, filterName: 'assignedByName' }},
        { title: 'Date Time', field: 'dateTime', fieldType: FieldType.date, width: '10%',filter: { filterType: FilterType.date_default, filterName: 'dateTime' }},
      ];
    return tableColumns;
  }

  initTableButtons(): TableButton[] {
    let tableButtons: TableButton[] =
      [
        { title: 'Export', place: ButtonPlace.footer, icon: ButtonIcon.export, customFunction: this.exportData, disabled: false },
      ];
    return tableButtons;
  }

  onRowSelected = (event): Promise<void> => {
    return new Promise((resolve, reject) => {
      let parm = {
        id: event.selected.formId,
        formType: event.selected.formType,
        assignedById: event.selected.assignedById,
      }
      // if (this.role.roleId == AppUserRoles.qc_inspector) {
      //   parm.assignedById = event.selected.assignedById
      //   this.router.navigate(['rfi/insp-result', parm])
      // } else if (this.role.roleId == AppUserRoles.site_engineer && event.selected.title == 'Revise') {
      //   parm['status'] = 'Revise'
      //   parm['taskId'] = event.selected.id
      //   this.router.navigate(['rfi/initiate-rfi', parm])
      // } else {
      //   if (event.selected.title == "Result") {
      //     this.updateReadStatus(event.selected);
      //     this.router.navigate(['rfi/insp-tracker', parm])
      //   } else {
          this.router.navigate(['forms/form-track', parm])
      //   }
      // }
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

}
