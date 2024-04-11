import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { WorkFlowService } from 'src/app/core/services/work-flow.service';
import { FilterType } from '../../shared/table-template/modules/table-filter.module';
import { FieldType, TableColumn } from 'src/app/core/models/table-model/table-column.model';
import { TableParameter, selectionMode } from 'src/app/core/models/table-model/table-parameter.model';


@Component({
  selector: 'app-fab-list',
  templateUrl: './fab-list.component.html',
  styleUrls: ['./fab-list.component.scss']
})

export class FabListComponent implements OnInit {

  data: any;
  tableParam: TableParameter;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.initTableParams()
  }

  initTableParams() {
    let param: TableParameter = new TableParameter();
    param.columns = this.initTableColumns();
    param.selectionMode = selectionMode.single;
    param.api = ApiURL.details;
    param.advancedSearch = true;
    param.alwaysShowAdvanced = true;
    param.onRowSelected = this.onRowSelected;
    this.tableParam = param;
  }

  initTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] =
      [
        { title: 'Area', field: 'area', fieldType: FieldType.string, width: '30%', filter: { filterType: FilterType.string, filterName: 'area' } },
        { title: 'Location', field: 'location',fieldType: FieldType.string, width: '32%', filter: { filterType: FilterType.string, filterName: 'location' },},
        { title: 'Description',field: 'description', fieldType: FieldType.string, width: '40%', filter: { filterType: FilterType.string, filterName: 'description' }, },
      ]
    return tableColumns;
  }

  onRowSelected = (event): Promise<void> => {
    return new Promise((resolve, reject) => {
      let parm = { id: event.selected.id }
      this.router.navigate(['fab-init/fab-tracker', parm])
    });
  }

}
