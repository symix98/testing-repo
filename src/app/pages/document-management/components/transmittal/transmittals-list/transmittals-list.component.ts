import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { TableColumn, FieldType } from 'src/app/core/models/table-model/table-column.model';
import { TableParameter, selectionMode } from 'src/app/core/models/table-model/table-parameter.model';
import { FilterType } from 'src/app/pages/shared/table-template/modules/table-filter.module';
import { RegisterTransmittalComponent } from '../register-transmittal/register-transmittal.component';

@Component({
  selector: 'app-transmittals-list',
  templateUrl: './transmittals-list.component.html',
  styleUrls: ['./transmittals-list.component.scss']
})
export class TransmittalsListComponent implements OnInit {

  tableParam: TableParameter;
  
  constructor(private dialogService: DialogService,) { }

  ngOnInit(): void {
    this.initTableParam();
  }

  async initTableParam() {
    let param: TableParameter = new TableParameter();
    param.api = ApiURL.transmittals;
    param.dataKey = 'id';
    param.advancedSearch = true;
    param.alwaysShowAdvanced = true;
    param.columns = this.initTableColumns();
    param.showToggler = false;
    param.scrollHeight = '65vh';
    param.selectionMode = selectionMode.single;
    param.onRowSelected = this.onRowSelected ;
    this.tableParam = param;
  }

  initTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] = [
      {
        title: 'Project Name',
        field: 'projectName',
        fieldType: FieldType.string,
        filter: {
          filterType: FilterType.string,
          filterName: 'projectName',
        },
      },
      {
        title: 'Transmittal Number',
        field: 'transmittalNo',
        fieldType: FieldType.string,
        filter: {
          filterType: FilterType.string,
          filterName: 'transmittalNo',
        },
      },
      {
        title: 'Subject',
        field: 'subject',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'subject' },
      },
      {
        title: 'Purpose',
        field: 'purpose',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'purpose' },
      },
      {
        title: 'Remarks',
        field: 'comments',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'comments' },
      },
      {
        title: 'Type',
        field: 'type',
        fieldType: FieldType.string,
        filter: {
          filterType: FilterType.string,
          filterName: 'type',
        },
      },
      {
        title: 'Status',
        field: 'status',
        fieldType: FieldType.string,
        filter: { filterType: FilterType.string, filterName: 'status' },
      },
    ];
    return tableColumns;
  }

  onRowSelected = (event): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.dialogService.open(RegisterTransmittalComponent, {
      width: '85vw',
      height: '85vh',
      data: { transmittal: event.selected, editingMode: true },
    }).onClose.subscribe((res) => {
      if(res === true) {
        this.tableParam = null;
        this.initTableParam();
      }
    })
      resolve();
    });
  };

}
