import { Component, Input, OnInit } from '@angular/core';
import { ISecurityButton } from 'src/app/core/models/security-model/security-component.model';
import { ButtonIcon, ButtonPlace } from 'src/app/core/models/table-model/table-button.model';
import { SecurityAction } from 'src/app/core/models/security-model/security-action.model';
import { FieldType, TableColumn } from 'src/app/core/models/table-model/table-column.model';
import { ApiService } from 'src/app/core/services/api.service';
import { CustomTableService } from 'src/app/core/services/custom-table.service';
import { editMode, selectionMode, TableParameter } from 'src/app/core/models/table-model/table-parameter.model';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { FilterType } from '../shared/table-template/modules/table-filter.module';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/core/models/storage-service.model';
import { SecurityEntity } from 'src/app/core/models/security-model/security-entity.model';
@Component({
  selector: 'app-services',
  templateUrl: './storage-services.component.html',
  styleUrls: ['./storage-services.component.scss']
})
export class ServicesComponent implements OnInit {
  tableParam: TableParameter
  @Input() storageService:StorageService
  constructor(private tableService: CustomTableService,private apiSevice:ApiService , private router: Router) {
    this.initTableParams();

   }

  ngOnInit(): void {
    this.apiSevice.get("storage-services").subscribe(data=>{
      console.log("Data :: ", data)
    })
  }

  initTableParams() {
    let param: TableParameter = new TableParameter();
    param.buttons = this.initTableButtons();
    param.columns = this.initTableColumns();
    param.selectionMode = selectionMode.single;
    param.api = ApiURL.storage_service;
     param.editMode = editMode.redirect;
    param.dataKey = "serviceId"
    param.advancedSearch = true;
    param.alwaysShowAdvanced = true;
    // param.rowEdit = this.submit;
    param.onRowSelected = this.onRowSelected;
    param.sort ="name"
    this.tableParam = param;
  }
  initTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] =
      [
        { title: 'Service Id', disableSort:false, field: 'serviceId', filter: { filterType: FilterType.string, filterName: 'serviceId' }, fieldType: FieldType.string, width: '22%' },
        { title: 'Secret Key',disableSort:false,field: 'secretKey',filter: { filterType: FilterType.string, filterName: 'secretKey' }, fieldType: FieldType.string, width: '22%' },
        { title: 'Name', field: 'name',disableSort:false, filter: { filterType: FilterType.string, filterName: 'name' }, fieldType: FieldType.string, width: '15%'},
        { title: 'Description',filter: { filterType: FilterType.string, filterName: 'description' },disableSort:false, field: 'description', fieldType: FieldType.string, width: '28%' },
        { title: 'Service Type',disableSort:false,filter: { filterType: FilterType.string, filterName: 'serviceType' }, field: 'serviceType', fieldType: FieldType.string, width: '12%' },
      ]
    return tableColumns;
  }


  initTableButtons(): ISecurityButton[] {
    let tableButtons: ISecurityButton[] = [
      { title: 'Add New Storage', place: ButtonPlace.header, icon: ButtonIcon.add, customFunction: this.onRowSelected, disabled: false, entity: [SecurityEntity.engineering,SecurityEntity.engineering_drawing], action: SecurityAction.create },
      { title: 'Export', place: ButtonPlace.header, icon: ButtonIcon.export, customFunction: this.tableService.exportData, disabled: false , entity:[SecurityEntity.engineering ,SecurityEntity.engineering_drawing], action: SecurityAction.read},
    ]
    return tableButtons;
  }
  onRowSelected = (event): Promise<void> => {
    return new Promise((resolve, reject) => {
      const param = this.storageService ? { serviceId: event?.selected?.serviceId } : { serviceId: event?.selected?.serviceId  };
      this.router.navigate(['services/create', event.selected == null ? {} : param]);
      resolve();
    });
  }

  submit = (event?): Promise<void> => {
    return new Promise((resolve, reject) => {
     resolve();
    });
  }

}
