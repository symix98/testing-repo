import { Component, Input, OnInit } from '@angular/core';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { TableColumn, FieldType } from 'src/app/core/models/table-model/table-column.model';
import { editMode, selectionMode, TableParameter } from 'src/app/core/models/table-model/table-parameter.model';
import { FilterType } from '../shared/table-template/modules/table-filter.module';
import { Router } from '@angular/router';


@Component({
  selector: 'app-materials-takeoff',
  templateUrl: './materials-takeoff.component.html',
  styleUrls: ['./materials-takeoff.component.scss']
})
export class MaterialsTakeoffComponent implements OnInit {
  mtoList: any[] = [];
  mtoListCols: any[] = [];
  isLoading: Boolean = false;
  tableParam: TableParameter;
  @Input() apiUrl: string;
  @Input() defaultFilter: Map<string, any>;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.mtoListCols = [
      { field: 'name', header: 'Name' },
      { field: 'type', header: 'Type' },
      { field: 'material', header: 'Material' },
    ];


    this.mtoList = [
      { id: 1, name: 'Name1', type: 'Type1', material: 'Materail1' },
      { id: 2, name: 'Name2', type: 'Type1', material: 'Materail2' },
      { id: 3, name: 'Name3', type: 'Type1', material: 'Materail3' },
      { id: 4, name: 'Name4', type: 'Type1', material: 'Materail4' },
      { id: 5, name: 'Name5', type: 'Type1', material: 'Materail5' },
    ];

    this.initTableParams()
  }


  initTableParams() {
    let param: TableParameter = new TableParameter();
    // param.buttons = this.initTableButtons();
    // param.selectionMode = selectionMode.mulitple;
    param.api = this.apiUrl ? this.apiUrl : ApiURL.documents;
    param.defaultFilter = this.defaultFilter ? this.defaultFilter : undefined;
    param.dataKey = "name"
    param.advancedSearch = true
    param.alwaysShowAdvanced = true
    param.selectionMode = selectionMode.single;
    param.columns = this.initTableColumns();
    // param.buttons = this.initTableButtons();
    param.sort = "modificationDate,desc";
    // param.virtualScroll = true
    // param.scrollHeight = "35vw"
    this.tableParam = param;
  }

  initTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] =
      [
        { title: 'Name', field: 'name', filter: { filterType: FilterType.string, filterName: 'name' }, fieldType: FieldType.string, width: '30%' },
        { title: 'Type', field: 'type', filter: { filterType: FilterType.string, filterName: 'type' }, fieldType: FieldType.object, width: '30%', objectReference: row => row["type"] },
        { title: 'Material', field: 'material', filter: { filterType: FilterType.string, filterName: 'material' }, fieldType: FieldType.string, width: '40%' },
      ]
    return tableColumns;
  }

  viewMTO() {
    this.router.navigate(['mto-view'])

  }
}
